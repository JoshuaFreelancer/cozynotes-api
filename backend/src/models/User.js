module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // I want to make sure no invalid emails slip into my DB
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    },
  );

  // I'll set up associations here if the user ever needs to own specific notes
  User.associate = (models) => {
    // A single user (the admin) will own all notes for this specific test
    User.hasMany(models.Note, { foreignKey: "userId", as: "notes" });
  };

  return User;
};
