import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminHome from "./pages/admin/AdminHome";
import AdminTrainStats from "./pages/admin/AdminTrainStats";
import PassengerHome from "./pages/passenger/PassengerHome";
import PassengerHistory from "./pages/passenger/PassengerHistory";
import PassengerBooking from "./pages/passenger/PassengerBooking";
import CollectorHome from "./pages/collector/CollectorHome";
import CollecterTicketView from "./pages/collector/CollecterTicketView";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MenuBar from "./components/MenuBar";
import Cookies from "js-cookie";
import PassengerViewBooking from "./pages/passenger/PassengerViewBooking";

function App() {
  const role = Cookies.get("role");

  return (
    <>
      <MenuBar />
      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin/home" />
              ) : role === "COLLECTOR" ? (
                <Navigate to="/collector/home" />
              ) : role === "PASSENGER" ? (
                <Navigate to="/passenger/home" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/trainstats" element={<AdminTrainStats />} />
          <Route path="/passenger/home" element={<PassengerHome />} />
          <Route path="/passenger/history" element={<PassengerHistory />} />
          <Route path="/passenger/booking" element={<PassengerBooking />} />
          <Route
            path="/passenger/viewbooking"
            element={<PassengerViewBooking />}
          />
          <Route path="/collector/home" element={<CollectorHome />} />
          <Route
            path="/collector/ticketview"
            element={<CollecterTicketView />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
