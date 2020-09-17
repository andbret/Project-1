//call to get snack info
$.ajax({
  url: "https://trackapi.nutritionix.com/v2/search/instant?query=" + snackInput,
  method: "GET",
  beforeSend: function (xhr) {
    xhr.setRequestHeader("x-app-id", "e75b2779");
    xhr.setRequestHeader("x-app-key", "0be5c122a01d2e0e81c70fd596e73aea");
  },
}).then(function (getInfo) {
  var calories = getInfo.branded[0].nf_calories;
});
