var snackInput = $("#snack");
var bodyWeightInput = $("#weight");
var submit = $("#submitButton");
var zipCode = $("#zip");
var modalDlg = document.querySelector("#image-modal");
var loadModal = document.querySelector("#loading-modal");
var imageModalCloseBtn = document.querySelector("#image-modal-close");
var snackTest = document.querySelector("#snack");
var amountTest = document.querySelector("#amount");
var amountInput = $("#amount");
var weightTest = document.querySelector("#weight");
var zipTest = document.querySelector("#zip");
var elementExists = document.getElementById("#error");

imageModalCloseBtn.addEventListener('click', function () {
    modalDlg.classList.remove('is-active');

});

submit.click(async function () {
  snackTest.classList.remove('is-danger');
  $("#error").remove()
  amountTest.classList.remove('is-danger');
  $("#error2").remove()
  weightTest.classList.remove('is-danger');
  $("#error3").remove()
  zipTest.classList.remove('is-danger');
  $("#error4").remove()
  loadModal.classList.add('is-active');
  var zip = zipCode.val();
  var snack = snackInput.val();
  var bodyWeight = bodyWeightInput.val();
  var amount = amountInput.val();
 
  
 
   
  
try{
  await determineCalories(snack, bodyWeight, zip, amount);
} catch (error){
  loadModal.classList.remove('is-active');
  snackTest.classList.add('is-danger');
  
  $(".errorInput").append('<span class="help is-danger" id="error">&nbsp; This is not a valid food &nbsp;</span>');
  var amountNumber = parseInt(amount)
  var weightNumber = parseInt(bodyWeight)
  var zipNumber = parseInt(zip)
  console.log(Number.isInteger(amountNumber));
  if((Number.isInteger(amountNumber))=== false){
    loadModal.classList.remove('is-active');
    amountTest.classList.add('is-danger');
    
    $(".errorInput2").append('<span class="help is-danger" id="error2">&nbsp; Only enter a number &nbsp;</span>');
  }
  
  if((Number.isInteger(weightNumber))=== false){
      loadModal.classList.remove('is-active');
      weightTest.classList.add('is-danger');
      
      $(".errorInput3").append('<span class="help is-danger" id="error3">&nbsp; Only enter a number &nbsp;</span>');
  }
  if(((Number.isInteger(zipNumber))=== false) || (zip.length != 5)){
    loadModal.classList.remove('is-active');
    zipTest.classList.add('is-danger');
    
    $(".errorInput4").append('<span class="help is-danger" id="error4">&nbsp; Enter a valid ZIP code &nbsp;</span>');
  }
  // if(((Number.isInteger(weightNumber))=== false) || ((Number.isInteger(zipNumber))=== false) || ((Number.isInteger(amountNumber))=== false)){
  //   loadModal.classList.remove('is-active');
  // }else{
    
  // }
  return;
}
console.log(amount);
var amountNumber = parseInt(amount)
var weightNumber = parseInt(bodyWeight)
var zipNumber = parseInt(zip)
console.log(Number.isInteger(amountNumber));
if((Number.isInteger(amountNumber))=== false){
  loadModal.classList.remove('is-active');
  amountTest.classList.add('is-danger');
  
  $(".errorInput2").append('<span class="help is-danger" id="error2">&nbsp; Only enter a number &nbsp;</span>');
}

if((Number.isInteger(weightNumber))=== false){
    loadModal.classList.remove('is-active');
    weightTest.classList.add('is-danger');
    
    $(".errorInput3").append('<span class="help is-danger" id="error3">&nbsp; Only enter a number &nbsp;</span>');
}
if(((Number.isInteger(zipNumber))=== false) || (zip.length != 5)){
  loadModal.classList.remove('is-active');
  zipTest.classList.add('is-danger');
  
  $(".errorInput4").append('<span class="help is-danger" id="error4">&nbsp; Enter a valid ZIP code &nbsp;</span>');
}});

