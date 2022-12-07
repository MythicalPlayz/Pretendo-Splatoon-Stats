module.exports = {
    getSplatfestMapRoation,
    getSplatfestTime,
    getSplatfestTeam,
    getSplatfestMode,
    getCurrentRotation,
}

function getSplatfestMapRoation(content){
    const Stages = content.value.Stages.value
    let StageNames = []
    for (i = 0; i < 3;i++) {
        StageNames.push(mapidToMapName(Stages[i].value.MapID.value))
    }
    return StageNames
}

function getSplatfestTime(content){
    const STime = content.value.Time.value
    let UnixTime = []
    const Types = ["Announce","End","Result","Start"]
    for (i = 0; i < 4;i++) {
        UnixTime.push(getUnixTime(STime[Types[i]].value))
    }
    return UnixTime
}
function getSplatfestTeam(content){
    const Teams = content.value.Teams.value
    const TeamAlpha = Teams[0].value.ShortName.value.USen.value
    const TeamBravo = Teams[1].value.ShortName.value.USen.value
    return [TeamAlpha,TeamBravo]
}

function mapidToMapName(ID){
    let MapName = ""
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
        case "cPnt":
            return "Turf War"
        default:
            return "Unknown Mode"
    }
}

function getSplatfestMode(content){
    return gachiToRankedName(content.value.Rule.value)
}

function getDateOfFirstRotaion(content){
    return Date.parse(content.value.DateTime.value) / 1000
}

function getRotations(content){
    return content.value.Phases.value
}

function CalculateWhichRotation(filedate){
    const currentTime =  Date.parse(new Date()) / 1000
    let differnce = currentTime - filedate

    if (differnce < 0){
        differnce = Math.abs(differnce) //TODO Make a better handler
    }
    const maxRotation = 4 * 180 * 3600
    let rotationNumber = 0
    if (differnce >= maxRotation){
        rotationNumber = 179
        return rotationNumber
    }
    let count = 0
    while(count <= (differnce - 3600 * 4) && 3600 * 4 <= differnce){ //TODO Better System than this
        count += 3600 * 4
        rotationNumber++
    }
    return rotationNumber
}

function getCurrentRotation(content){
  const number = CalculateWhichRotation(getDateOfFirstRotaion(content))
  let Rotations = getRotationInfoAtIndex(content,number)
  let ReturnedRotation = []
  ReturnedRotation.push(Rotations)
  if (number < 179){
    ReturnedRotation.push(getRotationInfoAtIndex(content,number + 1))
  }
  return ReturnedRotation
}

function getRotationInfoAtIndex(content,index){
    const Rotations = getRotations(content)
    const RequiredRotation = Rotations[index].value

    let ReturnedRotation = []
    let NormalMaps = []
    NormalMaps.push(mapidToMapName(RequiredRotation.RegularStages.value[0].value.MapID.value))
    NormalMaps.push(mapidToMapName(RequiredRotation.RegularStages.value[1].value.MapID.value))
    ReturnedRotation.push(NormalMaps)
    let NormalMapsID = []
    NormalMapsID.push(RequiredRotation.RegularStages.value[0].value.MapID.value)
    NormalMapsID.push(RequiredRotation.RegularStages.value[1].value.MapID.value)
    ReturnedRotation.push(NormalMapsID)


    let RankedMode = gachiToRankedName(RequiredRotation.GachiRule.value)
    ReturnedRotation.push(RankedMode)
    let RankedMaps = []
    RankedMaps.push(mapidToMapName(RequiredRotation.GachiStages.value[0].value.MapID.value))
    RankedMaps.push(mapidToMapName(RequiredRotation.GachiStages.value[1].value.MapID.value))
    ReturnedRotation.push(RankedMaps)
    let RankedMapsID = []
    RankedMapsID.push(RequiredRotation.GachiStages.value[0].value.MapID.value)
    RankedMapsID.push(RequiredRotation.GachiStages.value[1].value.MapID.value)
    ReturnedRotation.push(RankedMapsID)

    return ReturnedRotation
}