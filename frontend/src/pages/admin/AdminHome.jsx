import React, { useState } from "react";
import axios from "axios";

const AdminHome = () => {
  const [trainData, setTrainData] = useState({
    number: "",
    name: "",
    stations: {
      departureStationCode: "",
      arrivalStationCode: "",
    },
    schedule: {
      departureTime: "",
      arrivalTime: "",
    },
    seats: {
      firstClass: { totalSeats: "", price: "" },
      secondClass: { totalSeats: "", price: "" },
      sleeperClass: { totalSeats: "", price: "" },
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 1) {
      setTrainData((prev) => ({ ...prev, [name]: value }));
    } else if (keys.length === 2) {
      setTrainData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else if (keys.length === 3) {
      setTrainData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: {
            ...prev[keys[0]][keys[1]],
            [keys[2]]: value,
          },
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedTrainData = {
        ...trainData,
        schedule: {
          departureTime: new Date(
            trainData.schedule.departureTime
          ).toISOString(),
          arrivalTime: new Date(trainData.schedule.arrivalTime).toISOString(),
        },
        seats: {
          firstClass: {
            totalSeats: parseInt(trainData.seats.firstClass.totalSeats, 10),
            price: parseFloat(trainData.seats.firstClass.price),
          },
          secondClass: {
            totalSeats: parseInt(trainData.seats.secondClass.totalSeats, 10),
            price: parseFloat(trainData.seats.secondClass.price),
          },
          sleeperClass: {
            totalSeats: parseInt(trainData.seats.sleeperClass.totalSeats, 10),
            price: parseFloat(trainData.seats.sleeperClass.price),
          },
        },
      };

      await axios.post(
        "http://localhost:8080/api/trains/add",
        formattedTrainData
      );
      setSuccess("Train added successfully!");
      setError("");
      setTrainData({
        number: "",
        name: "",
        stations: {
          departureStationCode: "",
          arrivalStationCode: "",
        },
        schedule: {
          departureTime: "",
          arrivalTime: "",
        },
        seats: {
          firstClass: { totalSeats: "", price: "" },
          secondClass: { totalSeats: "", price: "" },
          sleeperClass: { totalSeats: "", price: "" },
        },
      });
    } catch (err) {
      setError(err.response?.data || "Failed to add train");
      setSuccess("");
    }
  };

  return (
    <div className="admin-home-container p-6 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Train</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-5xl mx-auto grid grid-cols-2 gap-6"
      >
        {error && <p className="text-red-500 col-span-2">{error}</p>}
        {success && <p className="text-green-500 col-span-2">{success}</p>}
        <div className="mb-4">
          <label className="block mb-2">Train Number:</label>
          <input
            type="text"
            name="number"
            value={trainData.number}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Train Name:</label>
          <input
            type="text"
            name="name"
            value={trainData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Departure Station Code:</label>
          <input
            type="text"
            name="stations.departureStationCode"
            value={trainData.stations.departureStationCode}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Arrival Station Code:</label>
          <input
            type="text"
            name="stations.arrivalStationCode"
            value={trainData.stations.arrivalStationCode}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Departure Time:</label>
          <input
            type="datetime-local"
            name="schedule.departureTime"
            value={trainData.schedule.departureTime}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Arrival Time:</label>
          <input
            type="datetime-local"
            name="schedule.arrivalTime"
            value={trainData.schedule.arrivalTime}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="col-span-2 grid grid-cols-3 gap-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2">First Class:</h3>
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              name="seats.firstClass.price"
              value={trainData.seats.firstClass.price}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <label className="block mb-2 mt-2">Total Seats:</label>
            <input
              type="number"
              name="seats.firstClass.totalSeats"
              value={trainData.seats.firstClass.totalSeats}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <h3 className="font-bold mb-2">Second Class:</h3>
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              name="seats.secondClass.price"
              value={trainData.seats.secondClass.price}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <label className="block mb-2 mt-2">Total Seats:</label>
            <input
              type="number"
              name="seats.secondClass.totalSeats"
              value={trainData.seats.secondClass.totalSeats}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <h3 className="font-bold mb-2">Sleeper Class:</h3>
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              name="seats.sleeperClass.price"
              value={trainData.seats.sleeperClass.price}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <label className="block mb-2 mt-2">Total Seats:</label>
            <input
              type="number"
              name="seats.sleeperClass.totalSeats"
              value={trainData.seats.sleeperClass.totalSeats}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
        >
          Add Train
        </button>
      </form>
    </div>
  );
};

export default AdminHome;
