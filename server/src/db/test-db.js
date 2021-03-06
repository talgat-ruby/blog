const {TABLES} = require('./constants');

module.exports = async client => {
	try {
		const userInsert = (await client.query(`
			INSERT INTO ${TABLES.USERS} (username, email, password)
			VALUES ('admWE2', 'admin@email.com', 'HelloWorld@2')
			RETURNING *;
		`)).rows;
		const postInsert = (await client.query(`
			INSERT INTO ${TABLES.POSTS} (user_id, title, preview, content)
			SELECT * FROM (
				VALUES ('${userInsert[0].id}', 'HELLO', 'NEED THIS', 'CONTENT')
			) AS data (user_id, title, preview, content)
			WHERE EXISTS (
				SELECT * 
        FROM ${TABLES.USERS}
        WHERE id = 'test user'
      )
			RETURNING *;
		`)).rows;
		// const userSelect = client.query(`
		// 	SELECT * FROM ${TABLES.USERS};
		// `);
		// const postSelect = client.query(`
		// 	SELECT * FROM ${TABLES.POSTS}
		// `);
		// const postInsert2 = await client.query(`
		// 	INSERT INTO ${TABLES.USERS} (username, email, password)
		// 	VALUES ('admWE2', 'wer@email.com', 'HelloWorld@2')
		// 	RETURNING id, username, email;
		// `);
		console.log('\x1b[33m userInsert -> \x1b[0m', userInsert);
		console.log('\x1b[33m postInsert -> \x1b[0m', postInsert);
		// console.log('\x1b[33m userSelect -> \x1b[0m', await userSelect);
		// console.log('\x1b[33m postSelect -> \x1b[0m', await postSelect);
	} catch (e) {
		console.log(
			'\x1b[33m Object.assign({}, e) -> \x1b[0m',
			Object.assign({}, e)
		);
		return Promise.reject(e);
	}
};
