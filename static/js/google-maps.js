let map;
const MARKERS = []; // Update -- append markers to menu
let markers = [];

function initialize() {
    let center = new google.maps.LatLng(47.5260, 15.2551);

    // moved map to global scope (for create_marker).
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 3,
        disableDefaultUI: true,
    });

    let locations = [
        ['Paris, France', 48.8566, 2.3522],
        ['Santorini, Greece', 36.3932, 25.4615],
        ['Mykonos, Greece', 37.4467, 25.3289],
        ['Rome, Italy', 41.9028, 12.4964],
        ['Marrakesh, Morocco', 31.6295, -7.9811],
        ['Lisbon, Portugal', 38.7223, -9.1393],
        ['Barcelona, Spain', 41.3851, 2.1734],
    ];
    
    let autocomplete = new google.maps.places.Autocomplete(document.getElementById('place-search-box'));

    create_locations(map, locations);
    
    external_marker_links(MARKERS); // Update -- append markers to menu

    create_locations_from_search(map, locations);

    reset_map(map);
}

function create_locations(map, locations) {
    for (i = 0; i < locations.length; i++) {
        
        // Update -- append markers to menu
        const locations_menu = document.getElementById('locations-menu');
        locations_menu.appendChild(document.createElement('a'));
        
        let locations_menu_links = locations_menu.children;
        locations_menu_links[i].setAttribute('class', 'dropdown-item');
        locations_menu_links[i].setAttribute('data-marker-id', i);
        locations_menu_links[i].setAttribute('href', '#map');
        locations_menu_links[i].innerText = locations[i][0];
        
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            title: locations[i][0],
        });
        
        MARKERS.push(marker); // Update -- append markers to menu

        get_markers(map, marker);
    }
}

function get_markers(map, marker) {
    google.maps.event.addListener(marker, 'click', function() {
        map.setZoom(12);
        map.setCenter(this.position);

        let request = {
            location: this.position,
            radius: 8047 * 2,
            types: document.getElementById('place-types-select').addEventListener('change', function(){ this.value; }),
            fields: ['name', 'formatted_address', 'website',],
        };

        let infowindow = new google.maps.InfoWindow();

        let service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    });
}

function external_marker_links(MARKERS) {
    // Update -- append markers to menu
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown-item')) return;
    
        e.preventDefault();
        
        let element = document.getElementById('map');
        element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    
        google.maps.event.trigger(MARKERS[e.target.getAttribute('data-marker-id')], 'click');
    });
    // 
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (i = 0; i < results.length; i++) {
            markers.push(create_marker(results[i]));
        }
    }
}

function create_marker(place) {
    let placeLocation = place.geometry.location;

    let placeIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#ff6a6f',
        fillOpacity: 1,
        scale: 4.5,
        strokeColor: 'white',
        strokeWeight: 1,
    };

    let marker = new google.maps.Marker({
        map: map,
        position: placeLocation,
        icon: placeIcon,
    });

    google.maps.event.addListener(marker, 'click', function() {
        let request = {
            reference: place.reference,
        };

        let service = new google.maps.places.PlacesService(map);

        let infowindow = new google.maps.InfoWindow();

        service.getDetails(request, function(place_details, status) {
            infowindow.setContent('<p><strong>' + place_details.name + '</strong></p><p>' + place_details.formatted_address + '</p><p><a href="' +  place_details.website + '" target="_blank" rel="noopener">View Website</a></p>');
            infowindow.open(map, marker);
        });
    });

    return marker;
}

function create_locations_from_search(map, locations) {
    document.getElementById('place-search-button').onclick = function() {
        const search_box_input = document.getElementById('place-search-box');

        geocode(search_box_input, locations);

        google.maps.event.trigger(search_box_input, 'focus', {});
        google.maps.event.trigger(search_box_input, 'keydown', { keyCode: 13 });
        google.maps.event.trigger(this, 'focus', {});

        clear_markers(markers);
    };
}

function geocode(search_box_input, locations) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': search_box_input.value}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            let location = results[0].geometry.location;
            let lat = location.lat();
            let lng = location.lng();

            locations.push([search_box_input.value, lat, lng]);

            create_locations(map, locations);
            
            // New
            map.setZoom(12);
            map.setCenter({lat:lat, lng:lng});
    
            let request = {
                location: {lat:lat, lng:lng},
                radius: 8047 * 2,
                types: document.getElementById('place-types-select').addEventListener('change', function(){ this.value; }),
                fields: ['name', 'formatted_address', 'website',],
            };
    
            let infowindow = new google.maps.InfoWindow();
    
            let service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
            //
        }
    });
}

function clear_markers(markers) {
    for (let m in markers) {
        markers[m].setMap(null);
    }

    markers = [];
}

function reset_map(map) {
    document.addEventListener('click', function(e) {
        if (!e.target.matches('#reset-button')) return;

        e.preventDefault();

        map.setZoom(3);
        map.setCenter({lat:47.5260, lng:15.2551});

        clear_markers(markers);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initialize();
});