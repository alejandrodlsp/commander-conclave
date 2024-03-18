const db = require("../models")
const Tutorial = db.User
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if(!req.body.username) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }

    const tutorial = {
        username: req.body.username,
        email: req.body.email
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
    const title = req.query.username
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
    const id = req.params.id
    Tutorial.findByPk(id)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorial with id: " + id })
        })
}

exports.update = (req, res) => {
    const id = req.params.id
    Tutorial.update(req.body, {
        where: { id }
    })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Tutorial was updated successfully" })
            } else {
                res.status(400).send({ message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!` })
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error updating tutorial with id: " + id })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Tutorial.destroy({
        where: { id }
    })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Tutorial deleted successfully" })
            } else {
                res.status(400).send({ message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!` })
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error deleting tutorial with id: " + id })
        })
}

exports.deleteAll = (req, res) => {
    Tutorial.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Tutorials were deleted successfully!` })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while removing all tutorials." });
        })
}

exports.findAllPublished = (req, res) => {
    Tutorial.findAll({ where: { email: "asd@asd.com" }})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorials." })
        })
}