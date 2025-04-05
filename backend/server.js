
require("dotenv").config(); // Load environment v

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb"); // Use ObjectId from MongoDB

const app = express();
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debugging: Log MONGO_URI
console.log("MONGO_URI:", process.env.MONGO_URI);

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MONGO_URI is missing. Please check the .env file.");
  process.exit(1);
}

const DEFAULT_PROFILE_PIC = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; 

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// MongoDB Client Connection
const client = new MongoClient(mongoURI, { useUnifiedTopology: true });

client.connect()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const db = client.db(); // Access the default database
const collection = db.collection("clients"); // Access the "clients" collection

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add new client with default profile pic

app.post("/api/clients", async (req, res) => {
  try {
    const newClient = {
      client: "client name",
      issue: "what is the issue",
      status: "Upcoming",
      locked: false,
      profilePic: DEFAULT_PROFILE_PIC, // Use default online image
    };

    // Insert the new client
    const result = await collection.insertOne(newClient);
    
    // The `insertedId` field contains the ID of the newly inserted document
    const insertedClient = { ...newClient, _id: result.insertedId };

    res.json(insertedClient); // Send the new client with the inserted ID
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all clients
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await collection.find().toArray();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get client by ID
app.get("/api/clients/:id", async (req, res) => {
  try {
    const clientId = req.params.id;

    console.log("Client ID from request:", clientId);

    if (!ObjectId.isValid(clientId)) {
      console.log("Invalid MongoDB ObjectId");
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const client = await collection.findOne({ _id: new ObjectId(clientId) });

    if (!client) {
      console.log("Client not found in database");
      return res.status(404).json({ message: "Client not found" });
    }

    console.log("Client found:", client);
    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Update profile picture
app.post("/api/clients/upload/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const { id } = req.params;
    const profilePic = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : DEFAULT_PROFILE_PIC; // Use default if no file uploaded

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { profilePic } }
    );
    
    if (result.modifiedCount > 0) {
      res.json({ message: "Profile picture updated successfully", profilePic });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update client details (PATCH or PUT)
app.put("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.modifiedCount > 0) {
      res.json({ message: "Client updated successfully", updatedData });
    } else {
      res.status(404).json({ error: "Client not found or no changes made" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a client
app.delete("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save session data (audio analysis) for a client
app.post("/api/clients/:id/session", async (req, res) => {
  try {
    const { id } = req.params;
    const sessionData = req.body; // Should contain { transcript, emotions, prediction, timestamp }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          sessionHistory: sessionData,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.json({ message: "Session added successfully" });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
