const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  client: { type: String, required: true },
  issue: { type: String, required: true },
  status: { type: String, default: "Upcoming" },
  locked: { type: Boolean, default: false },
  profilePic: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }
});

module.exports = mongoose.model("Client", clientSchema);
