const model = require('../models/gastoModel');

module.exports = {
  list: (filters) => model.findAll(filters),
  create: (data) => model.create(data),
  update: (id, data) => model.update(id, data),
  remove: (id) => model.remove(id),
};
