const API_URL = import.meta.env.VITE_API_ENDPOINT;
import { useEffect, useState } from "react";
import axios from "axios";
import AlertSnackbar from "./AlertSnackbar";

const FlightPlanShow = () => {
  const [flightPlans, setFlightPlans] = useState([]);
  const [Alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(false);
  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleDeleteFlightPlan = async (flightPlanId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/flightPlan/remove-flight/${flightPlanId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      //  console.log("Flight Plan deleted successfully:", response.data);
      showAlert("Flight Plan deleted successfully:", "success");
      setFlightPlans(flightPlans.filter((plan) => plan._id !== flightPlanId));
    } catch (error) {
      // console.error("Error deleting flight plan:", error);
      showAlert("Login to perform any operation", "error");
    }
  };

  useEffect(() => {
    const fetchFlightPlans = async () => {
      try {
        const response = await axios.get(`${API_URL}/flightPlan`);
        console.log("Flight Plans fetched successfully:", response.data);
        setFlightPlans(response.data);
        if (response.data.length === 0) {
          showAlert("No flight plans available", "info");
        } else {
          showAlert("Flight plans fetched successfully", "success");
        }
      } catch (error) {
        console.error("Error fetching flight plans:", error);
        showAlert("Error fetching flight plans", "error");
      }
    };

    fetchFlightPlans();
  }, []);

  return (
    <>
      {view ? (
        <>
          <div className="w-screen h-full flex flex-col justify-center items-center bg-gray-100">
              <h1 className="text-4xl text-orange-400 font-bold ">Flight Detail</h1>
              <div className="details grid grid-cols-3 gap-2.5 " >
                 <div className="flight-detail "></div>
              </div>
          </div>
        </>
      ) : (
        <>
          <div className="FlightPlanShow w-screen h-full flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-bold text-center mt-10">
              Flight Plans
            </h1>
            <div className="FlightPlanShow-container flex justify-center items-center mt-10">
              <table className="w-screen bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="flex justify-between items-center gap-10 w-full ">
                  <tr className="bg-gray-200 flex justify-between items-center gap-10 w-full mx-[20px] px-[10px]">
                    <th className="p-4">ID</th>
                    <th className="p-4">Flight Name</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Battery</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Flight Plan data will be rendered here */}
                  {flightPlans.map((flightPlan, index) => (
                    <tr
                      key={index}
                      className="flex justify-between items-center gap-10 w-full mx-[20px] px-[10px]"
                    >
                      <td className="p-4">{flightPlan._id}</td>
                      <td className="p-4">{flightPlan.flightName}</td>
                      <td className="p-4">{flightPlan.flightDate}</td>
                      <td className="p-4">{flightPlan.status}</td>
                      <td className="p-4">{flightPlan.batteryLevel}</td>
                      <td className="p-4">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => setView(flightPlan)}
                        >
                          View
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => handleDeleteFlightPlan(flightPlan._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default FlightPlanShow;
