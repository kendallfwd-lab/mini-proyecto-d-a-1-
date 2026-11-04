const model = require('../models/productoModel');

module.exports = {
  list: (filters) => model.findAll(filters),
  get: (id) => model.findById(id),
  create: (data) => model.create(data),
  update: (id, data) => model.update(id, data),
  remove: (id) => model.remove(id),
};
