'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proyectos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { allowNull: false, type: Sequelize.STRING },
      descripcion: { allowNull: true, type: Sequelize.TEXT },
      estado: { allowNull: false, type: Sequelize.ENUM('planificado', 'en_progreso', 'finalizado'), defaultValue: 'planificado' },
      usuarioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
    await queryInterface.addIndex('proyectos', ['usuarioId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('proyectos');
  },
};
