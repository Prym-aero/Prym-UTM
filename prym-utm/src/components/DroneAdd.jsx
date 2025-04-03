import axios from "axios";
import { useState} from "react";
import AlertSnackbar from "./AlertSnackbar";
const API_URL = import.meta.env.VITE_API_ENDPOINT;
import { isTokenExpired, refreshAccessToken } from "../utils/authService"; // Import helper functions
import { useNavigate } from "react-router-dom";


const DroneAdd = () => {
  const [droneData, setDroneData] = useState({
    droneName: "",
    // uin: "",
    droneStatus: "Inactive",
    droneTypeq: "",
    manufacture: "",
    deploymentDate: "",
    application: "",
    coverageArea: "",
    controlRange: "",
    gpsPositioning: false,
    weatherResistance: "",
    maxTakeoffWeight: 0,
    payloadCapacity: 0,
    spraySystem: "",
    batteryCapacity: "",
    sprayWidth: "",
    numberOfNozzles: 0,
    flightTimePerBattery: "",
    chargingTimePerBattery: "",
    owner: "",
    location: "",
    phone: "",
    purchaseDate: "",
    droneSerialNumber: "",
    vendor: "",
    batteryWarranty: "",
    maintenanceSchedule: "",
    pilotName: "",
    pilotCertificationNumber: "",
    trainingLevel: "",
    insuranceCoverage: "",
    image: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [Alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDroneData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setDroneData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token || isTokenExpired(token)) {
      try {
        const newToken = await refreshAccessToken(navigate);
        localStorage.setItem("accessToken", newToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        showAlert("Session expired. Please log in again.", "error");
        setLoading(false);
        return;
      }
    }

    const formattedData = {
      ...droneData,
      gpsPositioning: Boolean(droneData.gpsPositioning),
      purchaseDate: droneData.purchaseDate
        ? new Date(droneData.purchaseDate)
        : null,
    };

    console.log("formated data", formattedData);

    try {
      const response = await axios.post(
        `${API_URL}/drones/register`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Drone added successfully:", response.data);
      showAlert("Drone added successfully", "success");
      setDroneData({
        droneName: "",
        // uin: "",
        droneStatus: "Inactive",
        droneTypeq: "",
        manufacture: "",
        deploymentDate: "",
        application: "",
        coverageArea: "",
        controlRange: "",
        gpsPositioning: false,
        weatherResistance: "",
        maxTakeoffWeight: "",
        payloadCapacity: "",
        spraySystem: "",
        batteryCapacity: "",
        sprayWidth: "",
        numberOfNozzles: "",
        flightTimePerBattery: "",
        chargingTimePerBattery: "",
        owner: "",
        location: "",
        phone: "",
        purchaseDate: "",
        droneSerialNumber: "",
        vendor: "",
        batteryWarranty: "",
        maintenanceSchedule: "",
        pilotName: "",
        pilotCertificationNumber: "",
        trainingLevel: "",
        insuranceCoverage: "",
      });
    } catch (error) {
      console.error("Error adding drone:", error);
      showAlert("Error adding drone", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="add-form w-screen h-screen bg-[#008080] flex justify-center items-center ">
        <div className="form w-[65vw] h-[90vh] p-5 bg-[#d8d5db]">
          <form className="formFill" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-4">Drone Registration</h1>
            <div className="grid grid-cols-4 gap-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="droneName"
                >
                  Drone Name
                </label>
                <input
                  type="text"
                  name="droneName"
                  value={droneData.droneName}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {/* <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uin">UIN</label>
                                <input type="text" name="uin" value={droneData.uin} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div> */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="droneStatus"
                >
                  Drone Status
                </label>
                <select
                  name="droneStatus"
                  value={droneData.droneStatus}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="droneTypeq"
                >
                  Drone Type
                </label>
                <input
                  type="text"
                  name="droneTypeq"
                  value={droneData.droneTypeq}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {/* Add more fields as needed */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="manufacture"
                >
                  manufacture
                </label>
                <input
                  type="text"
                  name="manufacture"
                  value={droneData.manufacture}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="deploymentDate"
                >
                  deploymentDate
                </label>
                <input
                  type="text"
                  name="deploymentDate"
                  value={droneData.deploymentDate}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="application"
                >
                  application
                </label>
                <input
                  type="text"
                  name="application"
                  value={droneData.application}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="coverageArea"
                >
                  coverageArea
                </label>
                <input
                  type="text"
                  name="coverageArea"
                  value={droneData.coverageArea}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="controlRange"
                >
                  controlRange
                </label>
                <input
                  type="text"
                  name="controlRange"
                  value={droneData.controlRange}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gpsPositioning"
                >
                  gpsPositioning
                </label>
                <input
                  type="text"
                  name="gpsPositioning"
                  value={droneData.gpsPositioning}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="weatherResistance"
                >
                  weatherResistance
                </label>
                <input
                  type="text"
                  name="weatherResistance"
                  value={droneData.weatherResistance}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="maxTakeoffWeight"
                >
                  maxTakeoffWeight
                </label>
                <input
                  type="number"
                  name="maxTakeoffWeight"
                  value={droneData.maxTakeoffWeight}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="maxTakeoffWeight"
                >
                  payloadCapacity
                </label>
                <input
                  type="number"
                  name="payloadCapacity"
                  value={droneData.payloadCapacity}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="spraySystem"
                >
                  spraySystem
                </label>
                <input
                  type="text"
                  name="spraySystem"
                  value={droneData.spraySystem}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="batteryCapacity"
                >
                  batteryCapacity
                </label>
                <input
                  type="text"
                  name="batteryCapacity"
                  value={droneData.batteryCapacity}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="sprayWidth"
                >
                  Spray Width
                </label>
                <input
                  type="text"
                  name="sprayWidth"
                  value={droneData.sprayWidth}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="numberOfNozzles"
                >
                  Number of Nozzles
                </label>
                <input
                  type="number"
                  name="numberOfNozzles"
                  value={droneData.numberOfNozzles}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="flightTimePerBattery"
                >
                  Flight Time Per Battery
                </label>
                <input
                  type="text"
                  name="flightTimePerBattery"
                  value={droneData.flightTimePerBattery}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="chargingTimePerBattery"
                >
                  Charging Time Per Battery
                </label>
                <input
                  type="text"
                  name="chargingTimePerBattery"
                  value={droneData.chargingTimePerBattery}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="owner"
                >
                  Owner
                </label>
                <input
                  type="text"
                  name="owner"
                  value={droneData.owner}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={droneData.location}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={droneData.phone}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="purchaseDate"
                >
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={droneData.purchaseDate}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="droneSerialNumber"
                >
                  Drone Serial Number
                </label>
                <input
                  type="text"
                  name="droneSerialNumber"
                  value={droneData.droneSerialNumber}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="vendor"
                >
                  Vendor
                </label>
                <input
                  type="text"
                  name="vendor"
                  value={droneData.vendor}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="batteryWarranty"
                >
                  Battery Warranty
                </label>
                <input
                  type="text"
                  name="batteryWarranty"
                  value={droneData.batteryWarranty}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="maintenanceSchedule"
                >
                  Maintenance Schedule
                </label>
                <input
                  type="text"
                  name="maintenanceSchedule"
                  value={droneData.maintenanceSchedule}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="pilotName"
                >
                  Pilot Name
                </label>
                <input
                  type="text"
                  name="pilotName"
                  value={droneData.pilotName}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="pilotCertificationNumber"
                >
                  Pilot Certification Number
                </label>
                <input
                  type="text"
                  name="pilotCertificationNumber"
                  value={droneData.pilotCertificationNumber}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="trainingLevel"
                >
                  Training Level
                </label>
                <input
                  type="text"
                  name="trainingLevel"
                  value={droneData.trainingLevel}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="insuranceCoverage"
                >
                  Insurance Coverage
                </label>
                <input
                  type="text"
                  name="insuranceCoverage"
                  value={droneData.insuranceCoverage}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="image"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange} // Assuming you have this function to convert to Base64
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                {loading ? "Loading..." : "Register Drone"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DroneAdd;
