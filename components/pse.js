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
  const [filterType, setFilterType] = useState("all");

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
    }
  }, [filterType]);

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
    const startYear = 2019;
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
    } else if (filterType === "week") {
      for (let year = startYear; year <= endYear; year++) {
        const endMonth = year === endYear ? 12 : 12;
        for (let month = 1; month <= endMonth; month++) {
          const formattedMonth = month < 10 ? `0${month}` : month;
          for (let week = 1; week <= 5; week++) {
            options.push(`${year}-${formattedMonth}-${week}`);
          }
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

  const filteredData =
    filterType === "all"
      ? data
      : selectedDates.length
      ? selectedDates.flatMap((date) => {
          if (date && date.length === 4) {
            const aggregatedData = aggregateYearData(date);
            return aggregatedData ? [aggregatedData] : [];
          } else if (date && date.length === 7) {
            const aggregatedData = aggregateMonthData(date);
            return aggregatedData ? [aggregatedData] : [];
          }
          return data.filter((item) => item.name === date);
        })
      : [];

  const chartWidth = filterType === "all" ? "2000%" : "100%";

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-center my-10">Dashboard</h3>
        <div className="space-x-4 flex w-full justify-center flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg ${
                filterType === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("week")}
              className={`px-4 py-2 rounded-lg ${
                filterType === "week"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setFilterType("month")}
              className={`px-4 py-2 rounded-lg ${
                filterType === "month"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setFilterType("year")}
              className={`px-4 py-2 rounded-lg ${
                filterType === "year"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Year
            </button>
          </div>
          {filterType !== "all" &&
            selectedDates.map((date, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-4" // Ensure this div is using flex
              >
                <select
                  value={date || ""}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select
                    {filterType === "year"
                      ? "Year"
                      : filterType === "month"
                      ? "Month-Year"
                      : "Week"}
                  </option>
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

        {filterType !== "all" && selectedDates.length < 5 && (
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
