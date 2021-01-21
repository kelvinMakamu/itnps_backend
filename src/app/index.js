const express    = require("express");
const bodyParser = require("body-parser");
const morgan     = require("morgan");
const helmet     = require("helmet");
const path       = require("path");
const cors       = require("cors");
const CONFIG     = require("../configs/config");
const CONNECT    = require("../models/connect");
const router     = require("../routes/app.routes");

const middlewares = [
  helmet(),
  morgan(CONFIG.DEFAULT_MORGAN_FORMAT),
  bodyParser.json(),
  cors(CONFIG.CORS_OPTIONS),
  bodyParser.urlencoded({ extended: true }),
];

const app = express();

app.use(middlewares);

app.use(CONFIG.API_VERSION, router);

app.listen(CONFIG.SERVER_PORT, () => {
  console.log(`The server started on port ${CONFIG.SERVER_PORT}`);
});