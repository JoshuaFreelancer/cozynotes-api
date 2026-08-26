"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userId = "d290f1ee-6c54-4b01-90e6-d701748f0851";
    const now = new Date();

    await queryInterface.bulkDelete("note_tags", null, {});
    await queryInterface.bulkDelete(
      "notes",
      {
        id: [
          "11111111-1111-4111-8111-111111111111",
          "22222222-2222-4222-8222-222222222222",
          "33333333-3333-4333-8333-333333333333",
          "44444444-4444-4444-8444-444444444444",
          "55555555-5555-4555-8555-555555555555",
          "66666666-6666-4666-8666-666666666666",
          "77777777-7777-4777-8777-777777777777",
          "88888888-8888-4888-8888-888888888888",
        ],
      },
      {},
    );

    const doc = (...paragraphs) => ({
      type: "doc",
      content: paragraphs.map((paragraph) => ({
        type: "paragraph",
        content: [{ type: "text", text: paragraph }],
      })),
    });

    const taskDoc = (tasks) => ({
      type: "doc",
      content: [
        {
          type: "taskList",
          content: tasks.map((task) => ({
            type: "taskItem",
            attrs: { checked: task.done },
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: task.text }],
              },
            ],
          })),
        },
      ],
    });

    return queryInterface.bulkInsert("notes", [
      {
        id: "11111111-1111-4111-8111-111111111111",
        title: "Project roadmap",
        content: JSON.stringify(
          doc(
            "Finish the backend audit, keep the frontend filters in sync, and leave the demo notes ready for a fresh seed run.",
            "Focus on stable previews, clean tags, and predictable sample data.",
          ),
        ),
        type: "TEXT",
        colorTheme: "sky",
        isPinned: true,
        userId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "22222222-2222-4222-8222-222222222222",
        title: "Sprint checklist",
        content: JSON.stringify(
          taskDoc([
            { text: "Review current notes after seeding", done: true },
            { text: "Validate the journal preview", done: false },
            { text: "Check the trash and tag flows", done: false },
            { text: "Run the frontend build one last time", done: false },
          ]),
        ),
        type: "TODO",
        colorTheme: "mint",
        isPinned: false,
        userId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "33333333-3333-4333-8333-333333333333",
        title: "Daily journal",
        content: JSON.stringify(
          doc(
            "Date: 2026-04-22",
            "Mood: Productive",
            "The app now feels coherent: the notes render naturally, filters reset correctly, and the demo content matches the editor.",
          ),
        ),
        type: "JOURNAL",
        colorTheme: "lavender",
        isPinned: false,
        userId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "44444444-4444-4444-8444-444444444444",
        title: "Anatomy reference",
        content: JSON.stringify(
          doc(
            "The heart is a muscular organ that pumps blood through the circulatory system.",
            "Use it as a compact study note with a clean preview and a more visual card.",
          ),
        ),
        type: "MEDIA",
        colorTheme: "peach",
        isPinned: false,
        userId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "55555555-5555-4555-8555-555555555555",
        title: "Meeting notes",
        content: JSON.stringify(
          doc(
            "Keep the checklist short, avoid duplicate tags, and preserve the demo feel across the app.",
            "Open questions: do we want archive first or trash first in the sidebar?",
          ),
        ),
        type: "TEXT",
        colorTheme: "cream",
        isPinned: false,
        userId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "66666666-6666-4666-8666-666666666666",
        title: "Weekend reset",
        content: JSON.stringify(
          doc(
            "Date: 2026-04-20",
            "Mood: Calm",
            "Spent the afternoon refactoring note previews and tightening the seed data shape.",
          ),
        ),
        type: "JOURNAL",
        colorTheme: "sky",
        isPinned: false,
        userId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "77777777-7777-4777-8777-777777777777",
        title: "Workout plan",
        content: JSON.stringify(
          taskDoc([
            { text: "10 minutes of mobility", done: true },
            { text: "3 sets of squats", done: false },
            { text: "Drink water before lunch", done: false },
          ]),
        ),
        type: "TODO",
        colorTheme: "yellow",
        isPinned: false,
        userId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "88888888-8888-4888-8888-888888888888",
        title: "Recipe draft",
        content: JSON.stringify(
          doc(
            "Lemon pasta with garlic, herbs, and olive oil.",
            "Keep this note as a simple media-style reference with a short readable preview.",
          ),
        ),
        type: "MEDIA",
        colorTheme: "mint",
        isPinned: false,
        userId,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("note_tags", null, {});
    return queryInterface.bulkDelete("notes", null, {});
  },
};
