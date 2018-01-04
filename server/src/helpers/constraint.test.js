const constraint = require('./constraint');

test('check constraint name', () => {
	const table = 'table';
	const column = 'column';
	expect(constraint.getName({table, column})).toBe(
		`${table}_${column}_${constraint.CONSTRAINT_PREFIX}`
	);
});

test('parse constraint name', () => {
	const table = 'table';
	const column = 'column';
	const constraintName = constraint.getName({table, column});
	const parsedObj = {table, column};

	expect(constraint.parse(constraintName)).toEqual(parsedObj);
});

test('parse complex constraint name', () => {
	const table = 'table';
	const column = 'column_hello';
	const constraintName = constraint.getName({table, column});
	const parsedObj = {table, column};

	expect(constraint.parse(constraintName)).toEqual(parsedObj);
});

test('parse wrong format', () => {
	const testStrs = ['hello_world', `needThis_${constraint.CONSTRAINT_PREFIX}`];

	for (testStr of testStrs) {
		expect(constraint.parse(testStr)).toBe(null);
	}
});
