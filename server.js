require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔗 MongoDB desde .env
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));

// 📦 Modelo
const ProductoSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

const Producto = mongoose.model("Producto", ProductoSchema);

// 📥 Obtener productos
app.get("/products", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// ➕ Agregar
app.post("/products", async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// ✏️ Editar
app.put("/products/:id", async (req, res) => {
  const producto = await Producto.findById(req.params.id);

  if (!producto) {
    return res.status(404).json({ error: "No encontrado" });
  }

  producto.name = req.body.name;
  producto.price = req.body.price;

  if (req.body.image) {
    producto.image = req.body.image;
  }

  await producto.save();
  res.json(producto);
});

// ❌ Eliminar
app.delete("/products/:id", async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Eliminado" });
});

// 🌐 Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
