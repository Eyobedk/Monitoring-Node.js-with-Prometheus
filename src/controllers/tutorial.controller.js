const {databaseResponseTimeHistogram} = require('../loaders/loggers/metrics')
const db = require("../loaders/database");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  const metricsNames = {
    operation: "createTutorial",
  };

    // Validate request
  if (!req.body.title || !req.body.description || !req.body.published) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  const timer = databaseResponseTimeHistogram.startTimer();

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
        timer({ ...metricsNames, success: "true" });
        res.send(data);
    })
    .catch(err => {
      timer({ ...metricsNames, success: "false" });

      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });

    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const metricsNames = {
    operation: "getAllTutorials",
  };

    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const timer = databaseResponseTimeHistogram.startTimer();

    Tutorial.findAll({ where: condition })
      .then(data => {

        timer({ ...metricsNames, success: "true" });

        res.send(data);
      })
      .catch(err => {
        timer({ ...metricsNames, success: "false" });
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });


      });
  
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const metricsNames = {
    operation: "findOne",
  };
  const id = req.params.id;

  const timer = databaseResponseTimeHistogram.startTimer();

  Tutorial.findByPk(id)
    .then(data => {
      if (data) {
        timer({ ...metricsNames, success: "true" });

        res.send(data);
      } else {
        timer({ ...metricsNames, success: "false" });

        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const metricsNames = {
    operation: "update",
  };
  const id = req.params.id;

  const timer = databaseResponseTimeHistogram.startTimer();

  Tutorial.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        timer({ ...metricsNames, success: "true" });

        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        timer({ ...metricsNames, success: "false" });

        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const metricsNames = {
      operation: "delete",
    };
  const id = req.params.id;

  const timer = databaseResponseTimeHistogram.startTimer();

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        timer({ ...metricsNames, success: "true" });

        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        timer({ ...metricsNames, success: "false" });

        res.send({
          message: `Cannot delete Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      timer({ ...metricsNames, success: "false" });

      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  const metricsNames = {
    operation: "deleteAll",
  };
  const timer = databaseResponseTimeHistogram.startTimer();

  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      timer({ ...metricsNames, success: "true" });

      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      timer({ ...metricsNames, success: "false" });

      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  const metricsNames = {
    operation: "findAllPublished",
  };
  const timer = databaseResponseTimeHistogram.startTimer();

  Tutorial.findAll({ where: { published: true } })
    .then(data => {
      timer({ ...metricsNames, success: "true" });

      res.send(data);
    })
    .catch(err => {
      timer({ ...metricsNames, success: "false" });

      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
