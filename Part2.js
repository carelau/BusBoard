const fetch = require('node-fetch');
const readline = require ("readline-sync");
//const stopCode = "490008660N";

// fetch (`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals`)
//     .then (function(response){
//         return response.json();
//     })
//     .then (getSingleBus);

//     function getSingleBus(json){
//         const sortedArray = json.sort(function(busA, busB){
//         return busA.timeToStation - busB.timeToStation;
//         });
//         let nextFiveBuses = sortedArray.slice(0, 5);
//         for (const bus of nextFiveBuses) {
//             console.log(`Bus ${bus.lineId} to ${bus.destinationName} will be arriving in ${Math.floor(bus.timeToStation/60)} minutes!`);
//             }
//         }

    const postcode = "SW151PQ";
    fetch (`http://api.postcodes.io/postcodes/${postcode}`)    
    .then (function (response){
        return response.json();
    })
    .then (getStopPoint);
    

    function getStopPoint(json){
    const latitude = json.result.latitude;
    const longitude =json.result.longitude;
 // https://api.tfl.gov.uk/StopPoint/?lat=51.461697&lon=-0.217683&stopTypes=NaptanPublicBusCoachTram&modes=bus
    fetch (`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&modes=bus`)
    .then (function(response){
        return response.json();
    })
    .then (twoNearestBusStops)
}

function twoNearestBusStops(json){
    const stopPointsArray = json.stopPoints;
    const sortedArray = stopPointsArray.sort(function(busA, busB){
    return busA.distance- busB.distance;});
    const busStopCode1 = (sortedArray[0].id);
    const busStopCode2 = (sortedArray[1].id);
    let twoBusStopCodearray =[busStopCode1,busStopCode2];
    for (const stopCode of twoBusStopCodearray) {
    fetch (`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals`) 
    .then (function(response){
        return response.json();
        })
    .then (printBusInfo);
    }

    
    function printBusInfo(json){
    const sortedArray = json.sort(function(busA, busB){
    return busA.timeToStation - busB.timeToStation;
    });
    let nextFiveBuses = sortedArray.slice(0, 5);
    for (const bus of nextFiveBuses) {
    console.log(`Bus ${bus.lineId} to ${bus.destinationName} will be arriving in ${Math.floor(bus.timeToStation/60)} minutes!`);
        }
    }
}
