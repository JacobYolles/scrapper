



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


