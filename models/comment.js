const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  content: {
    type: String,
    required: [true, "please provide content"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
