const { Router } = require('express');
const router = new Router();
const fetcher = require("../fetcher")


router.get('/', async (request, response) => {
	const firstlocale = request.acceptsLanguages()[0]
	const info = await fetcher.GetSplatfestData()
	const timestart = new Date(info[1][1] * 1000)
	const timestartformat = `${timestart.toLocaleDateString(firstlocale)} ${(timestart.getHours() >= 10) ? timestart.getHours() : "0" + timestart.getHours()}:${(timestart.getMinutes() >= 10) ? timestart.getMinutes() : "0" + timestart.getMinutes()}`
	const timeend = new Date(info[1][3] * 1000)
	const timeendformat = `${timeend.toLocaleDateString(firstlocale)} ${(timeend.getHours() >= 10) ? timeend.getHours() : "0" + timeend.getHours()}:${(timeend.getMinutes() >= 10) ? timeend.getMinutes() : "0" + timeend.getMinutes()}`
    const splatfest = {
		theme: `${info[0][0]} vs ${info[0][1]}`,
		timeOfFest: `${timestartformat} - ${timeendformat}`,
		stages: info[2]
	}
    
	const data = {splatfest}
    response.render('home',data);
});

module.exports = router;