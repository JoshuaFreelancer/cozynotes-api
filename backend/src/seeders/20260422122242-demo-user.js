'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // I'm creating a main admin user so the app is ready to use right away
    return queryInterface.bulkInsert('users', [{
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', // Fixed UUID for referencing in notes
      email: 'admin@ensolvers.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};