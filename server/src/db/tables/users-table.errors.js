const {TABLES, COLUMNS} = require('../constants');

const {username, email, password} = COLUMNS[TABLES.USERS];

module.exports = {
	[username]:
		'Invalid username. Username must be not empty and include at least 3 characters.',
	[email]: 'Invalid email, please check.',
	[password]:
		'Invalid password. Password must be at least 8 characters and include: 1 lower case letter, 1 upper case letter, 1 number and 1 symbol $!@_ %#~^*$&()?-+='
};
