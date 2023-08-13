const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

//llamado de las rutas
const pacientes_rutes = require("./router/pacientes.routes");

const app = express();

<<<<<<< HEAD
//estoy intentando hacer un pull a github
=======
>>>>>>> 09949975e8b1c2a6c735987c3fb7dd8c346efea3
app.use(express.json());

//rutas
app.use("/api", pacientes_rutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/tienda")
  .then(() => console.log("database conectado"));
