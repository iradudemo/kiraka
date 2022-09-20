const mongoose = require("mongoose");

const ViewsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Views", ViewsSchema);
