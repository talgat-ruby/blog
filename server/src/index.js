const modulesProduction = {};
const modulesDevelopment = {};

require('dotenv').config();

// libs
const Koa = require('koa');
const Route = require('koa-router');
const koaGraphQL = require('koa-graphql');
if (process.env.NODE_ENV === 'production') {
	// Set up nginx
	modulesProduction.cors = require('kcors');
	modulesProduction.serve = require('koa-static');
	modulesProduction.send = require('koa-send');
}

// constants
const {PORT, CLIENT_PATH} = require('./constants/app-constants');

// methods, functions, utilities;
const db = require('./db/');
const schema = require('./graphql/');

const app = new Koa();
const router = new Route();

(async () => {
	return db.connect(async client => {
		try {
			await db.dropTables(client);
			await db.createTables(client);
			await db.test(client);

			router.all(
				'/graphql',
				koaGraphQL(
					request =>
						process.env.NODE_ENV === 'production'
							? {
									schema,
									context: {request, db}
								}
							: {
									schema,
									graphiql: true,
									context: {request, db}
								}
				)
			);
		} catch (e) {
			return Promise.reject(e);
		}
	});
})().catch(e => console.log(e.stack));

app.use(router.routes()).use(router.allowedMethods());

if (process.env.NODE_ENV === 'production') {
	app.use(modulesProduction.cors());
	app.use(modulesProduction.serve(CLIENT_PATH));
	app.use(async ctx => {
		await modulesProduction.send(ctx, './index.html', {root: CLIENT_PATH});
	});
}

app.listen(process.env.PORT || PORT);
