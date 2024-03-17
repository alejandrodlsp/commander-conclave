const db = require("../models")
const Tutorial = db.tutorials
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if(!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    }

    Tutorial.create(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the Tutorial."});
        });
}

exports.findAll = (req, res) => {
    const title = req.query.title
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null
  
    Tutorial.findAll({ where: condition })
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorials." })
      });
}

exports.findOne = (req, res) => {

}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {

}

exports.deleteAll = (req, res) => {

}

exports.findAllPublished = (req, res) => {

}