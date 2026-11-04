const model = require('../models/facturaModel');

module.exports = {
  list: () => model.findAll(),
  get: (id) => model.findById(id),
};
