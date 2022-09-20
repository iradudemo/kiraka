const express = require("express");
const { protected, authorize } = require("../middlewares/auth");

const {
  getAllAnnouncement,
  createAnnouncement,
  getOneAnnouncement,
  deleteOneAnnouncement,
  updateAnnouncement,
} = require("../controllers/announcement");

const routes = express.Router();
routes.use(protected);

routes
  .route("/:_id")
  .get(getOneAnnouncement)
  .delete(authorize("admin"), deleteOneAnnouncement)
  .patch(authorize("admin"), updateAnnouncement);
routes
  .route("/")
  .get(getAllAnnouncement)
  .post(authorize("admin"), createAnnouncement);

module.exports = routes;
