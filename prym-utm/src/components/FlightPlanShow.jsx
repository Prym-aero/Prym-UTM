const API_URL = import.meta.env.VITE_API_ENDPOINT;
import { useEffect, useState } from "react";
import axios from "axios";
import AlertSnackbar from "./AlertSnackbar";
import { IoIosSearch } from "react-icons/io";

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

  const [query, setQuery] = useState("");

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

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchFlightPlans(query);
    }
  };

  const searchFlightPlans = async (query) => {
    setLoading(true);

    const value = query.toLowerCase().trim();

    const searchValues = flightPlans.filter((flightPlan) => {
      const name = flightPlan.flightName?.toString().toLowerCase();
      const date = flightPlan.flightDate?.toString().toLowerCase();
      const status = flightPlan.status?.toString().toLowerCase();
      const battery = flightPlan.batteryLevel?.toString().toLowerCase();

      return (
        name.includes(value) ||
        date.includes(value) ||
        status.includes(value) ||
        battery.includes(value)
      );
    });

    setFlightPlans(searchValues);
    setLoading(false);
    setQuery("");
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
          <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
  <h1 className="text-4xl font-bold text-orange-500 mb-10">Flight Detail</h1>

  <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8 text-left space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-gray-600">Flight ID</h2>
      <p className="text-xl text-gray-800">{view._id}</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-gray-600">Flight Date</h2>
      <p className="text-xl text-gray-800">{view.flightDate}</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-gray-600">Flight Name</h2>
      <p className="text-xl text-gray-800">{view.flightName}</p>
    </div>

    <div className="button">
        <button onClick={ () => setView(null)}> Close</button>
    </div>

    {/* Add more info here the same way */}
    {/* Example: */}
    {/* 
    <div>
      <h2 className="text-lg font-semibold text-gray-600">Pilot Name</h2>
      <p className="text-xl text-gray-800">{view.pilotName}</p>
    </div> 
    */}
  </div>
</div>

        </>
      ) : (
        <>
          <div className="searchBar flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search location..."
                className="p-2 rounded-l-md bg-gray-200 focus:border-black focus:outline-none ml-2.5 my-2.5"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button
                className="bg-gray-200 px-4 py-2 rounded-r-md border-black border-l-2"
                onClick={() => searchFlightPlans(query)}
              >
                <IoIosSearch className="text-2xl" />
              </button>
            </div>
          </div>
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
