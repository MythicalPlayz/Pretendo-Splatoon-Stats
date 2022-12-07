const { Router } = require('express');
const router = new Router();
const fetcher = require("../fetcher")
const {forceloadsplatfests,usenintendo} = require('../../config.json');

router.get('/', async (request, response) => {
	//Checks the config to see if to use Nintendo or Pretendo
	fetcher.UseNintendoRotation(usenintendo.toLowerCase() === "true")

	//Gets Locale of user
	firstlocale = "en-GB"
	try {
		firstlocale = request.acceptsLanguages()[0]
	} catch (c) {}

	//Get Splatfest info
	const splatfestinfoarray = await fetcher.GetSplatfestData()
	if (splatfestinfoarray === null) { response.send('Could not get Splatfest Info'); return}
	const timestart = new Date(splatfestinfoarray[1][3] * 1000)
	const timestartformat = `${timestart.toLocaleDateString(firstlocale)} ${(timestart.getHours() >= 10) ? timestart.getHours() : "0" + timestart.getHours()}:${(timestart.getMinutes() >= 10) ? timestart.getMinutes() : "0" + timestart.getMinutes()}`
	const timeend = new Date(splatfestinfoarray[1][1] * 1000)
	const timeendformat = `${timeend.toLocaleDateString(firstlocale)} ${(timeend.getHours() >= 10) ? timeend.getHours() : "0" + timeend.getHours()}:${(timeend.getMinutes() >= 10) ? timeend.getMinutes() : "0" + timeend.getMinutes()}`

	avaliable = false
	Sstatus = ""
	const currentTime =  Date.parse(new Date()) / 1000
	if (currentTime < splatfestinfoarray[1][3] || forceloadsplatfests.toLowerCase() === "true"){
		avaliable = true
		if (forceloadsplatfests.toLowerCase() === "true") {
			Sstatus = "FORCE_LOADED"
		}
		else if (currentTime >= splatfestinfoarray[1][1]) {
			Sstatus = "Live!"
		}
		else if (currentTime >= splatfestinfoarray[1][0]) {
			Sstatus = "Inkoming!"
		}
		else {
			avaliable = false
		}
	}

    const splatfest = {
		theme: `${splatfestinfoarray[0][0]} vs ${splatfestinfoarray[0][1]}`,
		timeOfFest: `${timestartformat} - ${timeendformat}`,
		stages: splatfestinfoarray[2],
		gamemode: splatfestinfoarray[3],
		avaliable: avaliable,
		Sstatus: Sstatus
	}
    
	//Get current Rotation as well as the next one if available
	const rotationsarray = await fetcher.GetMapRotations()
	if (rotationsarray === null) { response.send('Could not get Stage Rotation'); return}
	const currentrotationarray = rotationsarray[0]
	hasNext = (rotationsarray.length === 2)
	const currentrotation = {
		normalStages: currentrotationarray[0],
		normalIDs: currentrotationarray[1],
		rankedmode: currentrotationarray[2],
		rankedStages: currentrotationarray[3],
		rankedIDs: currentrotationarray[4]
	}
	nextrotation = {avaliable: false}
	if (hasNext) {
		const nextrotationarray = rotationsarray[1]
		nextrotation = {
			normalStages: nextrotationarray[0],
			normalIDs: nextrotationarray[1],
			rankedmode: nextrotationarray[2],
			rankedStages: nextrotationarray[3],
			rankedIDs: nextrotationarray[4],
			avaliable: true
		}
	}

	const data = {splatfest,currentrotation,nextrotation}
    response.render('home',data);
});

module.exports = router;