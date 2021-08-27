const fetch = require('node-fetch');

fetch("http://httpstat.us/500")
    .then(function() {
        console.log("ok");
    }).catch(function() {
        console.log("error");
    });
