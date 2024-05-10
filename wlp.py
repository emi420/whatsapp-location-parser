import argparse
import json
import sys

LOCATION_PREFIX = "https://maps.google.com/?q="
LOCATION_PREFIX_LEN = len(LOCATION_PREFIX)

def parseLocations(filename):
    with open(filename) as file:
        last_line_is_location = False
        json_obj = {}
        for line in file:
            if line != "":
                txt = line.rstrip()
                location_index = txt.find(LOCATION_PREFIX)
                if location_index > 0:
                    coordinates_string = txt[location_index + LOCATION_PREFIX_LEN:]
                    coordinates = [float(x) for x in coordinates_string.split(",")]
                    if not last_line_is_location:
                        json_obj = {
                            "type": "Feature",
                            "properties": {},
                            "geometry": { "type": "Point", "coordinates": [coordinates[1], coordinates[0]] },
                        }
                        last_line_is_location = True
                elif last_line_is_location:
                    json_obj["properties"] = {"message": txt}
                    last_line_is_location = False
                    sys.stdout.write("{json_string},".format(json_string=json.dumps(json_obj)))
                    json_obj = {}

def main():
    args = argparse.ArgumentParser()
    args.add_argument("--file", "-f", help="File", type=str, default=None)
    args = args.parse_args()
    if args.file:
        print("{")
        print("\"type\": \"FeatureCollection\",")
        print("\"features\": [")
        parseLocations(args.file)
        sys.stdout.write("\b")
        sys.stdout.flush()
        print("]")
        print("}")
        return
    
    print("WhatsApp location parser")
    print("")
    print("This script can read locations shared on a WhatsApp chat exported to .txt")
    print("and print them as a CSV, with values separated by the ';' character.")
    print("")
    print("Usage: python wlp.py -f your_whatsapp_exported_chat.txt > locations.geojson")

if __name__ == "__main__":
    main()

