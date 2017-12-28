exports.getKeys = data => Object.keys(data).join(', ');
exports.getValues = data =>
	Object.values(data)
		.map(value => `'${value}'`)
		.join(', ');
