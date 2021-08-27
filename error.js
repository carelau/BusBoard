const fetch = require('node-fetch');
const readline = require("readline-sync");
console.log("Please enter your postcode:");
const postcode = readline.prompt();

//const postcode = "SW151PQ";
fetch(`http://api.postcodes.io/postcodes/${postcode}`)
    .then(function (response) {
        return response.json();
    })
    .then(getStopPoint);

function printBusInfo(json) {
    const sortedArray = json.sort(function (busA, busB) {
        return busA.timeToStation - busB.timeToStation;
    });
    let nextFiveBuses = sortedArray.slice(0, 5);
    for (const bus of nextFiveBuses) {
        console.log(`Bus ${bus.lineId} to ${bus.destinationName} will be arriving in ${Math.floor(bus.timeToStation / 60)} minutes!`);
    }
}

async function printAllBusesForStops(stopPointIDs) {
    for (let i = 0; i < stopPointIDs.length; i++) {
        console.log(`The next 5 buses due at ${stopPointIDs[i]} is : `);
        const buses = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopPointIDs[i]}/Arrivals`)
            .then(function (response) {
                return response.json();
            })
        printBusInfo(buses);
    }

}

function getStopPoint(json) {
    const latitude = json.result.latitude;
    const longitude = json.result.longitude;
    //const radius = 1;
    // https://api.tfl.gov.uk/StopPoint/?lat=51.461697&lon=-0.217683&stopTypes=NaptanPublicBusCoachTram&modes=bus
    //"NaptanPublicBusCoachTram"
    // for postcode SW151PQ, "longitude": -0.217683,"latitude": 51.461697
    fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&modes=bus`)
   // fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}&modes=bus`)
        .then(function (response) {
            return response.json();
        })
        .then(twoNearestBusStops)
}

function twoNearestBusStops(json) {
    const stopPointsArray = json.stopPoints;
    const sortedArray = stopPointsArray.sort(function (busA, busB) {
        return busA.distance - busB.distance;
    });
    for (let i = 0; i < sortedArray.length; i++) {
        console.log(sortedArray[i].distance);
    }
    const busStopCode1 = (sortedArray[0].id);
    const busStopCode2 = (sortedArray[1].id);
    let twoBusStopCodeArray = [busStopCode1, busStopCode2];
    console.log(twoBusStopCodeArray);

    printAllBusesForStops(twoBusStopCodeArray);

}

   // for (let i = 0; i < 2; i++) {
        //     console.log(`The next 5 buses due at ${twoBusStopCodeArray[i]} is : `);
        //     fetch(`https://api.tfl.gov.uk/StopPoint/${twoBusStopCodeArray[i]}/Arrivals`)
        //         .then(function (response) {
        //             return response.json();
        //         })
        //         .then(printBusInfo);
        // }

        // fetch(`https://api.tfl.gov.uk/StopPoint/${busStopCode1}/Arrivals`)
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(printBusInfo);