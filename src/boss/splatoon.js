module.exports = {
    getSplatfestMapRoation,
    getSplatfestTime,
    getSplatfestTeam,
}

function getSplatfestMapRoation(content){
    Stages = content.value.Stages.value
    StageNames = []
    for (i = 0; i < 3;i++) {
        StageNames.push(mapidToMapName(Stages[i].value.MapID.value))
    }
    
    return StageNames
}

function getSplatfestTime(content){
    STime = content.value.Time.value
    UnixTime = []
    Types = ["Announce","End","Result","Start"]
    for (i = 0; i < 4;i++) {
        UnixTime.push(getUnixTime(STime[Types[i]].value))
    }
    return UnixTime
}
function getSplatfestTeam(content){
    Teams = content.value.Teams.value
    TeamAlpha = Teams[0].value.ShortName.value.USen.value
    TeamBravo = Teams[1].value.ShortName.value.USen.value
    return [TeamAlpha,TeamBravo]
}

function mapidToMapName(ID){
    MapName = ""
    switch (ID){
        case 0:
            MapName = "Urchin Underpass"
            break
        case 1:
            MapName = "Walleye Warehouse"
            break     
        case 2:
            MapName = "Saltspray Rig"
            break   
        case 3:
            MapName = "Arowana Mall"
            break
        case 4:
            MapName = "Blackbelly Skatepark"
            break
        case 5:
            MapName = "Camp Triggerfish"
            break
        case 6:
            MapName = "Port Mackerel"
            break   
        case 7:
            MapName = "Kelp Dome"
            break
        case 8:
            MapName = "Moray Towers"
            break
        case 9:
            MapName = "Bluefin Depot"
            break
        case 10:
            MapName = "Hammerhead Bridge"
            break   
        case 11:
            MapName = "Flounder Heights"
            break
        case 12:
            MapName = "Museum d'Alfonsino"
            break
        case 13:
            MapName = "Ancho-V Games"
            break
        case 14:
            MapName = "Piranha Pit"
            break   
        case 15:
            MapName = "Mahi-Mahi Resort"
            break
        default:
            MapName = "Unknown Map"
            break
    }
    return MapName
}

function getUnixTime(inputTime){
    return Date.parse(inputTime) / 1000
}

function gachiToRankedName(gachiRule){
    switch (gachiRule){
        case "cVar":
            return "Splat Zones"
        case "cVlf":
            return "Tower Control"
        case "cVgl":
            return "Rainmaker"
        default:
            return "Unknown Mode"
    }
}