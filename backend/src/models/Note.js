// src/models/Note.js
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Note",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      // New field to define the dynamic Bento size/layout based on note type or pinned status.
      // The frontend will use this to determine the card's column/row spanning.
      type: {
        type: DataTypes.STRING, // Examples for the frontend: 'TEXT', 'TODO', 'JOURNAL', 'MEDIA'
        defaultValue: "TEXT",
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isPinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Storing UI preferences as simple strings.
      colorTheme: {
        type: DataTypes.STRING,
        defaultValue: "cream",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "notes",
      timestamps: true,
      // This enables soft deletes for the Trash feature
      paranoid: true,
    },
  );

  Note.associate = (models) => {
    Note.belongsTo(models.User, { foreignKey: "userId", as: "author" });

    Note.belongsToMany(models.Tag, {
      through: "note_tags",
      foreignKey: "noteId",
      as: "tags",
    });
  };

  return Note;
};
