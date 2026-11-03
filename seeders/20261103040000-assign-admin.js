'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkUpdate('usuarios', { rol: 'admin' }, { correo: 'ana@example.com' });
  },
  async down(queryInterface) {
    await queryInterface.bulkUpdate('usuarios', { rol: 'usuario' }, { correo: 'ana@example.com' });
  },
};
