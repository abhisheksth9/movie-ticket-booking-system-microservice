require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT || 3306,
        dialect:  'mysql',
        logging:  false,
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_TEST,
        host:     process.env.DB_HOST,
        dialect:  'mysql',
        logging:  false,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_PROD,
        host:     process.env.DB_HOST,
        dialect:  'mysql',
        logging:  false,
    }
};

require("dotenv").config();

console.log({
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS ? "loaded" : "missing",
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST
});
