//https://techswitch.atlassian.net/wiki/spaces/0RC/pages/891060240/Bus+Board
//https://api-portal.tfl.gov.uk/apis
//http://api.postcodes.io/
//https://api-portal.tfl.gov.uk/api-details#api=StopPoint&operation=StopPoint_GetByPathIdsQueryIncludeCrowdingData

        // https://api.tfl.gov.uk/StopPoint/?lat=51.461697&lon=-0.217683&stopTypes=NaptanPublicBusCoachTram&modes=bus
        //"NaptanPublicBusCoachTram"
        // for postcode SW151PQ, "longitude": -0.217683,"latitude": 51.461697

const fetch = require('node-fetch');
const readline = require("readline-sync");

console.log("Please enter your postcode:");
const postcode = readline.prompt();

fetch(`http://api.postcodes.io/postcodes/${postcode}`)
    .then(function (response) {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(getStopPoint)
    .catch(function (error) {
        console.error('Invalid Postcode',error);
    })

    function getStopPoint(json) {
        const latitude = json.result.latitude;
        const longitude = json.result.longitude;
        const radius = 200;
       
        fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}&modes=bus`)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(twoNearestBusStops)
            .catch(function (error) {
                console.error(error);
            });
    }

    function twoNearestBusStops(json) {
        const stopPointsArray = json.stopPoints;
        if (stopPointsArray.length === 0) {
            console.log("There aren't any bus stops nearby");
        }
        else {
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
            obtainAllBusesArrivalsForStops(twoBusStopCodeArray);
        }
    }

    async function obtainAllBusesArrivalsForStops(stopPointIDs) {
        for (let i = 0; i < stopPointIDs.length; i++) {
            console.log(`The next 5 buses due at stopPointID ${stopPointIDs[i]}: `);
            try {
                const buses = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopPointIDs[i]}/Arrivals`)
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    });
                printBusInfo(buses);
            } catch (error) {
                console.error(error.name,error.message);
            }
        }
    }

function printBusInfo(json) {
    if (json.length === 0) {
        throw new Error('no buses arriving!');
        //console.log("There are no buses arriving at this stop point!");
    } else {
        const sortedArray = json.sort(function (busA, busB) {
            return busA.timeToStation - busB.timeToStation;
        });
        let nextFiveBuses = sortedArray.slice(0, 5);
        for (const bus of nextFiveBuses) {
            console.log(`Bus ${bus.lineId} to ${bus.destinationName} will be arriving in ${Math.floor(bus.timeToStation / 60)} minutes!`);
        }
    }
}












