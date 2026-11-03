const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Las asociaciones se agregarán aquí cuando existan otros modelos.
    }
  }

  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      altura: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      etnia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
    },
  );

  return Usuario;
};
