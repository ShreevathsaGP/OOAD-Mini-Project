import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ViewBooking = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/bookings/${bookingId}`
      );
      const tickets = await Promise.all(
        response.data.ticketIds.map(async (ticketId) => {
          const ticketResponse = await axios.get(
            `http://localhost:8080/api/tickets/${ticketId}`
          );
          return ticketResponse.data;
        })
      );
      setBooking({ ...response.data, tickets });
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to fetch booking details");
    }
  };

  if (error) {
    return (
      <div className="view-booking-container p-6">
        <h1 className="text-2xl font-bold mb-4">View Booking</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="view-booking-container p-6">
        <h1 className="text-2xl font-bold mb-4">View Booking</h1>
        <p className="text-gray-400">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="view-booking-container p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <div className="bg-gray-800 text-white p-6 rounded shadow-md mb-6">
        <p className="mb-2">
          <span className="font-bold">Booking ID:</span> {booking.id}
        </p>
        <p className="mb-2">
          <span className="font-bold">Total Amount:</span> ₹
          {booking.totalAmount}
        </p>
        <p className="mb-4">
          <span className="font-bold">Number of Tickets:</span>{" "}
          {booking.ticketIds.length}
        </p>
        <h2 className="text-xl font-bold mb-4">Tickets</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {booking.tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-gray-700 text-white p-4 rounded shadow-md"
            >
              <p className="mb-2">
                <span className="font-bold">Ticket ID:</span> {ticket.id}
              </p>
              <p className="mb-2">
                <span className="font-bold">Passenger Name:</span>{" "}
                {ticket.passengerName}
              </p>
              <p className="mb-2">
                <span className="font-bold">Seat Class:</span>{" "}
                {ticket.seatClass}
              </p>
              <p className="mb-2">
                <span className="font-bold">Seat Number:</span>{" "}
                {ticket.seatNumber}
              </p>
              <p className="mb-2">
                <span className="font-bold">Price:</span> ₹{ticket.price}
              </p>
              <p className="mb-2">
                <span className="font-bold">Status:</span> {ticket.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;
