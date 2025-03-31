import { useState} from "react";
const API_URL = import.meta.env.VITE_API_ENDPOINT;
// import axios from "axios";
import Navbar from "../components/Navbar";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import AlertSnackbar from "../components/AlertSnackbar";
import FlightPlanForm from "../components/FlightPlanAdd";
import FlightPlanShow from "../components/FlightPlanShow";

const FlightPlan = () => {
    const [comp, setComp] = useState("add");
    
     return ( 
       <>
          <Navbar/>
          <div className="Flight-btn flex justify-evenly items-center w-[750px] h-[100px] mt-20">
             <button className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer "
              onClick={() => setComp("add")}
             >Add Flight</button>
             <button className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer "
              onClick={() => setComp("all")}
             >All FlightPlans</button>
             <button className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer ">Add Flight</button>
          </div>

          {comp === "add" && (
             <FlightPlanForm/>
          )}
          {comp === "all" && (
             <FlightPlanShow/>
          )}
          {/* <FlightPlanForm/> */}
       </>
     )
};

export default FlightPlan;
