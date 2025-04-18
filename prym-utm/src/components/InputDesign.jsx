"use client";
import React from "react";

const InputDesign = () => {
    

  return (
    <div className="w-screen h-screen  p-2.5">
      <form className="grid gap-10 p-10 mx-auto my-0 rounded-2xl bg-[white] max-w-[1200px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-sm:gap-8 max-sm:p-6">
        {/* Flight Information Section */}
        <section>
          <h2 className="gap-3 pb-3 mb-6 text-2xl font-bold text-blue-600 border-b-2 border-solid border-b-indigo-100">
            Flight Information
          </h2>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <div>
              <label className="mb-2 font-medium">Flight Name</label>
              <input
                type="text"
                className="p-3.5 w-full text-base rounded-lg border-2 border-indigo-100 border-solid transition-all bg-slate-50 duration-[0.2s] ease-[ease]"
              />
            </div>
            <div>
              <label className="mb-2 font-medium">Location Name</label>
              <input
                type="text"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
            <div>
              <label className="mb-2 font-medium">Center Latitude</label>
              <input
                type="number"
                step="0.000001"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
            <div>
              <label className="mb-2 font-medium">Center Longitude</label>
              <input
                type="number"
                step="0.000001"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
          </div>
        </section>

        {/* Drone Info Section */}
        <section>
          <h2 className="pb-2 mb-6 text-xl font-semibold border-b-2 border-solid border-b-gray-200 text-slate-700">
            Drone Info
          </h2>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <div>
              <label className="mb-2 font-medium">Drone ID</label>
              <input
                type="text"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
            <div>
              <label className="mb-2 font-medium">Battery Level (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="100"
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Flight Parameters Section */}
        <section>
          <h2 className="pb-2 mb-6 text-xl font-semibold border-b-2 border-solid border-b-gray-200 text-slate-700">
            Flight Parameters
          </h2>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <div>
              <label className="mb-2 font-medium">Altitude (meters)</label>
              <input
                type="number"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
            <div>
              <label className="mb-2 font-medium">Speed (m/s)</label>
              <input
                type="number"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
            <div>
              <label className="mb-2 font-medium">Duration (minutes)</label>
              <input
                type="number"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
            <div>
              <label className="mb-2 font-medium">Flight Date</label>
              <input
                type="date"
                className="p-3 w-full rounded-md border border-solid border-zinc-200"
              />
            </div>
          </div>
        </section>

        {/* Status & Safety Section */}
        <section>
          <h2 className="pb-2 mb-6 text-xl font-semibold border-b-2 border-solid border-b-gray-200 text-slate-700">
            Status & Safety
          </h2>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <div>
              <label className="mb-2 font-medium">Status</label>
              <select className="p-3 w-full rounded-md border border-solid bg-[white] border-zinc-200">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="mb-2 font-medium">Weather Conditions</label>
              <select className="p-3 w-full rounded-md border border-solid bg-[white] border-zinc-200">
                <option value="unknown">Unknown</option>
                <option value="clear">Clear</option>
                <option value="windy">Windy</option>
                <option value="rainy">Rainy</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="regulatory-approval"
                className="w-5 h-5"
              />
              <label htmlFor="regulatory-approval" className="font-medium">
                Regulatory Approval
              </label>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="safety-checks" className="w-5 h-5" />
              <label htmlFor="safety-checks" className="font-medium">
                Safety Checks Passed
              </label>
            </div>
          </div>
        </section>

        {/* Additional Notes */}
        <section>
          <h2 className="pb-2 mb-6 text-xl font-semibold border-b-2 border-solid border-b-gray-200 text-slate-700">
            Additional Notes
          </h2>
          <textarea
            className="p-3 w-full rounded-md border border-solid resize-y border-zinc-200 min-h-[120px]"
            placeholder="Enter any additional notes or comments..."
          />
        </section>

        {/* Submit Button */}
        <button
          className="gap-3 px-9 py-5 mt-6 text-lg font-semibold rounded-xl transition-all cursor-pointer border-[none] duration-[0.3s] ease-[ease] shadow-[0_4px_12px_rgba(37,99,235,0.2)] text-[white] bg-blue-600 hover:bg-blue-700"
          type="submit"
        >
          Launch Flight Plan
        </button>
      </form>
    </div>
  );
};

export default InputDesign;
