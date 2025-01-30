import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css"



const FormPage = ({ editData, fetchEntries }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    phone: "",
    address: "",
    age: "",
  });



  const [image, setImage] = useState(
    "https://th.bing.com/th?q=Male+User+Icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (editData) {
      setForm(editData);
      setImage(editData.image || "image");
    }
  }, [editData]);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("age", form.age);

    const fileInput = e.target.image;
    if (fileInput && fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
    }

    try {
      const url = editData
        ? `http://localhost:5000/api/entries/${editData.id}`
        : `http://localhost:5000/api/entries`;

      const method = editData ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Entry processed:", data);

        setForm({
          name: "",
          email: "",
          phone: "",
          address: "",
          age: "",
          password: "",
          role: "User",
        });
        navigate("/details");
        fetchEntries();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{editData ? "Edit Entry" : "Add Entry"}</h2>
      <div className="form-group">
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <img
          src={image}
          alt="Profile"
          className="image-preview"
          onClick={() => document.getElementById("image").click()}
        />
      </div>
      <div className="horizontal-group">
      <div className="form-field">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength="8"
          title="Password must be at least 8 characters long"
        />
      </div>

      
        <div className="form-field">
          <label htmlFor="role">Role:</label>
          <input type="text" id="role" name="role" value={form.role} readOnly />
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone:</label>
          <input type="text" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        
        <div className="form-field">
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" value={form.age} onChange={handleChange} required />
        </div>
        
        <div className="form-field">
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required />
        </div>
      </div>

      <button type="submit" className="btn-submit">{editData ? "Update" : "Submit"}</button>
    </form>
  );
};


export default FormPage;
