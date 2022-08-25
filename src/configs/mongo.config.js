const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/smart_services";

mongoose.connect(url);

const connection = mongoose.connection;
connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

module.exports = {
  connection,
};