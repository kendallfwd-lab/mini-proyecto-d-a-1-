const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Proyecto extends Model {
    static associate(models) {
      Proyecto.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'propietario' });
    }
  }

  Proyecto.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [2, 150] } },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('planificado', 'en_progreso', 'finalizado'), allowNull: false, defaultValue: 'planificado' },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
  }, { sequelize, modelName: 'Proyecto', tableName: 'proyectos', timestamps: true });

  return Proyecto;
};
