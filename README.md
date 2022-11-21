# leaflet-labeler
extends L.GeoJSON with automatic labeling. Currently only for point features.
Only displays points whose labels fit into the current view.

## API
``` javascript
// factory
const layer = L.labeler(geojson_data, {
                    pointToLayer: (gj, ll) => L.circleMarker(ll), 
                    labelProp: 'name', 
                    labelPos: 'auto', 
                    priorityProp: 'population'
                }).addTo(map);
```

## options
- `labelProp` <string>: property used for labeling
- `labelPos` <string>: [l|r|auto] label position
- `priorityProp` <string>: priority property. Higher priority labels are drawn first.

## live demo
https://samanbey.github.io/leaflet-labeler/example.html

