const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['circle', 'polygon'] },
  name: { type: String, required: true },
  center: { type: [Number], required: function () { return this.type === 'circle'; } },
  radius: { type: Number, required: function () { return this.type === 'circle'; } },
  vertices: { type: [[Number]], required: function () { return this.type === 'polygon'; } },
  airspace: { type: String, required: true },
  location: { type: String, required: true },
  summary: { type: String, required: true },
  verticalLimits: { type: String, required: true },
  regulation: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
