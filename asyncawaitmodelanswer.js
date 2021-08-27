
const fetch = require('node-fetch');

function sortStopPointsByDistance(stopPoints) {
    return stopPoints.sort(function(stopPointA, stopPointB) {
        return stopPointA.distance - stopPointB.distance;
    });
}

function sortBusesByTimeToStation(buses) {
    return buses.sort(function(busA, busB) {
        return busA.timeToStation - busB.timeToStation;
    });
}

async function loadBuses() {
    const postcode = "SE83FJ";
    const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const postcodeInformation = await postcodeResponse.json();
    
    const lat = postcodeInformation.result.latitude;
    const lon = postcodeInformation.result.longitude;

    const stopTypes = "NaptanPublicBusCoachTram";
    const radius = 1000;

    const stopSearchResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}`);
    const stopSearchResult = await stopSearchResponse.json();
    
    const sortedStops = sortStopPointsByDistance(stopSearchResult.stopPoints);

    const closestStopIds = sortedStops.slice(0, 2).map(stopPoint => stopPoint.naptanId);

    const buses = [];
    for (const stopPointId of closestStopIds) {
        const nextBusesResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopPointId}/Arrivals`);
        const nextBuses = await nextBusesResponse.json();

        for (const bus of nextBuses) {
            buses.push(bus);
        }
    }

    const nextFiveBuses = sortBusesByTimeToStation(buses).slice(0, 5);

    for (const bus of nextFiveBuses) {
        console.log(`Bus ${bus.lineId}, with destination ${bus.destinationName}, arrives at ${bus.stationName} in ${bus.timeToStation} seconds`)
    }
}

loadBuses();