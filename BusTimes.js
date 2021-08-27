/*Your program should ask the user for a stop code, 
and print a list of the next five buses at that stop code, with their routes, 
destinations, and the time until they arrive in minutes.*/
//id,towards,destinationName,timeToStation
const fetch = require('node-fetch');
const readline = require ("readline-sync");
// console.log("Please enter the stop code:");
// const stopCode = readline.prompt();
const stopCode = "490008660N";

fetch (`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals`)
    .then (function(response){
        return response.json();
    })
    .then (function(json) {
        // console.log(json);
        const sortedArray = json.sort(function(busA, busB){
            return busA.timeToStation - busB.timeToStation;
        });
        for (let i=0; i<5; i++){
        console.log (`Bus ${sortedArray[i].lineId} to ${sortedArray[i].destinationName} will be arriving in ${Math.floor(sortedArray[i].timeToStation/60)} minutes`);}
     
    });




