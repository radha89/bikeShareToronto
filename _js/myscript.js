var stationList = new Array();
var students = new Array();
var newStudent;
//var idP;
//var idPopup;
var newStation;
var rowID;
var map;


function Students(name, login, studentNumber, image){
    this.name = name;
    this.login = login;
    this.studentNumber = studentNumber;
    this.image = image;
}

function Station (id, city, stationName, availableDocks, totalDocks, latitude, longitude, statusValue, statusKey, availableBikes, stationImg)
{
    this.id = id;
    this.city = city;
    this.stationName = stationName;
    this.availableDocks = availableDocks;
    this.totalDocks = totalDocks;
    this.latitude = latitude;
    this.longitude = longitude;
    this.statusValue = statusValue;
    this.statusKey = statusKey;
    this.availableBikes = availableBikes;
    this.stationImg = stationImg;
}

$(document).on("pagebeforeshow", "#home", function() {

    $("#stations").html("");
    $.ajax({
        type: "GET",
        url: "updatedXMLfile.xml",
        dataType: "xml",
        success: handleResponse
    });

    $.getJSON("students.json", function(data) {
        var start = data.groupProject.students;
        for(var i = 0; i < start.length; i++) {
            var name = start[i].name;
            var login = start[i].login;
            var studentNumber = start[i].studentNumber;
            var mugshot = start[i].image;

            newStudent = new Students(name, login, studentNumber, mugshot);
            students.push(newStudent);
            
        }
        populateFooter("#p", "#myPopup");

    });
});


function populateFooter(idP, idPopup) {


        console.log(students.length);
        for(var i = 0; i < students.length; i++) {
            console.log("in for loop to populate images");
            $(idP + i).html(
                    "<img class='studentImage' src='_images/" + students[i].image +
                    "'>"
            );


            $(idPopup + i).html(
                    "<p>" + students[i].name + "</p>" +
                    "<p>" + students[i].login + "</p>" +
                    "<p>" + students[i].studentNumber + "</p>"
            );

        }
        

    console.log("populateFooter called");

}


function handleResponse(xml) {

    console.log("in handle");

    var n = 0;

    $(xml).find("stationBeanList").each(function() {
        $("#stations").append(
            "<li li-id='" + n + "'>" +
            "<a href='#individual' class='ui-btn ui-icon-" +
            $(this).find("stationImg").text().toLowerCase().replace('.png', '') +
            " ui-btn-icon-left ui-corner-all'>" +
            "<span id='s" + n + "'>" +
            $(this).find("stationName").text() +
            "</span>" +
            "</a></li>"
        );

        newStation = new Station(
            $(this).find("id").text(),
            $(this).find("stationName").attr("city"),
            $(this).find("stationName").text(),
            $(this).find("availableDocks").text(),
            $(this).find("totalDocks").text(),
            $(this).find("latitude").text(),
            $(this).find("longitude").text(),
            $(this).find("statusValue").text(),
            $(this).find("statusKey").text(),
            $(this).find("availableBikes").text(),
            $(this).find("stationImg").text()
        );
        stationList.push(newStation);
        n++;
    }); //end of loop
    $("ul#stations").listview("refresh");
}

$(document).on("click", "#stations >li", function() {
   rowID = $(this).closest("li").attr("li-id");
});

function createMap(longitude, latitude) {
    console.log("in createmap " + stationList[rowID].stationName);
    mapCenter = new google.maps.LatLng({lat: latitude, lng: longitude}); 
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 16,
        draggable: false
    });

    var contentString = '<h3>' + stationList[rowID].city + ', ' + 
                        stationList[rowID].stationName + '</h3>' +
                        '<p>' + students[0].name + ', ' + students[1].name +
                        '<br>'+ students[2].name + ', ' + students[3].name + '</p>';

    var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 300
    });
    
    var marker = new google.maps.Marker({
       position: mapCenter,
       title: stationList[rowID].stationName,
       animation: google.maps.Animation.DROP
    });
    
    marker.setMap(map);
    marker.addListener('click', function() {
    infowindow.open(map, marker);
    });
}

function createChart(chart, data){
    var stationData = [
        {
            label: "Total Docks",
            value: data.totalDocks,
            color: "#F7464A",
            highlight: "#FF5A5E"
        },
        {
            label: "Available Docks",
            value: data.availableDocks,
            color: "#46BFBD",
            highlight: "#5AD3D1"
        },
        {
            label: "Available Bikes",
            value: data.availableBikes,
            color: "#FDB45C",
            highlight: "#FFC870"
        }
    ]


    var myNewChart = new Chart(chart).Doughnut(stationData, {
        responsive: true,
        maintainAspectRatio: false
    });
    legend(document.getElementById("doughnutLegend"), stationData, myNewChart);
}


$(document).on("pageshow", "#individual", function() {
    console.log("on individual page");
    populateFooter("#d", "#myPopupPop");
    $("#maina").html("<h1 class='ui title'>Status</h1>" + 
                        "<canvas id='myChart'></canvas>"+
                        "<div id='doughnutLegend'></div>");

    $("#thumb").attr("src", "_images/" + stationList[rowID].stationImg);
    $("#fullImage").attr("src", "_images/" + stationList[rowID].stationImg);
    console.log(stationList[rowID].longitude, stationList[rowID].latitude);
    createMap(parseFloat(stationList[rowID].longitude), parseFloat(stationList[rowID].latitude));
    createChart($("#myChart").get(0).getContext("2d"), stationList[rowID]);

});

