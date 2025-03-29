import { useState} from "react";
// import axios from "axios";
import Navbar from "../components/Navbar";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import AlertSnackbar from "../components/AlertSnackbar";
import FlightPlanForm from "../components/FlightPlanAdd";

const FlightPlan = () => {
    const [comp, setComp] = useState("add");
    const [message, setMessage] = useState("");
     return ( 
       <>
          <Navbar/>
          <div className="Flight-btn flex justify-evenly items-center w-[750px] h-[100px] mt-20">
             <button className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer "
              onClick={() => setComp("add")}
             >Add Flight</button>
             <button className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer ">All FlightPlans</button>
             <button className="F-btn px-4 py-2.5 text-white bg-black border-none rounded-4xl cursor-pointer ">Add Flight</button>
          </div>

          {comp === "add" && (
             <FlightPlanForm/>
          )}
          {/* <FlightPlanForm/> */}
       </>
     )
};

export default FlightPlan;
