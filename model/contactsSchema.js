const mongoose = require("mongoose");

const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_no: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  },
});

const contacts = new mongoose.model("contacts", contactsSchema);
module.exports = contacts;
