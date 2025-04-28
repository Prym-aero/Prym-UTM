const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  // Zone type (circle, polygon, sector)
  type: {
    type: String,
    required: true,
    enum: ['circle', 'polygon', 'sector'],
  },

  // General fields
  name: { type: String, required: true, trim: true },
  airspace: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  verticalLimits: { type: String, required: true, trim: true },
  regulation: { type: String, required: true, trim: true },

  // Circle-specific fields
  center: {
    type: [Number],
    validate: {
      validator: function (value) {
        return this.type === 'circle' || this.type === 'sector';
      },
      message: 'Center is required for circle or sector zones.',
    },
  },
  radius: {
    type: Number,
    validate: {
      validator: function (value) {
        return this.type !== 'circle' || (value > 0);
      },
      message: 'Radius must be greater than 0 for circle zones.',
    },
  },

  // Polygon-specific fields
  vertices: {
    type: [[Number]],
    validate: {
      validator: function (value) {
        return this.type !== 'polygon' || (Array.isArray(value) && value.length >= 3);
      },
      message: 'Vertices must form a valid polygon with at least 3 points.',
    },
  },

  // Sector-specific fields
  innerRadius: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return this.type !== 'sector' || (value >= 0);
      },
      message: 'Inner radius must be non-negative for sector zones.',
    },
  },
  outerRadius: {
    type: Number,
    validate: {
      validator: function (value) {
        return this.type !== 'sector' || (value > 0);
      },
      message: 'Outer radius must be greater than 0 for sector zones.',
    },
  },
  startAzimuth: {
    type: Number,
    validate: {
      validator: function (value) {
        return this.type !== 'sector' || (value >= 0 && value <= 360);
      },
      message: 'Start azimuth must be between 0 and 360 degrees for sector zones.',
    },
  },
  endAzimuth: {
    type: Number,
    validate: {
      validator: function (value) {
        return this.type !== 'sector' || (value >= 0 && value <= 360);
      },
      message: 'End azimuth must be between 0 and 360 degrees for sector zones.',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);