const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
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
const getUserWithEmail = function(email) {
  return pool.query(`
    SELECT * 
    FROM users
    WHERE email = $1
  `, [email])
    .then(res => res.rows[0]);
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = (id) => {
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1
  `, [id])
    .then(res => res.rows[0]);
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = (user) => {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3) RETURNING *
  `, [user.name, user.email, user.password]).
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
// const getAllReservations1 = function(guest_id, limit = 10) {
//   return getAllProperties(null, 5);
// };

const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`
  SELECT 
    reservations.*, 
    properties.*, 
    avg(property_reviews.rating) AS average_rating
  FROM reservations
    JOIN properties ON property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
    AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date 
  LIMIT $2;
  `, [guest_id, limit])
    .then(res => {
      console.log(res.rows);
      return res.rows;
    });
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

const getAllProperties1 = (options, limit = 10) => {
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

const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];

  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${filter(queryParams)} city LIKE $${queryParams.length} `;
  }

  // cost
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${filter(queryParams)} cost_per_night >= $${queryParams.length} * 100 `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${filter(queryParams)} cost_per_night <= $${queryParams.length} * 100 `;
  }

  // 4
  
  queryString += `
  GROUP BY properties.id
  `;

  // minimum rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }
  
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res)=> res.rows);
};

// A helper function to help filter the texts to add my AND and WHERE
const filter = (queryParams) => {
  let queryString = '';
  if (queryParams.length === 1) {
    queryString += 'WHERE';
  } else {
    queryString += 'AND';
  }
  return queryString;
};
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = (property) => {
  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms,
    active
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;`;

  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    true
    // why is it like this?
  ];
  
  return pool.query(queryString, queryParams)
    .then((res) => {
      console.log(res.rows[0]);
      return res.rows[0];
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};


// SELECT properties.*, avg(property_reviews.rating) as average_rating
//   FROM properties
//   JOIN property_reviews ON properties.id = property_id
//   GROUP BY properties.id
//   HAVING  avg(property_reviews.rating) >= 1
//   ORDER BY cost_per_night
//   LIMIT 20;