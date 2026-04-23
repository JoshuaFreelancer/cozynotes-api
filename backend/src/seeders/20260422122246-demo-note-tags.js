'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkDelete('note_tags', null, {});

    return queryInterface.bulkInsert('note_tags', [
      { noteId: '11111111-1111-4111-8111-111111111111', tagId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', createdAt: now, updatedAt: now },
      { noteId: '11111111-1111-4111-8111-111111111111', tagId: '34343434-3434-4434-8434-343434343434', createdAt: now, updatedAt: now },
      { noteId: '22222222-2222-4222-8222-222222222222', tagId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', createdAt: now, updatedAt: now },
      { noteId: '22222222-2222-4222-8222-222222222222', tagId: '34343434-3434-4434-8434-343434343434', createdAt: now, updatedAt: now },
      { noteId: '33333333-3333-4333-8333-333333333333', tagId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', createdAt: now, updatedAt: now },
      { noteId: '44444444-4444-4444-8444-444444444444', tagId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', createdAt: now, updatedAt: now },
      { noteId: '44444444-4444-4444-8444-444444444444', tagId: '12121212-1212-4212-8212-121212121212', createdAt: now, updatedAt: now },
      { noteId: '55555555-5555-4555-8555-555555555555', tagId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', createdAt: now, updatedAt: now },
      { noteId: '66666666-6666-4666-8666-666666666666', tagId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', createdAt: now, updatedAt: now },
      { noteId: '66666666-6666-4666-8666-666666666666', tagId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', createdAt: now, updatedAt: now },
      { noteId: '77777777-7777-4777-8777-777777777777', tagId: 'ffffffff-ffff-4fff-8fff-ffffffffffff', createdAt: now, updatedAt: now },
      { noteId: '88888888-8888-4888-8888-888888888888', tagId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', createdAt: now, updatedAt: now },
      { noteId: '88888888-8888-4888-8888-888888888888', tagId: '12121212-1212-4212-8212-121212121212', createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('note_tags', null, {});
  },
};