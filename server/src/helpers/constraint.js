const CONSTRAINT_PREFIX = 'constraint';

exports.getName = (table, column) => `${table}_${column}_${CONSTRAINT_PREFIX}`;

exports.parse = constraint => constraint.slice(-(CONSTRAINT_PREFIX.length + 1));
