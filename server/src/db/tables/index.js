const {TABLES} = require('../constants');

const tables = {
	[TABLES.USERS]: require('./users-table')
};

const createTables = async client => {
	try {
		await Promise.all(
			Object.values(tables).map(({createTable}) => createTable(client))
		);
	} catch (e) {
		return Promise.reject(e);
	}
};

const dropTables = async client => {
	try {
		await Promise.all(
			Object.values(tables).map(({dropTable}) => dropTable(client))
		);
	} catch (e) {
		return Promise.reject(e);
	}
};

module.exports = {createTables, dropTables};
