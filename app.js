//  Mise à disposition des modules de fonctionnement de l'API

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Mise à disposition des modules de sécurité (Helmet, rate-limiter)

const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

// Mise à disposition des fichiers Router

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Initialisation des variables d'environnement

require("dotenv").config();

// Connexion de la Base de données MongoDB Atlas

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_USER_PWD}@${process.env.MONGO_CLUSTER}.j3xkx.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Initialisation du module Express

const app = express();

// Initialisation de lecture des fichiers Json

app.use(express.json());

// Initialisation des headers de requêtes

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

// Initialisation du limiteur de requêtes à 100 sur 1h

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1h
  message: "Too many request from this IP"
});

// Initialisation d'Helmet (Sécurisation des headers)

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// Mise à disposition du chemin vers le répertoire image

app.use("/images", express.static(path.join(__dirname, "images")));

// Initialisation des Routes

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
