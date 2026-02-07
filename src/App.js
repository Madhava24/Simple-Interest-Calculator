import React, { useState, useCallback } from "react";
// import { use } from "react";
// import { calculateNewValue } from '@testing-library/user-event/dist/utils';

// Main App component
const App = () => {
  // State variables for input fields
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [rateUnit, setRateUnit] = useState("per_month"); // 'per_annum' or 'per_month'
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to current date
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to current date

  // State for error messages
  const [principalError, setPrincipalError] = useState("");
  const [rateError, setRateError] = useState("");
  const [dateError, setDateError] = useState("");

  /**
   * Validates all input fields for simple interest calculation.
   * @returns {boolean} True if all inputs are valid, false otherwise.
   */
  const validateInputs = useCallback(() => {
    let isValid = true;

    // Validate Principal
    if (isNaN(parseFloat(principal)) || parseFloat(principal) <= 0) {
      setPrincipalError('Principal must be a positive number.');
      isValid = false;
    } else {
      setPrincipalError('');
    }

    // Validate Rate
    if (isNaN(parseFloat(rate)) || parseFloat(rate) <= 0) {
      setRateError('Rate must be a positive number.');
      isValid = false;
    } else {
      setRateError('');
    }

    // Validate Dates
    if (!startDate || !endDate) {
      isValid = false;
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        setDateError("End date cannot be before start date.");
        isValid = false;
      } else {
        setDateError("");
      }
    }
    return isValid;
  }, [principal, rate, startDate, endDate, setPrincipalError, setRateError, setDateError]);

  React.useEffect(() => {
    validateInputs();
  }, [
    principal,
    rate,
    startDate,
    endDate,
    validateInputs,
  ]);

  const formatDateRange = (diff) => {
    return `${diff.years} years, ${diff.months} months, ${diff.days} days`;
  };
  // Helper function to get difference as years, months, days
  function getYMDifference(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    if (end < start) [start, end] = [end, start];

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in previous month
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  }

  // Helper to calculate duration in days, months, years
//   const getDurationDetails = (start, end) => {
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     const diffMonths = diffDays / 30;
//     const diffYears = diffDays / 365;
//     const diff = getYMDifference(start, end);
//     console.log("Dates diff", diff);
//     return { diffDays, diffMonths, diffYears };
//   };

  const calculateSimpleInterest = (diff) => {
    const months = diff.months + diff.years * 12 + diff.days / 30;
    let roi = parseFloat(rate);
    if (rateUnit === "per_annum") {
      roi /= 12;
    }
    const simpleInterestPerMonth = (parseFloat(principal) * roi) / 100;
    const simpleInterest = (simpleInterestPerMonth * months).toFixed(2);
    return { simpleInterest, simpleInterestPerMonth };
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 flex flex-col items-center justify-center p-2 font-inter">
      <h1 className="text-4xl font-extrabold text-center  mb-8 tracking-tight">
        Simple Interest Calculator
      </h1>
      <div className="bg-white/90 p-4 md:p-8 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[96vh] flex flex-col md:flex-row gap-8 transition-all duration-300">
        {/* Left: Input Form */}
        <div className="flex-1 flex flex-col justify-center bg-white/80 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <form className="space-y-6">
            {/* Principal Input */}
            <div>
              <label
                htmlFor="principal"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Principal Amount (₹)
              </label>
              <input
                type="number"
                id="principal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className={`w-full p-3 border-2 ${
                  principalError ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm bg-white`}
                placeholder="e.g., 10000"
                required
                min="0"
                step="any"
              />
              {principalError && (
                <p className="mt-2 text-sm text-red-600">{principalError}</p>
              )}
            </div>
            {/* Rate of Interest Input */}
            <div>
              <label
                htmlFor="rate"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Rate of Interest (%)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className={`flex-grow p-3 border-2 ${
                    rateError ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm bg-white`}
                  placeholder="e.g., 5"
                  required
                  min="0"
                  step="any"
                />
                <select
                  id="rateUnit"
                  value={rateUnit}
                  onChange={(e) => setRateUnit(e.target.value)}
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm bg-white cursor-pointer"
                >
                  <option value="per_annum">Per Annum</option>
                  <option value="per_month">Per Month</option>
                </select>
              </div>
              {rateError && (
                <p className="mt-2 text-sm text-red-600">{rateError}</p>
              )}
            </div>
            {/* Start Date Input */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm bg-white"
                required
              />
            </div>
            {/* End Date Input */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm bg-white"
                required
              />
              {dateError && (
                <p className="mt-2 text-sm text-red-600">{dateError}</p>
              )}
            </div>
          </form>
        </div>
        {/* Right: Result Display (always visible, reserved space) */}
        <div className="flex-1 flex flex-col justify-start items-center min-h-[350px] border-t-2 md:border-t-0 md:border-l-2 border-gray-200 pt-8 md:pt-0 md:pl-8 transition-all duration-300 bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4 mt-8">
            Calculated Simple Interest
          </h2>
          {/* Additional Details */}
          {(() => {
            let start = startDate ? new Date(startDate) : "-";
            let end = endDate ? new Date(endDate) : "-";
            let diff = { years: "-", months: "-", days: "-" };
            let simpleInterest = "-";
            let simpleInterestPerMonth = "-";
            let totalAmount = "-";
            if (startDate && endDate) {
              diff = getYMDifference(start, end);
              if (principal && rate) {
                const resp = calculateSimpleInterest(diff);
                simpleInterest = resp.simpleInterest;
                simpleInterestPerMonth = resp.simpleInterestPerMonth.toFixed(2);
                totalAmount = (
                  parseFloat(principal) + parseFloat(simpleInterest)
                ).toFixed(2);
              }
            }
            return (
              <>
                <p className="text-5xl font-extrabold text-indigo-700 tracking-wider min-h-[3.5rem] flex items-center justify-center drop-shadow-lg">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ₹{simpleInterest}
                  </span>
                </p>
                <div className="mt-8 w-full max-w-md bg-white/80 rounded-lg shadow p-4 text-gray-700 space-y-2 text-base mt-10">
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{formatDateRange(diff)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Interest:</span>
                    <span>₹{simpleInterest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Interest per Month:</span>
                    <span>₹{simpleInterestPerMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Interest per Day:</span>
                    <span>
                      ₹
                      {simpleInterestPerMonth !== "-"
                        ? (simpleInterestPerMonth / 30).toFixed(3)
                        : "-"}
                    </span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default App;
