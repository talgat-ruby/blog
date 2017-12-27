const CONSTRAINT_PREFIX = 'constraint';

module.exports = (table, column) => `${table}_${column}_${CONSTRAINT_PREFIX}`;
