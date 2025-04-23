import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PassengerHome = () => {
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    trains: [],
    filteredTrains: [],
    searchQuery: "",
    error: "",
  });

  React.useEffect(() => {
    fetchAllTrains();
  }, []);

  const fetchAllTrains = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/trains");
      setState((prevState) => ({
        ...prevState,
        trains: response.data,
        filteredTrains: response.data,
        error: "",
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.response?.data || "Failed to fetch trains",
        trains: [],
        filteredTrains: [],
      }));
    }
  };

  const handleInputChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filteredTrains = state.trains.filter(
      (train) =>
        train.name.toLowerCase().includes(searchQuery) ||
        train.number.includes(searchQuery) ||
        train.stations.departureStationCode
          .toLowerCase()
          .includes(searchQuery) ||
        train.stations.arrivalStationCode.toLowerCase().includes(searchQuery)
    );
    setState((prevState) => ({ ...prevState, searchQuery, filteredTrains }));
  };

  const handleBookNow = (trainId) => {
    navigate(`/passenger/booking?trainId=${trainId}`);
  };

  const renderTrainDetails = (train) => {
    return (
      <div
        key={train.id}
        className="bg-gray-800 text-white p-6 rounded shadow-md mb-6 relative"
      >
        <h2 className="text-2xl font-bold mb-4">{train.name}</h2>
        <p className="mb-2">
          <span className="font-bold">Train Number:</span> {train.number}
        </p>
        <p className="mb-2">
          <span className="font-bold">Departure:</span>{" "}
          {train.stations.departureStationCode} at{" "}
          {new Date(train.schedule.departureTime).toLocaleString()}
        </p>
        <p className="mb-2">
          <span className="font-bold">Arrival:</span>{" "}
          {train.stations.arrivalStationCode} at{" "}
          {new Date(train.schedule.arrivalTime).toLocaleString()}
        </p>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Available Classes:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(train.seats).map(([seatClass, details]) => {
              const availableSeatsArray = Array.isArray(
                details.availableSeatsArray
              )
                ? details.availableSeatsArray
                : [];
              return (
                <li key={`${train.id}-${seatClass}`} className="mb-1">
                  <span className="font-bold">{seatClass}:</span> ₹
                  {details.price} | Available Seats:{" "}
                  {availableSeatsArray.filter((seat) => seat).length}
                </li>
              );
            })}
          </ul>
        </div>
        <button
          onClick={() => handleBookNow(train.id)}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Book Now
        </button>
      </div>
    );
  };

  const { filteredTrains, searchQuery, error } = state;

  return (
    <div className="passenger-home-container p-6 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Filter Trains</h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Enter station code, train name, or number"
          value={searchQuery}
          onChange={handleInputChange}
          className="p-2 rounded bg-gray-700 text-white w-80"
        />
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div>
        {filteredTrains.length > 0 ? (
          filteredTrains.map(renderTrainDetails)
        ) : (
          <p className="text-center text-gray-400">No trains found</p>
        )}
      </div>
    </div>
  );
};

export default PassengerHome;
