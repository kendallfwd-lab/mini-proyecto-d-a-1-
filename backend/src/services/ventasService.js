const model = require('../models/ventaModel');

module.exports = {
  list: () => model.findAll(),
  create: (data) => model.create(data),
};
