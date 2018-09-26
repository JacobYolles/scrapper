

$("#submit-data").on("click",function (event) {
  event.preventDefault();
  var data = {
    service_provided: $("#service_provided").val(),
    days_provided: $("#days_provided").val(),
    current_price: $("#current_price").val(),
    small_bio: $("#small_bio").val()
  }
  console.log(data)
  $.ajax({
    method: "POST",
    url: "/api/hair",
    data: data
  }).then(function () {
    alert("Posted values")
    location.reload()
  })

})
