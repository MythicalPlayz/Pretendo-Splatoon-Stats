const fetch = require("node-fetch")
const spoon = require('./boss/splatoon')
const byaml = require('./boss/byaml')
const boss = require('boss-js')
const { BOSS_AES_KEY, BOSS_HMAC_KEY } = require('../config.json');
async function httpGetAsync(theUrl,parase)
{
    
    const response = await fetch(theUrl);
    if (response.status === 200){
        if (parase){
            const body = await response.text();
            return GrabFileUrlFromXML(body)
        }
        return response.arrayBuffer()
    }
    return null
}

async function GetSplatfestData(){
   files = await httpGetAsync("https://npts.app.pretendo.cc/p01/tasksheet/1/rjVlM7hUXPxmYQJh/optdat2?c=CA&l=en",true)
   maininfofile = await httpGetAsync(files[0])
   mainfobymal = boss.decrypt(Buffer.from(maininfofile),BOSS_AES_KEY,BOSS_HMAC_KEY)
   mainfilearray = new byaml(mainfobymal.content).root
   //TODO Get the Splatfest Cover
   return [spoon.getSplatfestTeam(mainfilearray),spoon.getSplatfestTime(mainfilearray),spoon.getSplatfestMapRoation(mainfilearray),spoon.getSplatfestMode(mainfilearray)]
}

async function GetMapRotations(){
    file = await httpGetAsync("https://npts.app.pretendo.cc/p01/tasksheet/1/rjVlM7hUXPxmYQJh/schdat2?c=CA&l=en",true)
    maininfofile = await httpGetAsync(file)
    mainfobymal = boss.decrypt(Buffer.from(maininfofile),BOSS_AES_KEY,BOSS_HMAC_KEY)
    mainfilearray = new byaml(mainfobymal.content).root
    return spoon.getCurrentRotation(mainfilearray)
}

function GrabFileUrlFromXML(content){
    files = content.split("<Files>")
    files = files[1].split("</Files>")[0]
    if (files.split("<File>").length > 2){
        //Mutiple Files
        filesurl = []
        for (i = 1;i < files.split("<File>").length;i++){
            file = files.split("<File>")[i]
            file = file.split("</File>")[0]
            fileurl = file.split("<Url>")[1].split("</Url>")[0]
            filesurl.push(fileurl)
        }
        return filesurl
    }
    else {
        //Single File
        file = files.split("<File>")[1]
        file = file.split("</File>")[0]
        fileurl = file.split("<Url>")[1].split("</Url>")[0]
        return fileurl
    }
    
}

module.exports = {
    GetSplatfestData,
    GetMapRotations
}