import React, { Component } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";

export default class Register extends Component {
  state = {
    username: "",
    password: "",
    error: "",
    success: false,
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    try {
      await axios.post("http://localhost:8080/api/users/register", {
        username,
        password,
      });
      this.setState({ success: true, error: "" });
    } catch (error) {
      this.setState({
        error: error.response?.data || "Registration failed",
        success: false,
      });
    }
  };

  render() {
    const { username, password, error, success } = this.state;

    if (success) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="register-container flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={this.handleSubmit}
          className="bg-gray-800 p-6 rounded shadow-md w-80"
        >
          <div className="mb-4">
            <label className="block mb-2">Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
          >
            Register
          </button>
        </form>
        <Link
          to="/login"
          className="mt-4 text-gray-400 hover:text-white underline"
        >
          Already have an account? Login here
        </Link>
      </div>
    );
  }
}
