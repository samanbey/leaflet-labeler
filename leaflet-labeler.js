/**
 * class L.Labeler()
 *
 * extends L.GeoJSON
 * automatically labels features
 *
 * MIT License
 * Copyright (c) 2022 Gede Mátyás
 */

L.Labeler = L.GeoJSON.extend({
    options: {
        labelProp: 'name',
        labelPos: 'auto',
        labelFunc: null,
        gap: 2,
        pane: 'tooltipPane',
        viewFilter: null
    },
    
    _labels: {},
    _visibleLayers: [],
    _posOrder: ['r','l'],
    
    onAdd(map) {
        this._zoomAnimated = map._zoomAnimated;
        if (this.options.labelPos!='auto')
            this._posOrder=[this.options.labelPos];
        L.GeoJSON.prototype.onAdd.call(this, map);
        // create label priority list
        this._priOrder=[];
        this._viewFilter=this.options.viewFilter;
        for (let l in this._labels) {
            let lab=this._labels[l]
            this._priOrder.push({ id: l, p: lab.priority });
        }
        this._priOrder.sort((a,b)=>(b.p-a.p));
        //console.log(this._priOrder);
        this._container = L.DomUtil.create('div', '', map.getPane(this.options.pane));
        this._update();
    },
    
    getEvents() {
        const events = {
            zoomend: this._update,
            moveend: this._update,
            viewreset: this._update,
        }
        if (this._zoomAnimated)
            events.zoomanim = this._zoomAnim;
        return events;
    },
    
    _addOffset(pos, labelPos, gap, label) {
        /** calculates the label position relative to the anchor point */
        let ls = label.span;
        switch (labelPos) {
            case 'r':
                pos.x+=label.size[0]-label.anchor[0]+gap;
                pos.y+=label.size[1]/2-label.anchor[1]-ls.clientHeight/2;
                break;
            case 'l':
                pos.x-=label.anchor[0]+gap+ls.clientWidth;
                pos.y+=label.size[1]/2-label.anchor[1]-ls.clientHeight/2;
                break;
        }
    },
    
    _zoomAnim(e) {
        for (let l in this._labels) {
            let lab = this._labels[l];
            let ls = lab.span;
            if (ls) {
                let pos = this._map._latLngToNewLayerPoint(lab.latLng, e.zoom, e.center);
                this._addOffset(pos, lab.pos, this.options.gap, lab);
                ls.style.top = `${pos.y}px`;
                ls.style.left = `${pos.x}px`; 
            }
        }
    },
    
    _intersects(bb1,bb2) {
        // checks if two bounding boxes intersect
        let b1=L.bounds([[bb1.x1,bb1.y1],[bb1.x2,bb1.y2]]), 
            b2=L.bounds([[bb2.x1,bb2.y1],[bb2.x2,bb2.y2]]);
        return b1.intersects(b2);
    },
    
    addData(geojson) {
        L.GeoJSON.prototype.addData.call(this, geojson);
    },
    
    _update() {
        let t1=Date.now();
        console.log('updating');
        this._container.innerHTML = '';
        this._bbs=[]; // array of bounding boxes.
        let bb;
        L.DomUtil.toFront(this._container);
        let maptr=map._panes.mapPane.style.transform.substring(12).split(', ');
        let mapx1=-parseFloat(maptr[0]), mapy1=-parseFloat(maptr[1]);
        let mapx2=mapx1+this._map._container.clientWidth,
            mapy2=mapy1+this._map._container.clientHeight;
        /*for (let l in this._labels) {*/
        for (let i=0;i<this._priOrder.length;i++) {
            let l=this._priOrder[i].id;
            let lab = this._labels[l];
            // use viewFilter if there is one
            if (this._viewFilter)
                if (!this._viewFilter(lab.layer.feature)) {
                    lab.layer.remove();
                    continue;
                }
            let pos = this._map.latLngToLayerPoint(lab.latLng);
            let markerbb={ x1: pos.x-lab.anchor[0], y1: pos.y-lab.anchor[1], x2: pos.x-lab.anchor[0]+lab.size[0], y2: pos.y-lab.anchor[1]+lab.size[1] }
            let fits=true;
            this._bbs.some(b => {
                if (this._intersects(b,markerbb)) {                        
                    fits=false;
                    return true;
                }
            });
            let ls = L.DomUtil.create('span', 'leaflet-labeler-label', this._container);
            ls.style.visibility='hidden'; // initially hidden, in case it cannot be displayed
            lab.span = ls;
            ls.textContent = lab.label;  
            if (fits) {
                for (let posi in this._posOrder) {
                    fits=true;
                    let lp=this._posOrder[posi];
                    let p={...pos}; // copy position for later
                    this._addOffset(pos, lp, this.options.gap, lab);
                    bb={ x1: pos.x, y1: pos.y, x2: pos.x+ls.clientWidth, y2: pos.y+ls.clientHeight }
                    if (bb.x1>mapx2||bb.x2<mapx1||bb.y1>mapy2||bb.y2<mapy1) {
                        fits=false;
                        //if (lab.layer._map) console.log(lab.label+' went out of view');
                    }
                    else
                        this._bbs.some(b => {
                            if (this._intersects(b,bb)) {                        
                                fits=false;
                                return true;
                            }
                        });
                    if (fits) {
                        lab.pos = lp;
                        break;
                    }
                    pos=p; // if this position did not fit, return to original marker position and try next one                   
                }
            }
            if (fits) {
                //if (!lab.layer._map) console.log(lab.label+' came back to view');
                this._bbs.push(bb);
                this._bbs.push(markerbb);
                lab.span.style.top = `${pos.y}px`;
                lab.span.style.left = `${pos.x}px`; 
                lab.layer.addTo(map);
            }
            else {
                this._container.removeChild(lab.span);
                lab.layer.remove();
            }
        }
        this._container.childNodes.forEach(n=>n.style.visibility=''); // set all remaining label visible
        let t2=Date.now();
        console.log('update completed in '+((t2-t1)/1000).toFixed(1)+' s');
        console.log('number of labels: '+this._bbs.length/2);
    },
    
    update() {
        this._update();
    },
    
    addLayer(layer) {
        if (this.hasLayer(layer)) {
            return this;
        }
        const id = this.getLayerId(layer);

		this._layers[id] = layer;

		layer.addEventParent(this);
        
        let label = this.options.labelFunc?this.options.labelFunc(layer):layer.feature.properties[this.options.labelProp],
            layerId = layer._leaflet_id;
        // get icon size, anchor
        let anchor = layer.getIcon?layer.getIcon().options.iconAnchor:[layer.getRadius(),layer.getRadius()],
            size = layer.getIcon?layer.getIcon().options.iconSize:[layer.getRadius()*2,layer.getRadius()*2];
        let pri = this.options.priorityProp?layer.feature.properties[this.options.priorityProp]-0:0;
        if (!pri) pri=0;
        // push label info to _labels array
        this._labels[layerId] = { label: label, latLng: layer.getLatLng(), anchor: anchor, size: size, layer: layer, priority: pri };
        
		return this.fire('layeradd', {layer});
    },
    
    removeLayer(layer) {
        if (this._labels.hasOwnProperty(layer._leaflet_id))
            delete this._labels[layer._leaflet_id];
        L.GeoJSON.prototype.removeLayer.call(this, layer);
    },
    
    onRemove(map) {
		this.eachLayer(map.removeLayer, map);
        this._container.remove();
	},
    
    setViewFilter(f) {
        this._viewFilter=f;
        this._update();
    }
});

L.labeler = function (layers, options) {
	return new L.Labeler(layers, options);
}