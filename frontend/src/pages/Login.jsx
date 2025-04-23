import React, { Component } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default class Login extends Component {
  state = {
    username: "",
    password: "",
    error: "",
    redirectTo: null,
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          username,
          password,
        }
      );

      const { id, role } = response.data;
      Cookies.set("username", username);
      Cookies.set("id", id);
      Cookies.set("role", role);

      console.log("Login successful:", response.data);

      // Redirect based on role
      if (role === "ADMIN") {
        this.setState({ redirectTo: "/admin/home" });
      } else if (role === "COLLECTOR") {
        this.setState({ redirectTo: "/collector/home" });
      } else if (role === "PASSENGER") {
        this.setState({ redirectTo: "/passenger/home" });
      }
    } catch (error) {
      this.setState({ error: error.response?.data || "Login failed" });
    }
  };

  render() {
    const { username, password, error, redirectTo } = this.state;

    if (redirectTo) {
      return <Navigate to={redirectTo} />;
    }

    return (
      <div className="login-container flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
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
            Login
          </button>
        </form>
        <Link
          to="/register"
          className="mt-4 text-gray-400 hover:text-white underline"
        >
          Don't have an account? Register here
        </Link>
      </div>
    );
  }
}
