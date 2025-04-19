import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_ENDPOINT;
import AlertSnackbar from "./AlertSnackbar";



const DroneAlertShow = ({droneId}) => {
     const [zones, setZones] = useState([]);
     
        const [Alert, setAlert] = useState({
            open: false,
            message: "",
            severity: "info",
        });

        const showAlert = (message, severity) => {  
            setAlert({ open: true, message, severity });
        }

        

}
