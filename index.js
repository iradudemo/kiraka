const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const swaggerDocs = require("./public/api-docs/swagger");
const errorHandler = require("./middlewares/error");
const { Console } = require("console");

require("dotenv").config();

const app = express();
swaggerDocs(app, process.env.PORT);

app.use(express.json());

app.use(fileUpload());

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));
app.use("/user", require("./routes/user"));
app.use("/comment", require("./routes/comment"));
app.use("/announcement", require("./routes/announcement"));
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI);
console.log("DB has been connected");

app.listen(process.env.PORT || 3500, () => {
  console.log(`Server running at :${process.env.PORT}`);
});
