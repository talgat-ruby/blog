const chalk = require('chalk');

const NUM_OF_CALLS = 2;

function* testInitGenerator() {
	let i = 0;
	let bool = true;
	while (i < NUM_OF_CALLS) {
		yield i++;
		console.log(chalk.blue(i));
	}
}

const testInit = testInitGenerator();
module.exports = testInit;
