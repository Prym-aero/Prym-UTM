const mongoose = require('mongoose');

const tempZoneSchema = new mongoose.Schema({
    type: {type : String, required: true, enum: ['circle', 'polygon', 'point']},
    zoneNO: {type : String, required: true},
    task: {type :String},
    center: {type : [Number], required: function() {return ['circle', 'point'].includes(this.type);}},
    radius: {type : Number, required: function() {return this.type === 'circle';}},
    vertices: {type : [[Number]], required: function() {return this.type === 'polygon';}},
    airspace: {type: String, default: 'temp'},
    color: {type: String, default: 'blue'},
})