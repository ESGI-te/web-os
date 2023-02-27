export const generateUUID = (): string => {
	const hex = "0123456789abcdef";
	let uuid = "";

	for (let i = 0; i < 36; i++) {
		if (i === 8 || i === 13 || i === 18 || i === 23) {
			uuid += "-";
		} else if (i === 14) {
			uuid += "4";
		} else {
			uuid += hex[Math.floor(Math.random() * hex.length)];
		}
	}

	return uuid;
};
