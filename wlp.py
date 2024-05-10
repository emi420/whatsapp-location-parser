import argparse

LOCATION_PREFIX = "https://maps.google.com/?q="
LOCATION_PREFIX_LEN = len(LOCATION_PREFIX)

def parseLocations(filename):
    with open(filename) as file:
        for line in file:
            txt = line.rstrip()
            location_index = txt.find(LOCATION_PREFIX)
            if location_index > 0:
                coordinates_string = txt[location_index + LOCATION_PREFIX_LEN:]
                coordinates = [float(x) for x in coordinates_string.split(",")]
                osm_link = "https://www.openstreetmap.org/?mlat={lat}&mlon={lon}#map=19/{lat}/{lon}".format(lat=coordinates[0], lon=coordinates[1])
                data = [coordinates_string, osm_link]
                print(';'.join(data))

def main():
    args = argparse.ArgumentParser()
    args.add_argument("--file", "-f", help="File", type=str, default=None)
    args = args.parse_args()
    if args.file:
        print("coordinates_string; osm_link")
        parseLocations(args.file)
    else:
        print("WhatsApp location parser")
        print("")
        print("This script can read locations shared on a WhatsApp chat exported to .txt")
        print("and print them as a CSV, with values separated by the ';' character.")
        print("")
        print("Usage: python wlp.py --file your_whatsapp_exported_chat.txt")

if __name__ == "__main__":
    main()

