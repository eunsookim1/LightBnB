const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb_webapp'
});

// the following assumes that you named your connection variable `pool`
pool.query(`SELECT title FROM properties LIMIT 10;`);
// .then(response => {console.log(response)});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithEmail1 = function (email) {
//   let resolvedUser = null;
//   for (const userId in users) {
//     const user = users[userId];
//     if (user?.email.toLowerCase() === email?.toLowerCase()) {
//       resolvedUser = user;
//     }
//   }
//   return Promise.resolve(resolvedUser);
// };

// const getUserWithEmail = (email) => {
//   return pool
//     .query(`SELECT * FROM users WHERE email = $1`, [email])
//     .then(result => {
//       result.rows[0];
//       console.log(result.rows[0]);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const getUserWithEmail = function(email) {
  return pool.query(`
    SELECT * 
    FROM users
    WHERE email = $1
  `, [email.toLowerCase()])
    .then(res => {
      res.rows[0];
      console.log(res.rows[0]);
    });
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId1 = function(id) {
  return Promise.resolve(users[id]);
};

const getUserWithId = (id) => {
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1
  `, [id])
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser1 = function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
};

const addUser = (user) => {
  return pool.query(`
  INSERT INTO users(name, email, password)
  VALUES ($1, $2, $3) RETURNING *`, [user.username, user.email, user.password]).
    then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    });
};
/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties1 = function (options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };

// const getAllProperties2 = (options, limit = 10) => {
// const queryString = `
//       SELECT *
//       FROM properties
//       LIMIT ${process.argv[2]} || 5;
//       `;
//   pool
//     .query(queryString, [limit])
//     .then((result) => {
//       console.log(result.rows);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const getAllProperties = (options, limit = 10) => { // what does options represent?
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
