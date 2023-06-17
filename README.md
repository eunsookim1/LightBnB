# LightBnB
This is a database application project from Lighthouse Labs program. 
The front-end is forked from [Lighthouse-labs' LightBnB_Webapp](https://github.com/lighthouse-labs/LightBnB_WebApp).


## Instructions
1. Install LightBnB_WebApp `npm install`
2. Run `npm run local`
3. View the browser at [localhost:3000](localhost:3000)


## ERD Diagram
![ERD Diagram](https://i.imgur.com/IPbSqz9.png)

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.

## Migrations
The folder contains **schema.sql** file which creates database `lightbnb` and switches into the database.

## Seeds
Contains seed data for the tables in the **schema.sql** file. 

## 1_queries
These are some sample queries to run for the `lightbnb` database.


### all_my_reservations.sql
Shows all the reservations for a certain user under the user's id, limits the results to 10.
### average_duration.sql
Selects the average duration of all reservations.

### most_visited_cities.sql
Selects the most visited cities from the database with the name of the city and the number of reservations for the city.

### property_listings_by_city.sql
Shows all the details of the properties located in Vancouver and the average rating for individual property. 
The orders are from cheapest rates to most expensive. 
There will be 10 results as there is a limit of 10 with the rating 4 or higher.

### user_login.sql.sql
Selects id, name, email and password of a given user from the database with the email address 'tristanjacobs@gmail.com'.