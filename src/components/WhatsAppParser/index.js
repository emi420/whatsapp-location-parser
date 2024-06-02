import React, { useEffect } from "react";

const LOCATION_PREFIX = "https://maps.google.com/?q=";
const LOCATION_PREFIX_LEN = LOCATION_PREFIX.length;

const MSG_PATTERN = /(.*) - (.*?): (.*)/;

// Parse datetime, username and message
const parseMessage = (line, index) => {
    const match = line.match(MSG_PATTERN);
    if (match) {
        return {
            datetime: new Date(match[1]),
            username:  match[2],
            message: match[3],
        }
    }
}

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

const getClosestNextMessage = (messages, msgIndex) => {
    return getClosestMessageByDirection(messages, msgIndex, 1);
}

const getClosestPrevMessage = (messages, msgIndex) => {
    return getClosestMessageByDirection(messages, msgIndex, -1);
}

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

const createIndex = (messages) => {
    let index = 0;
    return messages.reduce(
        (accumulator, line) => {
            const msg = parseMessage(line, index);
            if (msg) {
                index++;
                return {
                    ...accumulator,
                    ...{[index]: msg}
                }  
            } else {
                return {...accumulator};
            }
        }, {},
    );
}



function WhatsAppParser({ text, onParseText, msgPosition }) {

  useEffect(() => {
    const lines = text.split("\n");
    const geoJSON = {
        type: "FeatureCollection",
        features: []
    };
    let featureObject = {}
    let last_line_is_location = false;

    // Creates an indexed dictionary for messages
    const messages = createIndex(lines);
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
                            ...getClosestPrevMessage(messages, index)
                        };
                        break;
                    case "after":
                        featureObject.properties = {
                            ...getClosestNextMessage(messages, index)
                        };
                        break;
                    default:
                        featureObject.properties = {
                            ...getClosestMessage(messages, index)
                        };
                        break;
                    }
                geoJSON.features.push(featureObject);
                featureObject = {};
                last_line_is_location = false;
            }
        }
    });
    // if (last_line_is_location) {
    //     geoJSON.features.push(featureObject);
    // }
    onParseText(geoJSON);
  }, [text]);

  return (<></>);
}

export default WhatsAppParser;
