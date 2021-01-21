const mongoose = require("mongoose");
const CONFIG = require("../configs/config");

mongoose
  .connect(CONFIG.DB_URL, CONFIG.DB_OPTIONS)
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch((err) => {
    console.log("An error while connecting to the database", err);
    process.exit();
  });
