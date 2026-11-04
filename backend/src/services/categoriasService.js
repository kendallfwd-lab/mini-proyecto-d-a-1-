const model = require('../models/categoriaModel');

module.exports = {
  list: (search) => model.findAll(search),
  get: (id) => model.findById(id),
  create: (data) => model.create(data),
  update: (id, data) => model.update(id, data),
  remove: (id) => model.remove(id),
};
