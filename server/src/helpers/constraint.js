const CONSTRAINT_PREFIX = 'constraint';
exports.CONSTRAINT_PREFIX = CONSTRAINT_PREFIX;

exports.getName = ({table, column}) =>
	`${table}_${column}_${CONSTRAINT_PREFIX}`;

exports.parse = constraint => {
	const prefixIndex = constraint.indexOf(CONSTRAINT_PREFIX);
	const isPrefixLast =
		constraint.length - CONSTRAINT_PREFIX.length === prefixIndex;

	const infoPart = constraint.slice(0, prefixIndex - 1);
	const undescoreIndex = infoPart.indexOf('_');
	if (isPrefixLast && undescoreIndex > -1) {
		return {
			table: infoPart.slice(0, undescoreIndex),
			column: infoPart.slice(undescoreIndex + 1)
		};
	} else {
		return null;
	}
};
