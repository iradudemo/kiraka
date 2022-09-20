const express = require("express");
const { getViews, addView } = require("../controllers/views");
const { protected } = require("../middlewares/auth");

const routes = express.Router();
routes.use(protected);

routes.route("/:postId").get(getViews).post(addView);

module.exports = routes;
//fly.io
