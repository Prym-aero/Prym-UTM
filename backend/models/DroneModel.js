const mongoose = require("mongoose");

const droneSchema = new mongoose.Schema({
  droneName: String,
  uin: { type: String, unique: true, required: true },
  droneStatus: { type: String, enum: ["Active", "Inactive", "Flying", "Repair", "Crashed"], default: "Inactive" },
  droneType: String,
  manufacture: String,
  deploymentDate: { type: String, required: true } ,
  application: String,
  coverageArea: String,
  controlRange: String,
  gpsPositioning: Boolean,
  weatherResistance: String,
  maxTakeoffWeight: Number,
  payloadCapacity: Number,
  spraySystem: String,
  batteryCapacity: String,
  sprayWidth: String,
  numberOfNozzles: Number,
  flightTimePerBattery: String,
  chargingTimePerBattery: String,
  owner: String,
  location: String,
  phone: String,
  purchaseDate: Date,
  droneSerialNumber: { type: String, unique: true },
  vendor: String,
  batteryWarranty: String,
  maintenanceSchedule: String,
  pilotName: String,
  pilotCertificationNumber: String,
  trainingLevel: String,
  insuranceCoverage: String,
  image: { type: String }, // Directly store Base64 image string
}, { timestamps: true });

module.exports = mongoose.model("Drone", droneSchema);
