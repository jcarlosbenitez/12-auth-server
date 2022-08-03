const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/config");
require("dotenv").config();

//crear el servidor/aplicacion de express
const app = express();

//Base de datos

dbConnection();

//Diretorio Publico
app.use(express.static("public"));

//CORS
app.use(cors());

//Lecctura y árseo del body

app.use(express.json());

//Rutas
app.use("/api/auth", require("./routes/auth"));

//get

// app.get("/", (req, res) => {
//   res.json({
//     on: true,
//     msg: "Todo salio bien",
//     uid: 123,
//   });
//   console.log("Peticion en el slach");
// });

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${4000}`);
});
