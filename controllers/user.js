const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Création d'un utilisateur

exports.signup = (req, res, next) => {

  // Hash du mot de passe via bcrypt

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Vérification via une regex de la forme de l'input entrée par l'utilisateur dans le champ email

      if (!/^[\w\d.+-]+@[\w.-]+\.[a-z]{2,}$/.test(req.body.email)) {
        return res.status(400).json({ message: "email invalide" });
      }

      // Enregistrement des données utilisateurs en Base de données

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Login d'un utilisateur

exports.login = (req, res, next) => {

  // Vérification de l'input entré par l'utilisateur dans le champ email

  if (!/^[\w\d.+-]+@[\w.-]+\.[a-z]{2,}$/.test(req.body.email)) {
    return res.status(400).json({ message: "email invalide" });
  }

  // Recherche de l'email dans la Base de données

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }

      // Comparaison des Hash pour le mot de passe utilisateur

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
