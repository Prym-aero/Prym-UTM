const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['circle', 'polygon', 'sector'] },
  name: { type: String, required: true },
  center: { type: [Number], required: function () { return ['circle', 'sector'].includes(this.type); } },
  radius: { type: Number, required: function () { return this.type === 'circle'; } },
  vertices: { type: [[Number]], required: function () { return this.type === 'polygon'; } },

  // Sector-specific fields
  innerRadius: { type: Number, required: function () { return this.type === 'sector'; } }, // in meters
  outerRadius: { type: Number, required: function () { return this.type === 'sector'; } },
  startAzimuth: { type: Number, required: function () { return this.type === 'sector'; } }, // degrees
  endAzimuth: { type: Number, required: function () { return this.type === 'sector'; } },

  airspace: { type: String, required: true },
  color: { type: String, required: true },
  location: { type: String, required: true },
  summary: { type: String, required: true },
  verticalLimits: { type: String, required: true },
  regulation: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('Zone', zoneSchema);
