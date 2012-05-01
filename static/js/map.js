var map;
var heatmap; 
var OPLocations = "";

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

window.onload = function(){

	var myLatlng = new google.maps.LatLng(48.3333, 16.35);
	// sorry - this demo is a beta
	// there is lots of work todo
	// but I don't have enough time for eg redrawing on dragrelease right now
	var myOptions = {
	  zoom: 2,
	  center: myLatlng,
	  mapTypeId: google.maps.MapTypeId.ROADMAP,
	  disableDefaultUI: false,
	  scrollwheel: true,
	  draggable: true,
	  navigationControl: true,
	  mapTypeControl: true,
	  scaleControl: true,
	  disableDoubleClickZoom: false
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	heatmap = new HeatmapOverlay(map, {"radius":40, "visible":true, "opacity":60});
		



var heatmapPoints = [];
for(i = 0; i<myLocations.length; i++) {
	
	var tmpLat = roundNumber(myLocations[i].lat, 1); // 40.123
	var tmpLon = roundNumber(myLocations[i].lon, 1);
	var foundExistingHeatPoint = false;

	for ( n=0; n <heatmapPoints.length; n++) {
		var	currHeatPoint = heatmapPoints[n];

		// && tmpLon == currHeatPoint.lon)
		if (tmpLat == currHeatPoint.lat && tmpLon == currHeatPoint.lon) {
			//exists already
			heatmapPoints[n].count += 10;
			foundExistingHeatpoint = true;
			console.log(currHeatPoint.lat);
			//,currHeatPoint.lng,currHeatPoint.count);
			break;
		}
	}

	if (foundExistingHeatPoint == false) {
		heatmapPoints.push({
			lat : tmpLat
			, lng: tmpLon
			, count:1
		})

	}	

	

}

//set OP location data as heatmap data set

	var mapData={
	max: 100,
    		data: heatmapPoints
    	};
    	

	// this is important, because if you set the data set too early, the latlng/pixel projection doesn't work
	google.maps.event.addListenerOnce(map, "idle", function(){
		heatmap.setDataSet(mapData);
	});
};
