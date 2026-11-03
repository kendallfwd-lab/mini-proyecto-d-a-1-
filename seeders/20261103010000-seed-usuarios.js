'use strict';

const bcrypt = require('bcryptjs');

const usuarios = [
  { nombre: 'Valentina', apellido1: 'Nunez', apellido2: 'Vega', altura: 1.64, etnia: 'Mestiza', correo: 'valentina.nunez@example.com' },
  { nombre: 'Jorge', apellido1: 'Herrera', apellido2: 'Mora', altura: 1.79, etnia: 'Mestizo', correo: 'jorge.herrera@example.com' },
  { nombre: 'Elena', apellido1: 'Vargas', apellido2: 'Leon', altura: 1.59, etnia: 'Mestiza', correo: 'elena.vargas@example.com' },
  { nombre: 'Andres', apellido1: 'Quesada', apellido2: 'Soto', altura: 1.83, etnia: 'Mestizo', correo: 'andres.quesada@example.com' },
  { nombre: 'Gabriela', apellido1: 'Rojas', apellido2: 'Campos', altura: 1.71, etnia: 'Mestiza', correo: 'gabriela.rojas@example.com' },
];

module.exports = {
  async up(queryInterface) {
    const correos = usuarios.map((usuario) => usuario.correo);
    const [existentes] = await queryInterface.sequelize.query(
      'SELECT correo FROM usuarios WHERE correo IN (:correos)',
      { replacements: { correos } },
    );
    const existentesSet = new Set(existentes.map((usuario) => usuario.correo));
    const contrasena = await bcrypt.hash('secreto123', 12);
    const ahora = new Date();
    const nuevos = usuarios
      .filter((usuario) => !existentesSet.has(usuario.correo))
      .map((usuario) => ({ ...usuario, contrasena, createdAt: ahora, updatedAt: ahora }));

    if (nuevos.length > 0) {
      await queryInterface.bulkInsert('usuarios', nuevos);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', {
      correo: usuarios.map((usuario) => usuario.correo),
    });
  },
};
