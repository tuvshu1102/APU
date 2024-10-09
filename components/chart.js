import React, { useState, useEffect, useMemo } from "react";
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

const CHUNK_SIZE = 15;

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
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data.json");
      const jsonData = await res.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  // Reset selected dates and current page when filter changes
  useEffect(() => {
    if (filterType !== "all") {
      setSelectedDates([]);
      setCurrentPage(0);
    } else {
      const totalChunks = Math.ceil(data.length / CHUNK_SIZE);
      setCurrentPage(Math.max(totalChunks - 1, 0)); // Set to last page when filter is 'all'
    }
  }, [filterType, data]);

  // Handle date selection change
  const handleDateChange = (index, value) => {
    const newSelectedDates = [...selectedDates];
    newSelectedDates[index] = value;
    setSelectedDates(newSelectedDates);
  };

  const clearDateSelection = (index) => {
    const newSelectedDates = [...selectedDates];
    newSelectedDates[index] = null;
    setSelectedDates(newSelectedDates);
  };

  // Generate date options
  const generateDateOptions = () => {
    const options = [];
    const startYear = 2017;
    const endYear = 2024;

    if (filterType === "year") {
      for (let year = startYear; year <= endYear; year++) {
        options.push(`${year}`);
      }
    } else if (filterType === "month") {
      for (let year = startYear; year <= endYear; year++) {
        const endMonth = year === endYear ? 7 : 12;
        for (let month = 1; month <= endMonth; month++) {
          const formattedMonth = month < 10 ? `0${month}` : month;
          options.push(`${year}-${formattedMonth}`);
        }
      }
    }
    return options;
  };

  // Aggregating data by month or year
  const aggregateMonthData = (month) => {
    const monthData = data.filter((item) => item.name.startsWith(month));
    if (monthData.length === 0) return null;

    return monthData.reduce(
      (acc, item) => {
        for (const key in item) {
          if (key !== "name") {
            acc[key] += item[key];
          }
        }
        return acc;
      },
      { name: month, uv: 0, pv: 0, amt: 0, jt: 0, jb: 0 }
    );
  };

  const aggregateYearData = (year) => {
    const yearData = data.filter((item) => item.name.startsWith(year));
    if (yearData.length === 0) return null;

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

  // Filter data based on selected dates or show all
  const filteredData = useMemo(() => {
    if (filterType === "all") {
      return data; // Return all data for 'all' filter
    } else if (selectedDates.length) {
      return selectedDates.flatMap((date) => {
        if (date && date.length === 4) {
          const aggregatedData = aggregateYearData(date);
          return aggregatedData ? [aggregatedData] : [];
        } else if (date && date.length === 7) {
          const aggregatedData = aggregateMonthData(date);
          return aggregatedData ? [aggregatedData] : [];
        }
        return data.filter((item) => item.name === date);
      });
    }
    return [];
  }, [selectedDates, data, filterType]);

  // Toggle visibility of data keys (uv, pv, etc.)
  const toggleDataKey = (key) => {
    setDataKeys((prevKeys) => ({ ...prevKeys, [key]: !prevKeys[key] }));
  };

  // Handle previous and next button click
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredData.length / CHUNK_SIZE) - 1)
    );

  // Set the chart width with a maximum of 200%
  const maxWidthPercentage = 100; // maximum width in percentage
  const chunkCount = Math.ceil(filteredData.length / CHUNK_SIZE);
  const chartWidth =
    filterType === "all"
      ? `${Math.min(chunkCount * 100, maxWidthPercentage)}%`
      : "100%";

  const currentDataChunk = filteredData.slice(
    currentPage * CHUNK_SIZE,
    (currentPage + 1) * CHUNK_SIZE
  );

  return (
    <div className="w-full mx-auto px-4">
      <h3 className="text-2xl font-semibold text-center my-10">Dashboard</h3>

      {/* Filter buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["all", "month", "year"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filterType === type
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Date selectors */}
      {filterType !== "all" &&
        selectedDates.map((date, index) => (
          <div key={index} className="flex items-center justify-center mb-4">
            <select
              value={date || ""}
              onChange={(e) => handleDateChange(index, e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="">
                Select {filterType === "year" ? "Year" : "Month-Year"}
              </option>
              {generateDateOptions().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={() => clearDateSelection(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-red-600 transition duration-200"
            >
              Clear
            </button>
          </div>
        ))}

      {filterType !== "all" && selectedDates.length < 5 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setSelectedDates([...selectedDates, null])}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Date Picker
          </button>
        </div>
      )}

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
            className={`cursor-pointer flex items-center bg-gray-200 rounded-lg px-4 py-2 transition duration-200 hover:bg-gray-300 ${
              dataKeys[item.key] ? "bg-blue-600 text-black" : "text-gray-700"
            }`}
          >
            <input
              type="checkbox"
              checked={dataKeys[item.key]}
              onChange={() =>
                setDataKeys({ ...dataKeys, [item.key]: !dataKeys[item.key] })
              }
              className="mr-2 h-4 w-4 accent-blue-600"
            />
            {item.label}
          </label>
        ))}
      </div>

      <div className="overflow-x-auto mb-10">
        <div style={{ width: chartWidth }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={currentDataChunk}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.uv && <Bar dataKey="uv" fill="#8884d8" barSize={10} />}
              {dataKeys.pv && <Bar dataKey="pv" fill="#82ca9d" barSize={10} />}
              {dataKeys.amt && (
                <Bar dataKey="amt" fill="#ffc658" barSize={10} />
              )}
              {dataKeys.jt && <Bar dataKey="jt" fill="#ff7f0e" barSize={10} />}
              {dataKeys.jb && <Bar dataKey="jb" fill="#d62728" barSize={10} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mb-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage >= chunkCount - 1}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
