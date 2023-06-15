const mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/LoginSignUp")

  .then(() => {
    console.log("mongodb connected");
  })

  .catch(() => {
    console.log("Failed to connect");
  });

const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Number,
    default: 0,
  },
});

const collection = new mongoose.model("collection1", LogInSchema);

module.exports = collection; // exporting the collection to index.js
