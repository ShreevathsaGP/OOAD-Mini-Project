import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const PassengerBooking = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trainId = queryParams.get("trainId");

  const [train, setTrain] = useState(null);
  const [error, setError] = useState("");
  const [seatRequest, setSeatRequest] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  // Get userId from cookies
  const userId = Cookies.get("id");

  useEffect(() => {
    if (trainId) {
      fetchTrainDetails();
    }
  }, [trainId]);

  const fetchTrainDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/trains/${trainId}`
      );
      setTrain(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to fetch train details");
    }
  };

  const handleSeatChange = (seatClass, value) => {
    const parsedValue = parseInt(value, 10) || 0;
    setSeatRequest((prev) => ({
      ...prev,
      [seatClass]: parsedValue,
    }));
  };

  const calculateTotalAmount = () => {
    if (!train) return 0;
    let total = 0;
    Object.entries(seatRequest).forEach(([seatClass, count]) => {
      const price = train.seats[seatClass]?.price || 0;
      total += count * price;
    });
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [seatRequest]);

  const handleBooking = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/bookings", {
        userId,
        trainId,
        seatRequest,
      });
      alert("Booking successful! Booking ID: " + response.data.id);
    } catch (err) {
      alert(err.response?.data || "Failed to create booking");
    }
  };

  if (error) {
    return (
      <div className="passenger-booking-container p-6">
        <h1 className="text-2xl font-bold mb-4">Passenger Booking</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="passenger-booking-container p-6">
        <h1 className="text-2xl font-bold mb-4">Passenger Booking</h1>
        <p className="text-gray-400">Loading train details...</p>
      </div>
    );
  }

  return (
    <div className="passenger-booking-container p-6">
      <h1 className="text-2xl font-bold mb-4">Passenger Booking</h1>
      <div className="bg-gray-800 text-white p-6 rounded shadow-md">
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
        <div className="mt-6">
          <h3 className="font-bold mb-4 text-lg">Select Seats:</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(train.seats).map(([seatClass, details]) => {
              const availableSeatsArray = Array.isArray(
                details.availableSeatsArray
              )
                ? details.availableSeatsArray
                : [];
              const availableSeats = availableSeatsArray.filter(
                (seat) => seat
              ).length;
              return (
                <div
                  key={seatClass}
                  className="bg-gray-700 p-4 rounded shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-lg mb-2">{seatClass}</h4>
                    <p className="text-sm">
                      Price: ₹{details.price} | Available Seats:{" "}
                      {availableSeats}
                    </p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={availableSeats}
                    value={seatRequest[seatClass] || ""}
                    onChange={(e) =>
                      handleSeatChange(seatClass, e.target.value)
                    }
                    className="mt-4 p-2 rounded bg-gray-600 text-white w-full"
                    placeholder="Enter quantity"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-bold text-lg">Total Amount: ₹{totalAmount}</h3>
        </div>
        <button
          onClick={handleBooking}
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default PassengerBooking;
