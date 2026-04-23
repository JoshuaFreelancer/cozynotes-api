'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('note_tags', null, {});
    await queryInterface.bulkDelete('tags', {
      id: [
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        'ffffffff-ffff-4fff-8fff-ffffffffffff',
        '12121212-1212-4212-8212-121212121212',
        '34343434-3434-4434-8434-343434343434',
      ],
    }, {});

    return queryInterface.bulkInsert('tags', [
      { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'work' },
      { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', name: 'personal' },
      { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', name: 'journal' },
      { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', name: 'todo' },
      { id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', name: 'study' },
      { id: 'ffffffff-ffff-4fff-8fff-ffffffffffff', name: 'health' },
      { id: '12121212-1212-4212-8212-121212121212', name: 'reference' },
      { id: '34343434-3434-4434-8434-343434343434', name: 'planning' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('note_tags', null, {});
    return queryInterface.bulkDelete('tags', null, {});
  },
};