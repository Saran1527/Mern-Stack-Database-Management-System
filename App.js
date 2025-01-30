
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import FormPage from "./components/FormPage";
import DetailsPage from "./components/DetailsPage";
import Login from "./components/Login";
import UserDetails from './components/UserDetails';
import "./App.css";

const App = () => {
  const [entries, setEntries] = useState([]);
  const [editData, setEditData] = useState(null); 
  
  

  
  const fetchEntries = () => {
    fetch("http://localhost:5000/api/entries")
      .then((response) => response.json())
      .then((data) => setEntries(data))
      .catch((error) => console.error("Error fetching data:", error));
  };
  
  useEffect(() => {
    fetchEntries();
  }, []);

   
  const handleDelete = (item) => {
    fetch("http://localhost:5000/api/entries", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: item.name }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to delete");
      })
      .then(() => fetchEntries())
      .catch((error) => console.error("Error deleting entry:", error));
  };
  
  const handleEdit = (entry) => {
    setEditData(entry); 
  };
   
  const handleResetForm = () => {
    setEditData(null);
  };

  

  return (
    <Router>
      <nav>
        <Link to="/Firstpage" />
        <Link to="/details" />
        <Link to="/" /> 
        <Link to="user-details"/>     
      </nav>
      <Routes>
       <Route path="/user-details" element={<UserDetails/>} fetchEntries = {fetchEntries} setEntries={setEntries}/>
        <Route
          path="/Firstpage"
          element={<FormPage 
            fetchEntries = {fetchEntries}
             editData={editData} />}
        />
        <Route path="/" element={<Login />}  />
        <Route
          path="/details"
          element={
            <DetailsPage
              data={entries}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onResetForm={handleResetForm}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
