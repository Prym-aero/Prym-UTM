import { useEffect, useState } from "react";
import axios from "axios";
import AlertSnackbar from "./AlertSnackbar";


const FlightPlanShow = () => {
    return (
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
                    <tbody>
                        {/* Flight Plan data will be rendered here */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FlightPlanShow;
