import React, { useState, useEffect, useMemo } from "react";
import { FaFilter } from "react-icons/fa";
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
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data.json");
      const jsonData = await res.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (filterType !== "all") {
      setSelectedDates([]);
      setCurrentPage(0);
    } else {
      const totalChunks = Math.ceil(data.length / CHUNK_SIZE);
      setCurrentPage(Math.max(totalChunks - 1, 0));
    }
  }, [filterType, data]);

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

  const filteredData = useMemo(() => {
    if (filterType === "all") {
      return data;
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

  const toggleDataKey = (key) => {
    setDataKeys((prevKeys) => ({ ...prevKeys, [key]: !prevKeys[key] }));
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredData.length / CHUNK_SIZE) - 1)
    );

  const chunkCount = Math.ceil(filteredData.length / CHUNK_SIZE);
  const currentDataChunk = filteredData.slice(
    currentPage * CHUNK_SIZE,
    (currentPage + 1) * CHUNK_SIZE
  );

  return (
    <div className="w-full mx-auto bg-[#1a1a1a] h-full">
      <h3 className="text-xl font-medium text-center text-gray-300 h-[10vh] flex items-center justify-center">
        Data Management Dashboard
      </h3>
      <div className="flex items-start justify-center w-full h-[90vh]">
        <div className="flex flex-col w-[10%] h-full items-center">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="flex items-center bg-gray-800 text-gray-300 px-3 py-2 rounded-md transition hover:bg-gray-700"
          >
            <FaFilter className="mr-2" /> Filter
          </button>
          {isFilterVisible && (
            <div className="mt-4 space-y-4 bg-gray-900 p-3 rounded-md shadow-md w-full">
              <div className="flex flex-col items-center space-y-2">
                {["all", "month", "year"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-2 rounded-md transition duration-200 w-full text-center ${
                      filterType === type
                        ? "bg-gray-700 text-gray-100 shadow"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              {filterType !== "all" &&
                selectedDates.map((date, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center w-full"
                  >
                    <select
                      value={date || ""}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      className="border border-gray-700 bg-gray-800 text-gray-300 rounded-md px-2 py-1 focus:border-gray-500 focus:ring focus:ring-gray-500 transition duration-200 w-full"
                    >
                      <option value="" className="text-gray-500">
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
                      className="bg-red-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-red-600 transition duration-200"
                    >
                      Clear
                    </button>
                  </div>
                ))}
              {filterType !== "all" && selectedDates.length < 5 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedDates([...selectedDates, null])}
                    className="bg-gray-800 text-gray-100 px-3 py-2 rounded-md hover:bg-gray-700 transition duration-200 w-full"
                  >
                    Add Date Picker
                  </button>
                </div>
              )}
              <div className="flex flex-col items-center space-y-2 w-full">
                {[
                  { key: "uv", label: "UV" },
                  { key: "pv", label: "PV" },
                  { key: "amt", label: "AMT" },
                  { key: "jt", label: "JT" },
                  { key: "jb", label: "JB" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`cursor-pointer flex items-center bg-gray-800 rounded-md px-3 py-1 transition hover:bg-gray-700 w-full ${
                      dataKeys[item.key]
                        ? "text-gray-100"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={dataKeys[item.key]}
                      onChange={() => toggleDataKey(item.key)}
                      className="mr-2"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-grow flex flex-col items-center w-[90%] h-full">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={currentDataChunk}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              />
              <Legend
                wrapperStyle={{ color: "#ccc" }}
                onClick={(e) => toggleDataKey(e.dataKey)}
              />
              {dataKeys.uv && (
                <Bar dataKey="uv" fill="rgba(173, 216, 230, 0.7)" />
              )}
              {dataKeys.pv && (
                <Bar dataKey="pv" fill="rgba(144, 238, 144, 0.7)" />
              )}
              {dataKeys.amt && (
                <Bar dataKey="amt" fill="rgba(255, 165, 0, 0.7)" />
              )}
              {dataKeys.jt && (
                <Bar dataKey="jt" fill="rgba(255, 99, 71, 0.7)" />
              )}
              {dataKeys.jb && <Bar dataKey="jb" fill="rgba(75, 0, 130, 0.7)" />}
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="bg-gray-700 text-gray-100 px-3 py-2 rounded-md transition hover:bg-gray-600 disabled:bg-gray-500"
            >
              Previous
            </button>
            <span className="text-gray-300 mx-5">
              Page {currentPage + 1} of {chunkCount}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === chunkCount - 1}
              className="bg-gray-700 text-gray-100 px-3 py-2 rounded-md transition hover:bg-gray-600 disabled:bg-gray-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
