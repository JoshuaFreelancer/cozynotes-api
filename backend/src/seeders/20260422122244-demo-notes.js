'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('notes', [
      {
        id: Sequelize.fn('UUID'),
        title: 'Project Roadmap 🚀',
        content: JSON.stringify({ body: 'Finish the Ensolvers challenge by Thursday. Focus on the Bento UI and clean code.' }),
        type: 'TEXT',
        colorTheme: 'sky',
        isPinned: true,
        userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.fn('UUID'),
        title: 'Grocery List 🛒',
        content: JSON.stringify({ 
          tasks: [
            { text: 'Oat milk', done: false },
            { text: 'Avocados', done: true },
            { text: 'Coffee beans', done: false }
          ] 
        }),
        type: 'TODO',
        colorTheme: 'mint',
        isPinned: false,
        userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.fn('UUID'),
        title: 'Daily Journal Entrying 📖',
        content: JSON.stringify({ date: '2026-04-22', mood: 'Productive' }),
        type: 'JOURNAL',
        colorTheme: 'lavender',
        isPinned: false,
        userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.fn('UUID'),
        title: 'Study: Human Heart ❤️',
        content: JSON.stringify({ 
          body: 'The heart is a muscular organ that pumps blood through the blood vessels of the circulatory system.',
          imageUrl: 'https://example.com/heart.png' 
        }),
        type: 'MEDIA',
        colorTheme: 'peach',
        isPinned: false,
        userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('notes', null, {});
  }
};