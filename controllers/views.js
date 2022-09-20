const asyncHandler = require("../middlewares/async");
const Post = require("../models/post");
const Views = require("../models/Views");

// @desc      Get views
// @route     GET /api/views

// @access    Public
exports.getViews = asyncHandler(async (req, res, next) => {
  if (req.params.postId) {
    const views = await Views.find({ post: req.params.postId });

    return res.status(200).json({
      success: true,
      count: views.length,
      data: views,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.addView = asyncHandler(async (req, res, next) => {
  req.body.post = req.params.postId;
  const user = await Views.findById(req.body.user);
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.postId}`, 404)
    );
  }
  if (user) {
    return next(new ErrorResponse("already viewed"));
  }
  const view = await Views.create(req.body);
  console.log(user);
  res.status(201).json({
    success: true,
    data: view,
  });
});
