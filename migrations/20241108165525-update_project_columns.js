'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('projects', 'nodeJS', 'node_js');
    await queryInterface.renameColumn('projects', 'nextJs', 'next_js');
    await queryInterface.renameColumn('projects', 'reactJs', 'react_js');
    await queryInterface.renameColumn('projects', 'imageUrl', 'image_url');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('projects', 'node_js', 'nodeJS');
    await queryInterface.renameColumn('projects', 'next_js', 'nextJs');
    await queryInterface.renameColumn('projects', 'react_js', 'reactJs');
    await queryInterface.renameColumn('projects', 'image_url', 'imageUrl');
  }
};
