const { Router } = require('express');
const router = new Router();
const fetcher = require("../fetcher")
const {forceloadsplatfests} = require('../../config.json');

router.get('/', async (request, response) => {
	const firstlocale = request.acceptsLanguages()[0]
	const info = await fetcher.GetSplatfestData()
	const timestart = new Date(info[1][1] * 1000)
	const timestartformat = `${timestart.toLocaleDateString(firstlocale)} ${(timestart.getHours() >= 10) ? timestart.getHours() : "0" + timestart.getHours()}:${(timestart.getMinutes() >= 10) ? timestart.getMinutes() : "0" + timestart.getMinutes()}`
	const timeend = new Date(info[1][3] * 1000)
	const timeendformat = `${timeend.toLocaleDateString(firstlocale)} ${(timeend.getHours() >= 10) ? timeend.getHours() : "0" + timeend.getHours()}:${(timeend.getMinutes() >= 10) ? timeend.getMinutes() : "0" + timeend.getMinutes()}`

	avaliable = false
	Sstatus = ""
	const currentTime =  Date.parse(new Date()) / 1000
	if (currentTime < info[1][3] || forceloadsplatfests){
		avaliable = true
		if (forceloadsplatfests) {
			Sstatus = "FORCE_LOADED"
		}
		else if (currentTime >= info[1][1]) {
			Sstatus = "Live!"
		}
		else if (currentTime >= info[1][0]) {
			Sstatus = "Inkoming!"
		}
		else {
			avaliable = false
		}
	}

    const splatfest = {
		theme: `${info[0][0]} vs ${info[0][1]}`,
		timeOfFest: `${timestartformat} - ${timeendformat}`,
		stages: info[2],
		gamemode: info[3],
		avaliable: avaliable,
		Sstatus: Sstatus
	}
    
	const rotationsarray = await fetcher.GetMapRotations()
	const currentrotationarray = rotationsarray[0]
	hasNext = (rotationsarray.length === 2)
	const currentrotation = {
		normalStages: currentrotationarray[0],
		normalIDs: currentrotationarray[1],
		rankedmode: currentrotationarray[2],
		rankedStages: currentrotationarray[3],
		rankedIDs: currentrotationarray[4]
	}

	nextrotation = {}

	const data = {splatfest,currentrotation}
    response.render('home',data);
});

module.exports = router;