const model = require('../models/compraModel');

module.exports = {
  list: () => model.findAll(),
  get: (id) => model.findById(id),
  create: (data) => model.create(data),
  receive: (id, data) => model.receive(id, data),
};
