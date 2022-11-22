# leaflet-labeler
extends L.GeoJSON with automatic labeling. Currently only for point features.
Only displays points whose labels fit into the current view.

## API
``` javascript
// factory
const layer = L.labeler(geojson_data, {
                    labelProp: 'name', 
                    labelPos: 'auto', 
                    priorityProp: 'population'
                }).addTo(map);
```

## options (in addition to the standard `L.geoJSON` options)
- `labelProp <string>`: property used for labeling
- `labelPos <string>`: ['l'|'r'|'auto'] label position (default: 'auto')
- `priorityProp <string>`: priority property. Higher priority labels are drawn first.
- `gap <number>`: gap between the marker and the label, in pixels (default: 2)
- `pane <string>`: which Leaflet map pane to put labels onto. (default: 'tooltipPane')

## live demo
https://samanbey.github.io/leaflet-labeler/example.html

