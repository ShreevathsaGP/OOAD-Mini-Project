import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PassengerViewBooking = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState("");
  const [expandedClasses, setExpandedClasses] = useState({});
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get("bookingId");
    if (bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [location]);

  const fetchBookingDetails = async (bookingId) => {
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
      setBookingDetails({ ...response.data, tickets });
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to fetch booking details");
    }
  };

  const toggleClass = (seatClass) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [seatClass]: !prev[seatClass],
    }));
  };

  if (error) {
    return (
      <div className="passenger-view-booking-container p-6">
        <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="passenger-view-booking-container p-6">
        <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const groupedTickets = bookingDetails.tickets.reduce((acc, ticket) => {
    if (!acc[ticket.seatClass]) {
      acc[ticket.seatClass] = [];
    }
    acc[ticket.seatClass].push(ticket);
    return acc;
  }, {});

  return (
    <div className="passenger-view-booking-container p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <div className="bg-gray-800 text-white p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-bold mb-2">
          Booking ID: {bookingDetails.id}
        </h2>
        <p className="mb-2">
          <span className="font-bold">Total Amount:</span> ₹
          {bookingDetails.totalAmount}
        </p>
        <p className="mb-4">
          <span className="font-bold">Number of Tickets:</span>{" "}
          {bookingDetails.tickets.length}
        </p>
        <h2 className="text-xl font-bold mb-4">Tickets by Class</h2>
        {Object.entries(groupedTickets).map(([seatClass, tickets]) => (
          <div key={seatClass} className="mb-6">
            <div
              className="cursor-pointer bg-gray-700 text-white p-4 rounded shadow-md flex justify-between items-center"
              onClick={() => toggleClass(seatClass)}
            >
              <h3 className="text-lg font-bold capitalize">
                {seatClass} Class
              </h3>
              <span>{expandedClasses[seatClass] ? "▲" : "▼"}</span>
            </div>
            {expandedClasses[seatClass] && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gray-600 text-white p-4 rounded shadow-md"
                  >
                    <p className="mb-2">
                      <span className="font-bold">Ticket ID:</span> {ticket.id}
                    </p>
                    <p className="mb-2">
                      <span className="font-bold">Passenger Name:</span>{" "}
                      {ticket.passengerName}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerViewBooking;
