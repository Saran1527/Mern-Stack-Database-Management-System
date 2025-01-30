import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './DetailsPage.css'

const DetailsPage = ({ data, onDelete, onEdit, onResetForm}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate();
  

  const handleEditClick = (item) => {
    onEdit(item);
    navigate("/Firstpage");
  };

  const handleDeleteClick = (item) => {
    if (item.name) {
      onDelete(item);
    }
  };

  const handleRegisterClick = () => {
    onResetForm();
    navigate("/Firstpage"); 
   
    
  };

 
  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/");
  };
}
const toggleSidebar = () => {
  setSidebarOpen((prevState) => !prevState);
};

  return (
    <div>
      <div className="navbar1">
        <button className="sidebar-toggle1" onClick={toggleSidebar}>
          ☰
        </button>
        <h2 className="details1">UserDashborad</h2>
      </div>

      <div className="main-content1">
        {sidebarOpen && (
          <div className="sidebar1">
            <ul className="sidebar-list1">
              <li onClick={toggleSidebar}>Dashboard</li>
            </ul>
          </div>
        )}
      </div> 
      <div className="table_details">
      <h2 className="details">Dashborad:</h2>
      {data.length === 0 ? (
        <p className="One">No entries available</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>       
              <th>Phone</th>
              <th>Address</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                   src={item.image || "https://th.bing.com/th?q=Male+User+Icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247"}
                   alt={item.name }
                    className="profile-image"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.password}</td>
                <td>{item.role}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>{item.age}</td>
                <td>
                  <button onClick={() => handleEditClick(item)}>Edit</button>
                  <button onClick={() => handleDeleteClick(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="button-container">
        <button onClick={handleRegisterClick} className="register-btn">Register</button>
        <button onClick={handleLogoutClick} className="logout-btn">Logout</button>
      </div>
    </div>
   </div>
  );
};

export default DetailsPage;
