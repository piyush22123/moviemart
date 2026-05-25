import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UpdateMovie from "../pages/Admin/UpdateMovie";
import Dashboard from "../pages/Admin/Dashboard";
import UploadMovie from "../pages/Admin/UploadMovie";
import Categorywise from "../pages/Categorywise";
import NavBar from "../components/NavBar";
import { useState } from "react";

const AppRoutes = () => {

  const [ searchTerm, setSearchTerm ] = useState("");

  return (
    <>
    <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
    <Routes>
      <Route path="/" element={<Home searchTerm={searchTerm} />} />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/upload" element={<UploadMovie/>} />
      <Route path="/admin/dashboard" element={<Dashboard searchTerm={searchTerm} />} />
      <Route path="/admin/update/:movieId" element={<UpdateMovie/>} />
      <Route path="/movie/category/:categoryName" element={<Categorywise searchTerm={searchTerm}/>} />

    </Routes>
    </>
  );
};

export default AppRoutes;