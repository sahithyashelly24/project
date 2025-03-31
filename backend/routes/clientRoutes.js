const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

router.put("/:id", async (req, res) => {
    try {
      const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new client
router.post("/", async (req, res) => {
  try {
    const { client, issue, status, profilePic } = req.body;
    const newClient = new Client({ client, issue, status, profilePic });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a client
router.delete("/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
