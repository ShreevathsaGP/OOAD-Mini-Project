import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const PassengerHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  // Get userId from cookies
  const userId = Cookies.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/bookings/user/${userId}`
      );
      const detailedBookings = await Promise.all(
        response.data.map(async (booking) => {
          const tickets = await Promise.all(
            booking.ticketIds.map(async (ticketId) => {
              const ticketResponse = await axios.get(
                `http://localhost:8080/api/tickets/${ticketId}`
              );
              return ticketResponse.data;
            })
          );
          return { ...booking, tickets };
        })
      );
      setBookings(detailedBookings);
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to fetch bookings");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:8080/api/bookings/${bookingId}`);
      alert("Booking deleted successfully");
      fetchBookings(); // Refresh bookings after deletion
    } catch (err) {
      alert(err.response?.data || "Failed to delete booking");
    }
  };

  if (error) {
    return (
      <div className="passenger-history-container p-6">
        <h1 className="text-2xl font-bold mb-4">Booking History</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="passenger-history-container p-6">
        <h1 className="text-2xl font-bold mb-4">Booking History</h1>
        <p className="text-gray-400">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="passenger-history-container p-6">
      <h1 className="text-2xl font-bold mb-4">Booking History</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-gray-800 text-white p-6 rounded shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">
                Booking ID: {booking.id}
              </h2>
              <p className="mb-2">
                <span className="font-bold">Total Amount:</span> ₹
                {booking.totalAmount}
              </p>
              <p className="mb-2">
                <span className="font-bold">Tickets:</span>{" "}
                {booking.ticketIds.length}
              </p>
              <div className="mt-4">
                <h3 className="font-bold mb-2">Seat Details:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(
                    booking.tickets.reduce((acc, ticket) => {
                      const seatClass = ticket.seatClass;
                      acc[seatClass] = (acc[seatClass] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([seatClass, count]) => (
                    <li key={seatClass}>
                      <span className="font-bold">{seatClass}:</span> {count}{" "}
                      seat(s)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDeleteBooking(booking.id)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Booking
              </button>
              <button
                onClick={() =>
                  navigate(`/passenger/viewbooking?bookingId=${booking.id}`)
                }
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
              >
                View Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerHistory;
