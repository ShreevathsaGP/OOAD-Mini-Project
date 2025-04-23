import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CollecterTicketView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ticketId = queryParams.get("id");

  const [ticket, setTicket] = useState(null);
  const [username, setUsername] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tickets/${ticketId}`
      );
      setTicket(response.data);
      setError("");

      // Fetch username using userId from the ticket
      const userResponse = await axios.get(
        `http://localhost:8080/api/users/${response.data.userId}/username`
      );
      setUsername(userResponse.data);

      // Fetch train name using trainId from the ticket
      const trainNameResponse = await axios.get(
        `http://localhost:8080/api/trains/${response.data.trainId}/name`
      );
      setTrainName(trainNameResponse.data);

      // Fetch train number using trainId from the ticket
      const trainNumberResponse = await axios.get(
        `http://localhost:8080/api/trains/${response.data.trainId}/number`
      );
      setTrainNumber(trainNumberResponse.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch ticket details");
    }
  };

  const updateTicketStatus = async (status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tickets/update-status/${ticketId}?status=${status}`
      );
      setTicket(response.data); // Update ticket details with the new status
      alert("Ticket status updated successfully");
    } catch (err) {
      alert(err.response?.data || "Failed to update ticket status");
    }
  };

  if (error) {
    return (
      <div className="collector-ticket-view-container p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">Ticket Details</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="collector-ticket-view-container p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">Ticket Details</h1>
        <p className="text-gray-400">Loading ticket details...</p>
      </div>
    );
  }

  return (
    <div className="collector-ticket-view-container p-6 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Ticket Details</h1>
      <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-lg mx-auto">
        <p className="mb-4">
          <span className="font-bold">Ticket ID:</span> {ticket.id}
        </p>
        <p className="mb-4">
          <span className="font-bold">User ID:</span> {ticket.userId}
        </p>
        <p className="mb-4">
          <span className="font-bold">Username:</span> {username}
        </p>
        <p className="mb-4">
          <span className="font-bold">Train Number:</span> {trainNumber}
        </p>
        <p className="mb-4">
          <span className="font-bold">Train Name:</span> {trainName}
        </p>
        <p className="mb-4">
          <span className="font-bold">Seat Class:</span> {ticket.seatClass}
        </p>
        <p className="mb-4">
          <span className="font-bold">Seat Number:</span> {ticket.seatNumber}
        </p>
        <p className="mb-6">
          <span className="font-bold">Current Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded ${
              ticket.status === "CONFIRMED"
                ? "bg-blue-600"
                : ticket.status === "VALIDATE"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {ticket.status === "CONFIRMED" ? "PENDING" : ticket.status}
          </span>
        </p>
        <div className="flex justify-between">
          <button
            onClick={() => updateTicketStatus("CONFIRMED")}
            className={`px-4 py-2 rounded ${
              ticket.status === "CONFIRMED"
                ? "bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white`}
          >
            Pending
          </button>
          <button
            onClick={() => updateTicketStatus("VALIDATE")}
            className={`px-4 py-2 rounded ${
              ticket.status === "VALIDATE"
                ? "bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white`}
          >
            Validate
          </button>
          <button
            onClick={() => updateTicketStatus("BLACKLIST")}
            className={`px-4 py-2 rounded ${
              ticket.status === "BLACKLIST"
                ? "bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white`}
          >
            Blacklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollecterTicketView;
