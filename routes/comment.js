const express = require("express");
const { protected, authorize } = require("../middlewares/auth");

const app = express();

const {
  getAllComment,
  createComment,
  getOneComment,
  deleteOneComment,
  updateComment,
} = require("../controllers/comment");

const routes = express.Router();

routes
  .route("/:_id")
  .get(protected, getOneComment)
  .delete(protected, authorize("admin"), deleteOneComment)
  .patch(protected, updateComment);
routes.route("/").get(protected, getAllComment).post(protected, createComment);

module.exports = routes;
