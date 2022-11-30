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

## creation options (in addition to the standard `L.geoJSON` options)
- `<string> labelProp`: property used for labeling. Not used if `labelFunc` is set.
- `<string> labelPos`: ['l'|'r'|'auto'|'cc'] label position (default: 'auto' which means trying both 'l' and 'r')
- `<string> priorityProp`: priority property. Higher priority labels are drawn first.
- `<number> gap`: gap between the marker and the label, in pixels (default: 2)
- `<string> labelPane`: which Leaflet map pane to put labels onto. (default: 'tooltipPane')
- `<function> viewFilter`: optional function to filter features. Similar to L.geoJSON's `filter` option but filters not on layer creation but on update.
- `<function> labelFunc`: optional `function(<L.Layer>)` returning the label text (similar to functions used by `bindPopup()`)

## other methods
- `update()`: updates view
- `setViewFilter(<function>): sets `viewFilter` function and updates map.

## live demo
https://samanbey.github.io/leaflet-labeler/example.html
https://samanbey.github.io/leaflet-labeler/example_poly.html

