require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    // Keeping the console clean so I can actually read my logs
    logging: false 
  },
  test: {
    // Might configure a test db here later if needed
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
  },
  production: {
    // Standard production setup using a connection URL
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};