'use strict';

const proyectos = [
  { nombre: 'Remodelación de vivienda', descripcion: 'Mejoras estructurales y acabados.', estado: 'en_progreso' },
  { nombre: 'Construcción de oficina', descripcion: 'Diseño y construcción de espacio de trabajo.', estado: 'planificado' },
];

module.exports = {
  async up(queryInterface) {
    const [usuarios] = await queryInterface.sequelize.query("SELECT id FROM usuarios WHERE correo = 'ana@example.com' LIMIT 1");
    if (!usuarios.length) return;
    const [existentes] = await queryInterface.sequelize.query(
      'SELECT nombre FROM proyectos WHERE nombre IN (:nombres)',
      { replacements: { nombres: proyectos.map((proyecto) => proyecto.nombre) } },
    );
    const nombres = new Set(existentes.map((proyecto) => proyecto.nombre));
    const ahora = new Date();
    const nuevos = proyectos.filter((proyecto) => !nombres.has(proyecto.nombre)).map((proyecto) => ({ ...proyecto, usuarioId: usuarios[0].id, createdAt: ahora, updatedAt: ahora }));
    if (nuevos.length) await queryInterface.bulkInsert('proyectos', nuevos);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('proyectos', { nombre: proyectos.map((proyecto) => proyecto.nombre) });
  },
};
