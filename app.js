const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require('path');

require('dotenv').config()

console.log(process.env)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_USER_PWD}@${process.env.MONGO_CLUSTER}.j3xkx.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
{ useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * signifie : depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Autorise les méthodes de communication GET/POST/PUT...
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes)

module.exports = app;
