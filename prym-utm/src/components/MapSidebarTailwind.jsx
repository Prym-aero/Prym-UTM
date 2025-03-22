import React, { useState } from "react";

const MapSidebarTailwind = () => {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (index) => {
    setOpenPanel(openPanel === index ? null : index);
  };

  const panelData = [
    { title: "Most tracked flights", live: true },
    { title: "Airport disruptions", live: true },
    { title: "Bookmarks", live: false },
  ];

  return (
    <div className="absolute top-18 left-4 z-1000 space-y-2 w-[300px]">
      {panelData.map((panel, index) => (
        <div key={index} className="bg-gray-400 text-white rounded-lg">
          <button
            onClick={() => togglePanel(index)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg bg-gray-800"
          >
            <div className="flex items-center gap-2">
              {panel.title}
              {panel.live && (
                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">LIVE</span>
              )}
            </div>
            <span className="text-gray-400">?</span>
          </button>
          {openPanel === index && (
            <div className="bg-gray-500 px-4 py-2 rounded-b-lg">
              Content for {panel.title} goes here.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MapSidebarTailwind;
