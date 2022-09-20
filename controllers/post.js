const path = require("path");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponses");
const Post = require("../models/post");

const getAllPost = asyncHandler(async (req, res, next) => {
  const post = await Post.find().populate({
    path: "user",
    select: "email",
  });
  res.status(200).json({
    success: true,
    count: post.length,
    data: post,
  });
});

const createPost = asyncHandler(async (req, res, next) => {
  const post = new Post(req.body);
  const newpost = await post.save();
  res.status(200).json({
    success: true,
    data: newpost,
  });
});

const getOnePost = asyncHandler(async (req, res, next) => {
  const ispostExist = await Post.findById(req.params.id);
  if (!ispostExist)
    next(new ErrorResponse(`post with id ${req.params.id} not exist`, 404));
  else {
    const post = await Post.find({ _id: req.params.id });
    res.status(200).json({
      success: true,
      data: post,
    });
  }
});
const deleteOnePost = asyncHandler(async (req, res, next) => {
  const ispostExist = await Post.findById(req.params.id);
  if (!ispostExist)
    next(new ErrorResponse(`post with id ${req.params.id} not exist`, 404));
  else {
    const post = await Post.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
    });
  }
});
const updatePost = asyncHandler(async (req, res, next) => {
  const ispostExist = await Post.findById(req.params.id);
  if (!ispostExist)
    next(new ErrorResponse(`post with id ${req.params.id} not exist`, 404));
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    data: post,
  });
});

const photoUpload = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`post not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${post._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Post.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

module.exports = {
  photoUpload,
  getAllPost,
  createPost,
  getOnePost,
  deleteOnePost,
  updatePost,
};
