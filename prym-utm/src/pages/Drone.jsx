import {useState} from "react";
// import axios from "axios";
// import AlertSnackbar from "../components/AlertSnackbar";
import Navbar from "../components/Navbar";
import DroneAdd from "../components/DroneAdd";

const Drone = () => {
    const [state, setState] = useState("add");
    return (
        <>
            <Navbar/>
            <DroneAdd/>

        </>
    )
};

export default Drone;