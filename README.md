# WhatsApp Location Parser

This very simple script can read locations shared on a WhatsApp chat exported to .txt
and print them as a GeoJSON file.

It was developed to help emergency services and humanitarian organizations to get
locations from people in the field during disasters and emergencies.

`Usage: python wlp.py -f your_whatsapp_exported_chat.txt > locations.geojson`

The result will be a GeoJSON like the following:

```geojson
{
  "type": "FeatureCollection",
  "features": [
    {
      "geometry": {
        "type": "Point",
        "coordinates": [
          -56.1996432,
          -34.9075622
        ]
      },
      "type": "Feature",
      "properties": {
        "message": "10/31/23, 19:06 - Emi: 👍👍 en camino"
      }
    }
  ]
}
```



Copyright 2024 Emilio Mariscal

This is free software! you may use this project under the terms of the GNU General Public License (GPL) Version 3.
