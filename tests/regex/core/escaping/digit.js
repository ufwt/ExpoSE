var x = symbolic X initial '';

if (/^\d$/.test(x)) {

	if (!/^[0-9]$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (/^\D$/.test(x)) {

	if (/^[0-9]$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}