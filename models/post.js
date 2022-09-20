const { Schema, default: mongoose } = require("mongoose");

const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: true,
  },
  content: {
    type: String,
    required: [true, "please provide content"],
  },
  // image:{
  //     type: String,
  //     required: [true,'please provide image']
  // },
  status: {
    type: Boolean,
    default: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
