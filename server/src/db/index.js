const pg = require('pg');

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL
});
pg.defaults.ssl = true;

const {createTables, dropTables, errors} = require('./tables/');
const constants = require('./constants');
const test = require('./test-db');

const query = (text, params) => {
	return pool.query(text, params);
};

const connect = async cb => {
	const client = await pool.connect();
	try {
		return await cb(client);
	} catch (e) {
		return Promise.reject(e);
	} finally {
		client.release();
	}
};

module.exports = {
	query,
	connect,
	createTables,
	dropTables,
	constants,
	errors,
	test
};
