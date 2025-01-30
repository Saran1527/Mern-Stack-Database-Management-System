const express = require("express");
const multer = require("multer");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = 5000;
  


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const db = new sqlite3.Database("data2.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite database", err.message);
  } else {
    console.log("Connected to SQLite database");

    db.run(
      `CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        age INTEGER NOT NULL,
        image TEXT
       
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`
    );


    db.get("SELECT * FROM admin WHERE email = ?", ["admin@example.com"], (err, row) => {
      if (err) {
        console.error("Database error:", err.message);
      } else if (!row) {

        db.run(
          "INSERT INTO admin (email, password) VALUES (?, ?)",
          ["admin@example.com", "admin123"], 
          (err) => {
            if (err) {
              console.error("Error inserting default admin:", err.message);
            } else {
              console.log("Default admin created");
            }
          }
        );
      }
    });
    
 
    app.post("/api/admin-login", (req, res) => {
      const { email, password } = req.body;
    
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }
    
      db.get("SELECT * FROM admin WHERE email = ?", [email], (err, row) => {
        if (err) {
          return res.status(500).json({ error: "Database error." });
        }
    
        if (!row) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
    
     
        if (password === row.password) {
          res.json({ message: "Login successful", user: row });
        } else {
          return res.status(401).json({ error: "Invalid email or password." });
        }
      });
    });
  }
  
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
  

    db.get("SELECT * FROM entries WHERE email = ?", [email], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error." });
      }
  
      if (!row) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
  
     
      if (bcrypt.compareSync(password, row.password)) {
   
        res.json({ message: "Login successful", user: row });
      } else {
      
        return res.status(401).json({ error: "Invalid email or password." });
      }
    });
  });



  app.post("/api/entries", upload.single("image"), (req, res) => {
    const { name, email, password, role, phone, address, age } = req.body;
  
    if (!name || !email || !password || !role || !phone || !address || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    const hashedPassword = bcrypt.hashSync(password, 10); 
  
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";
  
    const query =
      "INSERT INTO entries (name, email, password, role, phone, address, age, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  
    db.run(query, [name, email, hashedPassword, role, phone, address, age, image], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json("Entry added successfully");
    });
  });
  

  


app.get("/api/entries", (req, res) => {
    db.all("SELECT * FROM entries", [], (err, rows) => {
   if (err) {
       res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
     }
    });
   });
  
 
  

   app.put("/api/entries/:id", upload.single("image"), (req, res) => {
    const id = req.params.id; 
    const { name, email, phone, address, age, password, role } = req.body;
     const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required to identify the entry." });
    }
  
    let query = `
      UPDATE entries
      SET name = ?,phone = ?, address = ?, age = ?, password = ?, role = ?
      ${image ? ", image = ?" : ""}
      WHERE id = ?
    `;
  
    let params = image
      ? [name, phone, address, age, password, role, image, id]
      : [name, phone, address, age, password, role, id];
  
    db.run(query, params, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "No entry found with the provided ID." });
      }
      res.json({ message: "Entry updated successfully", id });
    });
  });
  
  
  app.delete("/api/entries", (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
  
    const query = "DELETE FROM entries WHERE name = ?";
    db.run(query, [name], function (err) {
      if (err) {
        console.error("Error deleting entry:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        console.log("Entry deleted successfully");
        res.json({ message: "Entry deleted successfully" });
      }
    });
  });

app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
});
