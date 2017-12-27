const pg = require('pg');

const {createTables, dropTables, errors} = require('./tables/');

const connect = () => {
	const pool = new pg.Pool({
		connectionString: process.env.DATABASE_URL
	});
	pg.defaults.ssl = true;
	return pool.connect();
};

module.exports = {connect, createTables, dropTables, errors};
