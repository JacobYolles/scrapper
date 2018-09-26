
// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  


//   // Getting references to the name input and author container, as well as the table body

//   var $hairList = $("#hair-list");

//   var API = {
//     saveHair: function(hair) {
//       return $.ajax({
//         headers: {
//           "Content-Type": "application/json"
//         },
//         type: "POST",
//         url: "api/hair",
//         data: JSON.stringify(hair)
//       });
//     },
//     getHair: function() {
//       return $.ajax({
//         url: "api/hair",
//         type: "GET"
//       });
//     },
//     deleteHair: function(id) {
//       return $.ajax({
//         url: "api/hair/" + id,
//         type: "DELETE"
//       });
//     }
//   };

//   var refreshHair = function() {
//     API.getHair().then(function(data) {
//       var $hairList = data.map(function(hair) {
//         var $a = $("<a>")
//           .text(hair.service_provided)
//           .attr("href", "/hair/" + hair.id);
  
//         var $li = $("<li>")
//           .attr({
//             class: "list-group-item",
//             "data-id": hair.id
//           })
//           .append($a);
  
//         var $button = $("<button>")
//           .addClass("btn btn-danger float-right delete")
//           .text("ｘ");
  
//         $li.append($button);
  
//         return $li;
//       });
  
//       $hairList.empty();
//       $hairList.append($hairList);
//       refreshHair();
//     });
//   };

//  getHair();



//   // Function for creating a new list row for authors
// function createHairRow(hairData) {
//   var newTr = $("<tr>");
//   newTr.data("hair", hairData);
//   newTr.append("<td> " +hairData.service_provided + "</td>");
//   newTr.append("<td> " +hairData.days_provided + "</td>");
//   newTr.append("<td> " +hairData.current_price + "</td>");
//   return newTr
// }
  

//   // Function for retrieving authors and getting them ready to be rendered to the page
//   function getHair() {
//     $.get("/api/hair", function(data) {
//       // var hbsObject = {
//       //   hair: data
//       // };
//       // console.log(data);
//       // console.log(hbsObject);
//       // res.render("index", hbsObject);
//       var rowsToAdd = [];
//       for (var i = 0; i < data.length; i++) {
//         rowsToAdd.push(createHairRow(data[i]));
//       }
//       renderHairList(rowsToAdd);
//       nameInput.val("");
//     });
//   }

//   // A function for rendering the list of authors to the page
//   function renderHairList(rows) {
//     hairList.children().not(":last").remove();
//     hairContainer.children(".alert").remove();
//     if (rows.length) {
//       console.log(rows);
//       hairList.prepend(rows);
//     }
//     else {
//       renderEmpty();
//     }
//   }


