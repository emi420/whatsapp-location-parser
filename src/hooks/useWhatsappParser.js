import { useState, useEffect } from 'react';

export const LOCATION_PREFIX = "https://maps.google.com/?q=";
const LOCATION_PREFIX_LEN = LOCATION_PREFIX.length;
const MSG_PATTERN = /(.*) - (.*?): (.*)/;

// Parse datetime, username and message
const parseMessage = (line) => {
    const match = line.match(MSG_PATTERN);
    if (match) {
        let msgObject = {
            datetime: new Date(match[1]),
            username:  match[2],
            message: match[3],
        }
        const jpgIndex = msgObject.message.toLowerCase().indexOf(".jpg");
        if (jpgIndex > 0) {
            msgObject.file = msgObject.message.substring(0,jpgIndex + 4);
        }
        return msgObject;
    }
}

// Get closest message from the same user
const getClosestMessage = (messages, msgIndex) => {
    let prevIndex = msgIndex - 1;
    let nextIndex = msgIndex + 1;
    let prevMessage;
    let nextMessage;
    let message = messages[msgIndex];

    while (
      (messages[prevIndex] || messages[nextIndex]) && 
      !(nextMessage && prevMessage) ) {
      if (messages[prevIndex] &&
          messages[prevIndex].username === message.username &&
         !prevMessage) {
        const delta_prev = Math.abs(messages[msgIndex].datetime - messages[prevIndex].datetime);
        prevMessage = {
            index: prevIndex, 
            delta: delta_prev
        }
      }
    
      if (messages[nextIndex] && 
          messages[nextIndex].username === message.username &&
          !nextMessage) {
        const delta_next = Math.abs(messages[msgIndex].datetime - messages[nextIndex].datetime);
        nextMessage = {
            index: nextIndex, 
            delta: delta_next
        }
      }

      prevIndex--;
      nextIndex++;
    }

    if (prevMessage && nextMessage) {

      if (prevMessage.delta === nextMessage.delta) {
        return {
            ...messages[prevMessage.index],
            message: messages[prevMessage.index].message + ". " + messages[nextMessage.index].message
        }
      } else if (prevMessage.delta < nextMessage.delta) {
        return messages[prevMessage.index];
      } else if (prevMessage.delta > nextMessage.delta) {
        return messages[nextMessage.index];
      }

    } else if (prevMessage) {
      return messages[prevMessage.index];
    } else if (nextMessage) {
      return messages[nextMessage.index];
    }
    return message;
}

// Get closest next message from the same user
const getClosestNextMessage = (messages, msgIndex) => {
    return getClosestMessageByDirection(messages, msgIndex, 1);
}

// Get closest previous message from the same user
const getClosestPrevMessage = (messages, msgIndex) => {
    return getClosestMessageByDirection(messages, msgIndex, -1);
}

// Get closest next/prev message from the same user
const getClosestMessageByDirection = (messages, msgIndex, direction) => {
    let nextIndex = msgIndex + direction;
    let nextMessage;
    let message = messages[msgIndex];
    while (
      (messages[nextIndex]) && !(nextMessage) ) {
    
      if (messages[nextIndex] && 
          messages[nextIndex].username === message.username &&
          !nextMessage) {
        const delta_next = Math.abs(messages[msgIndex].datetime - messages[nextIndex].datetime);
        nextMessage = {
            index: nextIndex, 
            delta: delta_next
        }
      }
      nextIndex += direction;
    }
    if (nextMessage) {
      return messages[nextMessage.index];
    }
    return message;
}

// Parse messages from lines and create an index
const parseAndIndex = (lines) => {
    let index = 0;
    const result = {};
    lines.forEach((line) => {
        const msg = parseMessage(line, index);
        if (msg) {
            result[index] = msg;
            index++;
        }
    })
    return result;
}

// Hook for parsing messages from a text
function useWhatsappParser({ text, msgPosition}) {

    const [geoJSON, setGeoJSON] = useState(null);

    useEffect(() => {
        if (!text) return;
        const lines = text.split("\n");
        const geoJSON = {
            type: "FeatureCollection",
            features: []
        };
        let featureObject = {}
        let last_line_is_location = false;
    
        // Creates an indexed dictionary for messages
        const messages = parseAndIndex(lines);

        Object.values(messages).forEach((msgObject, index) => {
            if (msgObject.message) {
                const location_index = msgObject.message.indexOf(LOCATION_PREFIX);
                if (location_index > -1) {
                    const coordinates_string = msgObject.message.slice(location_index + LOCATION_PREFIX_LEN)
                    const coordinates_array_str = coordinates_string.split(",");
                    if (!last_line_is_location) {
                        featureObject = {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    parseFloat(coordinates_array_str[1]),
                                    parseFloat(coordinates_array_str[0])
                                ]
                            }
                        }
                        last_line_is_location = true;
                    }
                } else if (last_line_is_location) {
                    switch (msgPosition) {
                        case "before":
                            featureObject.properties = {
                                ...getClosestPrevMessage(messages, index - 1)
                            };
                            break;
                        case "after":
                            featureObject.properties = {
                                ...getClosestNextMessage(messages, index - 1)
                            };
                            break;
                        default:
                            featureObject.properties = {
                                ...getClosestMessage(messages, index - 1)
                            };
                            break;
                        }
                        geoJSON.features.push(featureObject);
                    featureObject = {};
                    last_line_is_location = false;
                }
            }
        });

        if (last_line_is_location) {
            geoJSON.features.push(featureObject);
        }
        setGeoJSON(geoJSON);
    }, [text, msgPosition]);

    return [geoJSON];

}

export default useWhatsappParser;
