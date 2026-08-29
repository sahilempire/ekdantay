
var google;

function initMap() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    // Coordinates for Sawai Madhopur, Rajasthan, India
    var myLatlng = new google.maps.LatLng(26.0190, 76.3521);
    
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: myLatlng,

        // How you would like to style the map. 
        scrollwheel: false,
        styles: [
            {
                "featureType": "administrative.country",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            }
        ]
    };

    

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);
    
    // Add marker for Ekdantay Dental Clinic
    var clinicLatlng = new google.maps.LatLng(26.0190, 76.3521);
    var marker = new google.maps.Marker({
        position: clinicLatlng,
        map: map,
        title: 'Ekdantay Dental Clinic',
        icon: 'images/loc.png'
    });
    
    // Add info window
    var infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px;"><h5>Ekdantay Dental Clinic</h5><p>8, Janta Dharmshala, near Mahila Thana,<br>Housing Board, Sawai Madhopur,<br>Alanpur Rural, Rajasthan 322001</p><p>Phone: +91 95878 15285</p></div>'
    });
    
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    
}