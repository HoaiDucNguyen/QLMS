const express = require("express");
const cors = require("cors");
const bookRouter = require("./app/routes/book.route");
const nxbRouter = require("./app/routes/nxb.route");
const nhanVienRouter = require("./app/routes/nhanvien.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the library management application."
  });
});

app.use("/api/books", bookRouter);
app.use("/api/nhaxuatban", nxbRouter);
app.use("/api/nhanvien", nhanVienRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;