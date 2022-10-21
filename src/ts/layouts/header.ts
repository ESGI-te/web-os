const $DATE_TIME = document.getElementById("app_header_dateTime");

function init() {
	setDateTime();
}

function setDateTime() {
	if ($DATE_TIME) {
		$DATE_TIME.textContent = getDateTime();
		setInterval(() => ($DATE_TIME.textContent = getDateTime()), 60000);
	}
}

function getDateTime() {
	const today = new Date();
	const date = today.getDate() + "/" + (today.getMonth() + 1);
	const time = today.getHours() + ":" + today.getMinutes();

	return date + " " + time;
}

export { init };
