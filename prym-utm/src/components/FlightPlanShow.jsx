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
  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchFlightPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/flightPlan"
        );
        console.log("Flight Plans fetched successfully:", response.data);
        setFlightPlans(response.data);
        showAlert("Flight Plans fetched successfully", "success");
      } catch (error) {
        console.error("Error fetching flight plans:", error);
        showAlert("Error fetching flight plans", "error");
      }
    };

    fetchFlightPlans();
  }, []);

  return (
    <>
      <div className="FlightPlanShow w-screen h-full flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-center mt-10">Flight Plans</h1>
        <div className="FlightPlanShow-container flex justify-center items-center mt-10">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4">ID</th>
                <th className="p-4">Flight Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>{/* Flight Plan data will be rendered here */}</tbody>
          </table>
        </div>
      </div>
      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default FlightPlanShow;
