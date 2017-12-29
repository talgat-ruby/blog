const chalk = require('chalk');
const {testHelpers} = require('>/src/helpers/');
const db = require('>/src/db/');

const table = db.constants.TABLES.USERS;
const clm = db.constants.COLUMNS[table];

let client;
const testUser = {
	[clm.username]: 'test',
	[clm.email]: 'test@test.com',
	[clm.password]: 'Test1@Test'
};
let insertedUser = {};

beforeAll(async () => {
	client = await db.connect();
	try {
		const {rows} = await client.query(`
			INSERT INTO ${table} (${testHelpers.getKeys(testUser)})
			VALUES (${testHelpers.getValues(testUser)})
			RETURNING *;
		`);
		insertedUser = rows[0];
	} catch (e) {
		console.log(`${chalk.red('TEST ERROR, beforeAll')} - ${e}`);
	}
});

afterAll(async () => {
	try {
		await client.query(`
			DELETE FROM ${table} WHERE ${clm.email} = '${testUser[clm.email]}';
		`);
	} catch (e) {
		console.log(`${chalk.red('TEST ERROR, afterAll')} - ${e}`);
	} finally {
		client.release();
	}
});

describe('Test inserted User', () => {
	test('all inserted cells are same', () => {
		expect(testUser[clm.username]).toBe(insertedUser[clm.username]);
		expect(testUser[clm.email]).toBe(insertedUser[clm.email]);
	});
	test('all selected cells are same', async () => {
		await expect(
			client.query(`
				SELECT * FROM ${table} WHERE ${clm.email} = '${testUser[clm.email]}';
			`)
		).resolves.toEqual(expect.objectContaining({rows: [insertedUser]}));
	});
	test('Password. inserted must not be equal(encrypted) from selected', () => {
		expect(testUser[clm.password]).not.toBe(insertedUser[clm.password]);
	});
});

describe('Test new user constraints', () => {
	const testUser2 = {
		[clm.username]: 'test2',
		[clm.email]: 'test2@test.com',
		[clm.password]: 'Test2@Test'
	};

	describe('Test username', () => {
		test('check error for uniqness of username', async () => {
			const user = {...testUser2, [clm.username]: testUser[clm.username]};
			await expect(
				client.query(`
			INSERT INTO ${table} (${testHelpers.getKeys(user)})
			VALUES (${testHelpers.getValues(user)})
			RETURNING *;
		`)
			).rejects.toThrowErrorMatchingSnapshot();
		});
		test("check error if user's username is less than 3 char", async () => {
			const user = {...testUser2, [clm.username]: '2e'};
			await expect(
				client.query(`
			INSERT INTO ${table} (${testHelpers.getKeys(user)})
			VALUES (${testHelpers.getValues(user)})
			RETURNING *;
		`)
			).rejects.toThrowErrorMatchingSnapshot();
		});
	});

	describe('Test email', () => {
		test('check error for uniqness of email', async () => {
			const user = {...testUser2, [clm.email]: testUser[clm.email]};
			await expect(
				client.query(`
					INSERT INTO ${table} (${testHelpers.getKeys(user)})
					VALUES (${testHelpers.getValues(user)})
					RETURNING *;
				`)
			).rejects.toThrowErrorMatchingSnapshot();
		});
	});

	describe('Test password', () => {
		const invalidPasswords = [
			'aBCDe2#',
			'abcdef#2',
			'ABCDEF#2',
			'aBCDeF##',
			'aBCDeF22'
		];
		const validPassword = 'aBCDeF#2';

		test('check error for invalid passwords', async () => {
			for (password of invalidPasswords) {
				const user = {...testUser2, [clm.password]: password};
				await expect(
					client.query(`
					INSERT INTO ${table} (${testHelpers.getKeys(user)})
					VALUES (${testHelpers.getValues(user)})
					RETURNING *;
				`)
				).rejects.toThrowErrorMatchingSnapshot();
			}
		});
		test('check for valid password', async () => {
			const user = {...testUser2, [clm.password]: validPassword};
			await expect(
				client.query(`
					INSERT INTO ${table} (${testHelpers.getKeys(user)})
					VALUES (${testHelpers.getValues(user)})
					RETURNING ${clm.username}, ${clm.email};
				`)
			).resolves.toMatchSnapshot();
			await client.query(`
				DELETE FROM ${table} WHERE ${clm.email} = '${user[clm.email]}';
			`);
		});
	});
});