async function determineCalories(snack, bodyWeight, zip, amount) {
  console.log(zip);
  const getInfo = await $.ajax({
    url: "https://trackapi.nutritionix.com/v2/search/instant?query=" + snack,
    method: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("x-app-id", "e75b2779");
      xhr.setRequestHeader("x-app-key", "0be5c122a01d2e0e81c70fd596e73aea");
    },

  });

    console.log(getInfo);

    if(!getInfo.branded.length){
      console.log("here")
      throw new Error("not a valid food");
    }

    var calories = getInfo.branded[0].nf_calories * amount;

    console.log(getInfo.branded[0]);

    var miles = (calories * 1.37) / bodyWeight;
    var minimumTrailLength = Math.round(miles);
    console.log(minimumTrailLength);

    apiCallcoords(zip, minimumTrailLength);
}

function apiCallcoords(zip, minimumTrailLength) {
  // URL for openWeather API to determine coordinates, to be used in the hiking API
  var queryURLcoord = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=209f8c58871bc71410613a476769ea05`;
  // storing trail length to pass along to next function
  console.log(minimumTrailLength);

  $.ajax({
    url: queryURLcoord,
    method: "GET",
  }).then(function (weather) {
    // console.log(weather);

    // coordinates
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    apiCallHike(lat, lon, minimumTrailLength);
  });
}

function apiCallHike(lat, lon, minimumTrailLength) {
  // max distance from lon and lat
  var max = 20;

  // URL for hinking API
  var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=${max}&minLength=${minimumTrailLength}&key=200914730-ab7614e0ee0bfb0265f3fa4b3c4abc83`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (hikingData) {
    console.log(hikingData);
    var trailId = [];
    for (i = 0; i < hikingData.trails.length; i++) {
      var selectedTrail = hikingData.trails[i]["length"];
      if (
        selectedTrail >= minimumTrailLength &&
        selectedTrail <= minimumTrailLength + 3
      ) {
        // console.log(hikingData.trails[i]);
        trailId.push(hikingData.trails[i]);
      } else if (selectedTrail >= minimumTrailLength + 10) {
        trailId.push(hikingData.trails[i]);
      }
      else if (selectedTrail >= minimumTrailLength + 50) {
        trailId.push(hikingData.trails[i]);
      }
    }

    // displaying all the information in the pop up modal
    console.log(trailId[0]);
    
    console.log(trailIMG);
    if (hikingData.trails[0] === undefined) {
      console.log("TEESSSTTTT");
      $("#trailImage").attr("src", "noImage.jpg");
      $("#trailName").html("You need to walk "+minimumTrailLength+" miles, which is so far that we can't find you a trail.");
      $("#trailSummary").text("You really shouldn't snack that much.");
      $("#difficulty").html("&nbsp; Difficulty: impossible &nbsp;");
      $("#rating").html("&nbsp; Rating: 0★ &nbsp;");
      $("#length").text("Length: too long");
      $("#trailLocation").text("Location: try a gym");
      $("#trailType").text("Trail type: treadmill");
      $("#condition").text("Condition: unknown");
      loadModal.classList.remove("is-active");
      modalDlg.classList.add("is-active");
    }
    else{
      var trailIMG = hikingData.trails[0]["imgMedium"];
    if (trailIMG === "") {
      $("#trailImage").attr("src", "noImage.jpg");
    } else {
      $("#trailImage").attr("src", trailId[0].imgMedium);
    }
    if(minimumTrailLength===1){
    $("#trailName").html("You need to walk "+minimumTrailLength+" mile, so "+trailId[0].name + " is the perfect hike for you!");
  } else if(minimumTrailLength>1){
    $("#trailName").html("You need to walk "+minimumTrailLength+" miles, so "+trailId[0].name + " is the perfect hike for you!");
  }
    $("#trailSummary").text(trailId[0].summary);
    $("#difficulty").html("&nbsp; Difficulty: " + trailId[0].difficulty+" &nbsp;");
    $("#rating").html("&nbsp; Rating: " + trailId[0].stars + "★ &nbsp;");
    $("#length").text("Length: " + trailId[0].length + " miles");
    $("#trailLocation").text("Location: " + trailId[0].location);
    console.log(trailId[0].location);
    $("#trailType").text("Trail type: " + trailId[0].type);
    $("#condition").text("Condition: " + trailId[0].conditionStaus);
    loadModal.classList.remove("is-active");
    modalDlg.classList.add("is-active");
  }
  });
}




