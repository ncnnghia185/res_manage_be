const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("dotenv").config();

const swaggerDocument = YAML.load("./swaggerApis.yaml");
const initWebroute = require("./route");
const { connectDb } = require("./config/dbConfig");
const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
connectDb();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 9999;
// app.use(
//   cors({
//     origin: "http://127.0.0.1:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
initWebroute(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
