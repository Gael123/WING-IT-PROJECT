import mapboxgl from 'mapbox-gl';
import fetch from 'cross-fetch'; // required for fetch json file from browser

const mapElement = document.getElementById('map');
const postCardPhotoEl = document.querySelector('.js-post-photo');
const postCardUsernameEl = document.querySelector('.js-username');
const postCardContentEl = document.querySelector('.js-post-content');
const postCardAvatarEl = document.querySelector('.js-user-avatar');
const postCardUrlEl = document.querySelector('.js-post-link');
const postCardTimeEl = document.querySelector('.js-post-time');
const currentMarkers = {};

const geolocateControl = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  fitBoundsOptions: {
    maxZoom: 15,  // Zoom adjustment
    linear: false
  }
});

// const currentLatLng = () => {
//   return navigator.geolocation.getCurrentPosition(success);
// }

// const success = (position) => {
//   return [position.coords.latitude, position.coords.longitude];
// };

// Create Map
const buildMap = () => {
  mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
  return new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    duration: 0,
    pitch: 60,
    //bearing: -60,
  });
};

// Add Markers to Map
const addPostsToMap = (map, posts) => {
  Object.keys(currentMarkers).forEach(postId => {
    currentMarkers[postId].remove();
    // When adding posts to map, remove all acurrent marker, not optimal
    delete currentMarkers[postId];
  });

  posts.forEach((post) => {
    // stops loading markers on top of each other
    //if (!currentMarkers[post.id]) {
      const popup = new mapboxgl.Popup().setHTML()//`<img src="${post.photo.url}">`; // Need to revisit this for customising windows

      const markerEl = document.createElement("div");
      markerEl.classList.add("map-marker")
      markerEl.innerHTML = `<img src=${post.user.photo.url}>`
      markerEl.addEventListener('click', () => {
        console.log(post)
        postCardPhotoEl.setAttribute("src", post.post_photo)
        postCardUrlEl.setAttribute("href", post.url)
        postCardAvatarEl.setAttribute("src", post.user.photo.url)
        postCardUsernameEl.innerHTML = post.user.name
        postCardContentEl.innerHTML = post.content
        postCardTimeEl.innerHTML = post.time
      });

      currentMarkers[post.id] = new mapboxgl.Marker({
        element:markerEl
      })
        .setLngLat([ post.longitude, post.latitude ])
        .addTo(map);
    //}
  });
};

const initMapbox = () => {
  if (mapElement) {
    const map = buildMap();
    // Add Current Location via GeoLocate Control
    map.addControl(geolocateControl);
    // subscribe to event
    map.on('load', (e) => {
      geolocateControl.trigger();
      console.log("trigger geolocate control")
    });

    // Mapbox listens to the event where the map boundaries shift
    map.on('moveend', (e) => {
      var bounds = map.getBounds();
      // Get Max Lat and Lng
      let northEast = bounds.getNorthEast()
      // Get Min Lat and Lng
      let southWest = bounds.getSouthWest()
      // define url params
      fetch(`/posts?latMin=${southWest.lat}&latMax=${northEast.lat}&lngMin=${southWest.lng}&lngMax=${northEast.lng}`, {
        headers: {
          'Accept': 'application/json' // Asking for a json response from browser
        }
      })
      .then(res => res.json()) // Receive JSON response and converting it into usable format
      .then(postsResponse => {
        addPostsToMap(map, postsResponse); // Add posts to map
        console.log(postsResponse);
      });
    });
  }
};

export { initMapbox };
