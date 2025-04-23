import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CollectorHome = () => {
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setTicketId(e.target.value);
    setError(""); // Clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketId.trim()) {
      setError("Ticket ID is required");
      return;
    }
    navigate(`/collector/ticketview?id=${ticketId}`);
  };

  return (
    <div className="collector-home-container p-6 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Ticket Collector Home
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md mx-auto"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2">Enter Ticket ID:</label>
          <input
            type="text"
            value={ticketId}
            onChange={handleInputChange}
            placeholder="Enter ticket ID"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
        >
          View Ticket
        </button>
      </form>
    </div>
  );
};

export default CollectorHome;
