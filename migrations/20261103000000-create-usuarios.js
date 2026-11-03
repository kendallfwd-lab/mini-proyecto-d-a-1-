'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      apellido1: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      apellido2: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      altura: {
        allowNull: false,
        type: Sequelize.DECIMAL(5, 2),
      },
      etnia: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      correo: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      contrasena: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  },
};
