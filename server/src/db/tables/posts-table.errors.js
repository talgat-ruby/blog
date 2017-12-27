const {TABLES, COLUMNS} = require('../constants');

const {preview} = COLUMNS[TABLES.POSTS];

module.exports = {
	[preview]: 'Preview must not be empty and less than 150 characters'
};
