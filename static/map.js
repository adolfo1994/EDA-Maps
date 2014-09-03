function add_marker(LatLng, map, kwargs={}){
  // To set an icon later call setIcon
  // icon: "static/sphere.png"
  kwargs['position'] = LatLng;
  kwargs['map'] = map;
  var marker = new google.maps.Marker(kwargs);
  var info = "";
  if (kwargs) {
    info = "<h6>" + kwargs['title'] + "</h6>";
  }
  info += "Location: " + LatLng;
  if (kwargs['infowindow']) {
    google.maps.event.addListener(marker, 'click', function() {
      kwargs['infowindow'].close();
      kwargs['infowindow'].setContent(info);
      kwargs['infowindow'].open(map,marker);
    });
  }
  return marker;
}
function gen_randoms(n_points, radius=1, center){
  radius_degrees = radius/40000.0*360;
  ans = [];
  for(var i = 0; i<n_points; i++){    
    var rand1 = Math.random();    
    var rand2 = Math.random();
    var w = radius_degrees * Math.sqrt(rand1);    
    var t = 2*Math.PI*rand2;    
    var x = w*Math.cos(t);    
    var y = w*Math.sin(t);
    var x1 = x/Math.cos(center.k);
    var new_point = new google.maps.LatLng(center.k + x1,
                                           center.B + y);    
    ans.push(new_point);
  }
  return ans;
};
function toggleBounce() {
  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

$( document ).ready(function() {
  var myPos;
  var map;
  var infowindow = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){                    
      myPos = new google.maps.LatLng(position.coords.latitude,
                                     position.coords.longitude);
      add_marker(myPos, map, {
        title:"Your Current Position",
        infowindow: infowindow
      });
      map.setZoom(15);
      map.setCenter(myPos);      
      
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }    
  function init(){    
    var mapOptions = {
      center: new google.maps.LatLng(-16.384332, -71.538840),
      zoom: 11
    };
    map = new google.maps.Map(document.getElementById("eda-map"),
      mapOptions);
  };
  google.maps.event.addDomListener(window, 'load', init);
  $( "#pointform" ).submit(function( event ) {
    var n = Number($("#point_number").val());
    var r = Number($("#point_radius").val());
    var arr = gen_randoms(n,r,myPos);
      for (var i = 0; i < arr.length; i++) {
         add_marker(arr[i], map, {
           title:"Random Point "+i,
           infowindow: infowindow
         });
    }
    event.preventDefault();
  });
});
