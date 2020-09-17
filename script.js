// zip code as determined by user
var zipCode = $("#zip")
var submit = $("#submitButton");

submit.click(function(){
    var zip = zipCode.val();
    apiCall(zip);
})
function apiCall(zip){
    // URL for openWeather API to determine coordinates, to be used in the hiking API
    var queryURLcoord = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=209f8c58871bc71410613a476769ea05`

    $.ajax({
        url: queryURLcoord,
        method: "GET"
    }).then(function(weather){
        // console.log(weather);
        
        // coordinates
        var lat = weather.coord.lat;
        var lon = weather.coord.lon;
        // max distance from lon and lat
        var max = 20;
        // minumum length of trail based on the calculation of how many miles the user should walk
        var minimumTrailLength = 12;
        // URL for hinking API
        var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=${max}&minLength=${minimumTrailLength}&key=200914730-ab7614e0ee0bfb0265f3fa4b3c4abc83`

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(hikingData){
            console.log(hikingData);
                
            for(i = 0 ; i < hikingData.trails.length; i++){
                var selectedTrail = hikingData.trails[i]["length"];
                if(selectedTrail >= minimumTrailLength){
                    console.log(hikingData.trails[i]);
                }

                // //    var trailsWithMinimumLength = hikingData.trails.filter(function(trail) {
                // //         // trail is an Object in here
                        
                // //         return trail.length >= minimumTrailLength;
                        
                //     });
                
            };
        }); 
    });
}
