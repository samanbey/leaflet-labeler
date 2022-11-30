# leaflet-labeler
Extends L.GeoJSON with automatic labeling. 
Filters labels to avoid conflicts. Only displays point symbols that fit with their labels into the current view without conflict.

Minimum Leaflet version: 1.9.3

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
- `<function> labelFunc`: optional `function(<L.Layer>)` returning the label text (similar to functions used by `bindPopup()`)
- `<string> labelPos`: ['l'|'r'|'auto'|'cc'] label position (default: 'auto' which means trying both 'l' and 'r')
- `<string> priorityProp`: priority property. Higher priority labels are drawn first.
- `<function> priorityFunc`: optional `function(<L.Feature>)` returning the priority for a feature.
- `<number> gap`: gap between the marker and the label, in pixels (default: 2)
- `<string> labelPane`: which Leaflet map pane to put labels onto. (default: 'tooltipPane')
- `<object|function> labelStyle`: optional object of CSS styling rules or a `function(<L.Feature>)` returning such an object 
- `<function> viewFilter`: optional function to filter features. Similar to L.geoJSON's `filter` option but filters not on layer creation but on update.

## other methods
- `update()`: updates view
- `setViewFilter(<function>): sets `viewFilter` function and updates map.

## live demo
- points: https://samanbey.github.io/leaflet-labeler/example.html
- polygons: https://samanbey.github.io/leaflet-labeler/example_poly.html (uses https://github.com/samanbey/leaflet-hatchclass for hatch fill)
- lines: https://samanbey.github.io/leaflet-labeler/example_line.html

