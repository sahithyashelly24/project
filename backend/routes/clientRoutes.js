const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();

const mongoURI = process.env.MONGO_URI; // Assuming you've set this in your .env file
const client = new MongoClient(mongoURI, { useUnifiedTopology: true });
const db = client.db();
const collection = db.collection("clients");

client.connect()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Update client details
router.put("/:id", async (req, res) => {
  try {
    const clientId = req.params.id;
    const updatedData = req.body;

    if (!ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(clientId) },
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

// Get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await collection.find().toArray();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new client
router.post("/", async (req, res) => {
  try {
    const { client, issue, status, profilePic } = req.body;
    const newClient = {
      client: client || "client name",
      issue: issue || "what is the issue",
      status: status || "Upcoming",
      locked: false,
      profilePic: profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", // default profile picture
    };

    const result = await collection.insertOne(newClient);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a client
router.delete("/:id", async (req, res) => {
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

module.exports = router;
