import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTrainStats = () => {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/trains");
      setTrains(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to fetch trains");
    }
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
  };

  const handleDeleteTrain = async (trainId) => {
    try {
      await axios.delete(`http://localhost:8080/api/trains/delete/${trainId}`);
      alert("Train deleted successfully");
      fetchTrains(); // Refresh train list after deletion
      setSelectedTrain(null);
    } catch (err) {
      alert(err.response?.data || "Failed to delete train");
    }
  };

  return (
    <div className="admin-train-stats-container p-6 pt-20 h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Train Dashboard</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-5rem)]">
        {/* Train List */}
        <div className="bg-gray-800 text-white p-6 rounded shadow-md h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Train List</h2>
          <ul className="space-y-4">
            {trains.map((train) => (
              <li
                key={train.id}
                className={`p-4 rounded cursor-pointer ${
                  selectedTrain?.id === train.id
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => handleTrainSelect(train)}
              >
                <p className="font-bold">{train.name}</p>
                <p className="text-sm">Number: {train.number}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Train Details */}
        {selectedTrain && (
          <div className="bg-gray-800 text-white p-6 rounded shadow-md h-full relative">
            <h2 className="text-xl font-bold mb-4">Train Details</h2>
            <p className="mb-2">
              <span className="font-bold">Name:</span> {selectedTrain.name}
            </p>
            <p className="mb-2">
              <span className="font-bold">Number:</span> {selectedTrain.number}
            </p>
            <p className="mb-2">
              <span className="font-bold">Departure:</span>{" "}
              {selectedTrain.stations.departureStationCode} at{" "}
              {new Date(selectedTrain.schedule.departureTime).toLocaleString()}
            </p>
            <p className="mb-2">
              <span className="font-bold">Arrival:</span>{" "}
              {selectedTrain.stations.arrivalStationCode} at{" "}
              {new Date(selectedTrain.schedule.arrivalTime).toLocaleString()}
            </p>
            <p className="mb-4">
              <span className="font-bold">Status:</span> {selectedTrain.status}
            </p>
            <h3 className="font-bold mb-2">Seat Classes:</h3>
            <ul className="list-disc list-inside mb-4">
              {Object.entries(selectedTrain.seats).map(
                ([seatClass, details]) => (
                  <li key={seatClass}>
                    <span className="font-bold">{seatClass}:</span> ₹
                    {details.price} | Total Seats: {details.totalSeats} |
                    Available Seats:{" "}
                    {details.availableSeatsArray.filter((seat) => seat).length}
                  </li>
                )
              )}
            </ul>
            <button
              onClick={() => handleDeleteTrain(selectedTrain.id)}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded absolute bottom-6 right-6"
            >
              Delete Train
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrainStats;
