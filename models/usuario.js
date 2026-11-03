const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    async compararContrasena(contrasena) {
      return bcrypt.compare(contrasena, this.contrasena);
    }

    static associate(models) {
      Usuario.hasMany(models.Proyecto, { foreignKey: 'usuarioId', as: 'proyectos' });
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
        validate: { notEmpty: true, len: [2, 100] },
      },
      apellido1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 100] },
      },
      apellido2: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 100] },
      },
      altura: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: { isDecimal: true, min: 0.3, max: 3 },
      },
      etnia: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 100] },
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          len: [5, 255],
        },
      },
      contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [8, 255] },
      },
      rol: {
        type: DataTypes.ENUM('admin', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario',
      },
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
      hooks: {
        async beforeCreate(usuario) {
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, 12);
        },
        async beforeUpdate(usuario) {
          if (usuario.changed('contrasena')) {
            usuario.contrasena = await bcrypt.hash(usuario.contrasena, 12);
          }
        },
      },
    },
  );

  return Usuario;
};
