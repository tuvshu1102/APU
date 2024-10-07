import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Example() {
  const [data, setData] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [dataKeys, setDataKeys] = useState({
    uv: true,
    pv: true,
    amt: true,
    jt: true,
    jb: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data.json");
      const jsonData = await res.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  // Handle date selection
  const handleDateChange = (index, value) => {
    const newSelectedDates = [...selectedDates];
    newSelectedDates[index] = value;
    setSelectedDates(newSelectedDates);
  };

  // Clear date selection
  const clearDateSelection = (index) => {
    const newSelectedDates = [...selectedDates];
    newSelectedDates[index] = null; // Clear the date
    setSelectedDates(newSelectedDates);
  };

  // Generate year-month options (from 2022-01 to 2024-07), adding full year options
  const generateDateOptions = () => {
    const options = [];
    const startYear = 2022;
    const endYear = 2024;

    for (let year = startYear; year <= endYear; year++) {
      const startMonth = year === startYear ? 1 : 1;
      const endMonth = year === endYear ? 7 : 12;
      for (let month = startMonth; month <= endMonth; month++) {
        const formattedMonth = month < 10 ? `0${month}` : month;
        options.push(`${year}-${formattedMonth}`);
      }
      options.push(`${year}`); // Add full year option at the end of each year
    }
    return options;
  };

  // Helper function to aggregate data for a full year
  const aggregateYearData = (year) => {
    const yearData = data.filter((item) => item.name.startsWith(year));
    if (yearData.length === 0) return null;

    // Aggregate the values for the selected year
    return yearData.reduce(
      (acc, item) => {
        for (const key in item) {
          if (key !== "name") {
            acc[key] += item[key];
          }
        }
        return acc;
      },
      { name: year, uv: 0, pv: 0, amt: 0, jt: 0, jb: 0 }
    );
  };

  // Filter data based on selected dates
  const filteredData = selectedDates.length
    ? selectedDates.flatMap((date) => {
        if (date && date.length === 4) {
          // If the selected date is a year, aggregate data for the full year
          const aggregatedData = aggregateYearData(date);
          return aggregatedData ? [aggregatedData] : [];
        }
        return data.filter((item) => item.name === date);
      })
    : data;

  // Dynamic chart width: 300% if showing all data, 100% if comparing dates
  const chartWidth = selectedDates.length > 0 ? "100%" : "300%";

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-center my-10">Dashboard</h3>
        <div className="space-x-4 flex w-full justify-center ">
          {selectedDates.map((date, index) => (
            <div
              key={index}
              className="flex items-center justify-center space-x-4"
            >
              <select
                value={date || ""}
                onChange={(e) => handleDateChange(index, e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Month-Year</option>
                {generateDateOptions().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={() => clearDateSelection(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {selectedDates.length < 5 && (
          <div className="flex justify-center items-center flex-col mt-4">
            <button
              onClick={() => {
                if (selectedDates.length < 5) {
                  setSelectedDates([...selectedDates, null]);
                }
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Date Picker
            </button>
          </div>
        )}
      </div>

      <div className="flex mb-4 justify-center space-x-4">
        {[
          { key: "uv", label: "UV" },
          { key: "pv", label: "PV" },
          { key: "amt", label: "AMT" },
          { key: "jt", label: "JT" },
          { key: "jb", label: "JB" },
        ].map((item) => (
          <label
            key={item.key}
            className={`cursor-pointer flex items-center bg-gray-200 rounded-lg px-4 py-2 hover:bg-gray-300 ${
              dataKeys[item.key] ? "bg-blue-500 text-black" : "text-gray-700"
            }`}
          >
            <input
              type="checkbox"
              checked={dataKeys[item.key]}
              onChange={() =>
                setDataKeys({ ...dataKeys, [item.key]: !dataKeys[item.key] })
              }
              className="mr-2 h-4 w-4 accent-blue-500"
            />
            {item.label}
          </label>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div style={{ width: chartWidth }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.pv && <Bar dataKey="pv" fill="#8884d8" barSize={10} />}
              {dataKeys.amt && (
                <Bar dataKey="amt" fill="#82ca9d" barSize={10} />
              )}
              {dataKeys.uv && <Bar dataKey="uv" fill="#ffc658" barSize={10} />}
              {dataKeys.jt && <Bar dataKey="jt" fill="#ff6347" barSize={10} />}
              {dataKeys.jb && <Bar dataKey="jb" fill="#32cd32" barSize={10} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
