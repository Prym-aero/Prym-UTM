import { useState, useEffect } from "react";
import axios from "axios";
// import AlertSnackbar from "../components/AlertSnackbar";
import Navbar from "../components/Navbar";
import DroneAdd from "../components/DroneAdd";
const API_URL = import.meta.env.VITE_API_ENDPOINT;
import TableComponent from "../components/TableComponent";

const Drone = () => {
  const [state, setState] = useState("add");

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/drones`);
            console.log("Drones fetch succesfully",response.data.slice(0, 5));
            setData(response.data);
        } catch (error) {
            console.log("Error fetching drones:", error);
        }
    }

    fetchData();
  },[]);
  return (
    <>
      <Navbar />
      <div className="Flight-btn flex justify-evenly items-center w-[750px] h-[100px] mt-15">
        <button
          className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer "
          onClick={() => setState("add")}
        >
          Add Flight
        </button>
        <button
          className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer "
          onClick={() => setState("all")}
        >
          All FlightPlans
        </button>
      </div>
      {state === "add" && <DroneAdd />}
      {state === "all" && <TableComponent tableData={data}/>}
    </>
  );
};

export default Drone;
