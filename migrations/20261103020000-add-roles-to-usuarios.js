'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'rol', {
      type: Sequelize.ENUM('admin', 'usuario'),
      allowNull: false,
      defaultValue: 'usuario',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'rol');
  },
};
