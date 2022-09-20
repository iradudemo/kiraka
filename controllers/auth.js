const ErrorResponse = require("../utils/errorResponses");
const asyncHandler = require("../middlewares/async");
const User = require("../models/user");

// @desc    Register User
// @route   POST /api/auth/register
// @access   public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, sector } = req.body;
  // create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    sector,
  });
  // create TOKEN
  sendTokenResponse(user, 200, res);
});

// @desc    User Login
// @route   POST /api/auth/login
// @access   public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from models and create cookies and response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// @desc      Update user details
// @route     PUT /api/auth/updatedetails
// @access    Private
// exports.updateDetails = asyncHandler(async (req, res, next) => {
//   const fieldsToUpdate = {
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     email: req.body.email,
//   };

//   const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     success: true,
//     data: user,
//   });
// });

// @desc      Update password
// @route     PUT /api/auth/updatepassword
// @access    Private
// exports.updatePassword = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");

//   // Check current password
//   if (!(await user.matchPassword(req.body.currentPassword))) {
//     return next(new ErrorResponse("Password is incorrect", 401));
//   }

//   user.password = req.body.newPassword;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });
