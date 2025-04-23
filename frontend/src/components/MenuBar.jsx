import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const MenuBar = () => {
  const navigate = useNavigate();
  const username = Cookies.get("username");
  const role = Cookies.get("role");

  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("id");
    Cookies.remove("role");
    navigate("/login");
  };

  const links = {
    ADMIN: [
      { path: "/admin/home", label: "Home" },
      { path: "/admin/trainstats", label: "Train Stats" },
    ],
    COLLECTOR: [
      { path: "/collector/home", label: "Home" },
      { path: "/collector/ticketview", label: "Ticket View" },
    ],
    PASSENGER: [
      { path: "/passenger/home", label: "Home" },
      { path: "/passenger/history", label: "History" },
      { path: "/passenger/booking", label: "Booking" },
    ],
  };

  return (
    <div className="bg-gray-800 text-white flex items-center justify-between px-4 py-2 fixed top-0 left-0 w-full z-50">
      <div className="flex space-x-3">
        {links[role]?.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive ? "bg-gray-600" : "hover:bg-gray-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded"
        >
          Logout
        </button>
        <span className="font-bold">{role}</span>
        <span>{username}</span>
      </div>
    </div>
  );
};

export default MenuBar;
