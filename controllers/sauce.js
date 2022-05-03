const fs = require("fs");
const Sauce = require("../models/Sauce");
const { db } = require("../models/Sauce");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Item saved !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      res.status(404).json({
        error: new Error("No such Sauce!"),
      });
    }
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Deleted!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    });
  });
};

exports.modifySauce = (req, res, next) => {
  if (!req.file) {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce modified !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      if (!sauce) {
        res.status(404).json({
          error: new Error("No such Sauce!"),
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        console.log("image deleted")
      });
    });

    const sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "sauce modified" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.like = async (req, res, next) => {
  try {
    const sauce = await Sauce.findById(req.params.id);

    let userId = req.body.userId;
    let like = req.body.like;
    let usersLiked = sauce.usersLiked;
    let usersDisliked = sauce.usersDisliked;

    switch (like) {
      case 1:
        if ((usersLiked === usersLiked.includes(userId))) {
          return usersLiked;
        } else {
          usersLiked.addToSet(userId);
        }
        usersDisliked = usersDisliked.filter((el) => el !== req.userId);
        break;
      case -1:
        if ((usersDisliked === usersDisliked.includes(userId))) {
          return usersDisliked;
        } else {
          usersDisliked.addToSet(userId);
        }
        usersLiked = usersLiked.filter((el) => el !== userId);
        break;
      case 0:
        usersLiked = usersLiked.filter((el) => el !== userId);
        usersDisliked = usersDisliked.filter((el) => el !== userId);
        break;
      default:
        throw res.status(418).json({ err });
    }

    const likes = usersLiked.length;
    const dislikes = usersDisliked.length;

    await sauce.updateOne({
      usersLiked: usersLiked,
      usersDisliked: usersDisliked,
      likes: usersLiked.length,
      dislikes: usersDisliked.length,
    });

    res.status(200).send({ message: "item liked or disliked" });
  } catch (err) {
    res.status(400).json({ err });
    console.log(err)
  }
};
