const express = require("express");
const cors = require("cors");
const bookRouter = require("./app/routes/sach.route");
const nxbRouter = require("./app/routes/nhaxuatban.route");
const nhanVienRouter = require("./app/routes/nhanvien.route");
const docGiaRouter = require("./app/routes/docgia.route");
const theoDoiMuonSachRouter = require("./app/routes/theodoimuonsach.route");
const authRouter = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the library management application."
  });
});

app.use("/api/sach", bookRouter);
app.use("/api/nhaxuatban", nxbRouter);
app.use("/api/nhanvien", nhanVienRouter);
app.use("/api/docgia", docGiaRouter);
app.use("/api/theodoimuonsach", theoDoiMuonSachRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  if (err.name === 'CORSError') {
    res.status(403).json({
      message: "CORS không được phép"
    });
  } else {
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error"
    });
  }
});

module.exports = app;