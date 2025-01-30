import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDetails.css"


const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleEdit = () => {
    setIsEditing(true); 
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, image: imageUrl }); 
    }
  };
  
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("address", user.address);
    formData.append("age", user.age);
    formData.append("password", user.password);
    formData.append("role", user.role);
  
   
    if (user.image) {
      const imageFile = document.getElementById("image").files[0];  
      formData.append("image", imageFile);  
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/entries/${user.id}`, {
        method: "PUT",
        body: formData,  
      });
    
      if (response.ok) {
        
        alert("Details updated successfully!");
        setIsEditing(false);
        
      } else {
        alert("Error updating details.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating details.");
    }
  };
  

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  if (!user) {
    return <div className="loading-container"><p>Loading...</p></div>;
  }

  return (
    <div className="app-container">
      <div className="navbar2">
        <button className="sidebar-toggle2" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      <div className="main-content2">
        {isSidebarOpen && (
          <div className="sidebar2">
            <ul className="sidebar-list2">
              <li onClick={toggleSidebar}>Dashboard</li>
            </ul>
          </div>
        )}

        <div className="content-area2">
            {isEditing ? (
              <div className="user-details-form">
                <h2 className="user-details-header2">Edit User</h2>
                <div className="form-group1">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <img
                    src={user.image}
                    alt="Profile"
                    className="image-preview"
                    onClick={() => document.getElementById("image").click()}
                  />
                </div>

                <div className="horizontal-group">
                <div className="form-group1">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </div>

                <div className="form-group1">
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={user.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                </div>

                <div className="form-actions">
                  <button onClick={handleSave} className="Userbutton1">Save</button>
                  <button onClick={handleCancelEdit} className="Userbutton2">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="user-details-container">
                <h2 className="user-details-header3">User Details</h2>
                <img
                  src={user.image || "/default-image.jpg"}
                  alt="Profile"
                  className="user-image"
                />
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Age:</strong> {user.age}</p>
                
                <button onClick={handleLogout}className="Show1">Logout</button>
                <button onClick={handleEdit} className="Show2">Edit Details</button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default UserDetails;


