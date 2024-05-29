import React, { useEffect } from "react";

const LOCATION_PREFIX = "https://maps.google.com/?q=";
const LOCATION_PREFIX_LEN = LOCATION_PREFIX.length;

function WhatsAppParser({ text, onParseText }) {

  useEffect(() => {
    const lines = text.split("\n");
    const geoJSON = {
        type: "FeatureCollection",
        features: []
    };
    let featureObject = {}
    let last_line_is_location = false;
    lines.forEach(line => {
        const location_index = line.indexOf(LOCATION_PREFIX);
        if (location_index > -1) {
            const coordinates_string = line.slice(location_index + LOCATION_PREFIX_LEN)
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
            featureObject.properties = {
                message: line
            };
            geoJSON.features.push(featureObject);
            featureObject = {};
            last_line_is_location = false;
        }
    });
    onParseText(geoJSON);
  }, [text]);

  return (<></>);
}

export default WhatsAppParser;
