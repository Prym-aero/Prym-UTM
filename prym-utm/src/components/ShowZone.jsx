import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import AlertSnackbar from "./AlertSnackbar";

const API_URL = import.meta.env.VITE_API_ENDPOINT;

const ShowZone = () => {
  const [zone, setZone] = useState([]);
  const [Alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  useEffect(() => {

    const Token = localStorage.getItem("accessToken");

    if (!Token) {
        showAlert("Please login to view zones", "error");
        return;
    }

    const fetchZones = async () => {
      try {
        const response = await axios.get(`${API_URL}/zones`, {
            headers: {Authorization: `Bearer ${Token}`},
        });
        console.log("zones fetched successfully:", response.data);
        setZone(response.data);
        if (response.data.length === 0) {
          showAlert("No zones available", "info");
        } else {
          showAlert("Zones fetched successfully", "success");
        }
      } catch (error) {
        console.error("Error fetching zones:", error);
        showAlert("Error fetching zones", "error");
      }
    };

    fetchZones();
  }, []);


  const deleteZone = async (id) => {
      const zoneId = id;

      const Token = localStorage.getItem('accessToken');

      if (Token) {
         showAlert("Please login to use this function", "error");
         return;
      }

      try {
         const response = await axios.delete(`${API_URL}/zones/${zoneId}`, {
            headers: {Authorization: `Bearer ${Token}`},
         });

            console.log("Zone deleted successfully:", response.data);
            showAlert("Zone deleted successfully", "success");
            setZone(zone.filter((z) => z._id !== zoneId));
      } catch (error) {
         showAlert("Error deleting zone", "error");
         console.error("Error deleting zone:", error);
      }

    }


    return (
    <>
        <div className="zoneshow w-[100vw] "></div>
    </>
    )
};
