import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import ManagePermissions from "./pages/admin/ManagePermissions";
import ManageMovies from "./pages/admin/ManageMovies";
import ManageCinemas from "./pages/admin/ManageCinemas";
import ManageSchedules from "./pages/admin/ManageSchedules";
import ManageRoles from "./pages/admin/ManageRoles";
import OauthGoogleCallback from "./pages/authGoogleCallback ";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <AuthProvider>
        <Toaster />
        {!isAdminRoute && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-google-callback" element={<OauthGoogleCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/:id/:date" element={<SeatLayout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/admin/*" element={<AdminLayout />} >
            <Route index element={<Dashboard />} />
            <Route path="manage-movies" element={<ManageMovies />} />
            <Route path="manage-permissions" element={<ManagePermissions />} />
            <Route path="manage-cinemas" element={<ManageCinemas />} />
            <Route path="manage-schedules" element={<ManageSchedules />} />
            <Route path="manage-roles" element={<ManageRoles />} />
          </Route>
        </Routes>
        {!isAdminRoute && <Footer />}
      </AuthProvider>
    </>
  );
};

export default App;
