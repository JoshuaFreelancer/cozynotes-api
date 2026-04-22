module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // I don't want duplicate tags cluttering the database
      },
    },
    {
      tableName: "tags",
      timestamps: false, // Tags don't really need createdAt/updatedAt for this use case
    },
  );

  Tag.associate = (models) => {
    // The other side of the Many-to-Many relationship
    Tag.belongsToMany(models.Note, {
      through: "note_tags",
      foreignKey: "tagId",
      as: "notes",
    });
  };

  return Tag;
};
