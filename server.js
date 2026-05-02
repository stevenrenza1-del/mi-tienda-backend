require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log(err));

// 📦 Modelo de producto
const Producto = mongoose.model("Producto", {
  name: String,
  price: Number
});

// 👉 Obtener productos
app.get("/products", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// 👉 Crear producto
app.post("/products", async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.send("Producto guardado");
});

app.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});

// 👉 ELIMINAR producto
app.delete("/products/:id", async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.send("Producto eliminado");
});