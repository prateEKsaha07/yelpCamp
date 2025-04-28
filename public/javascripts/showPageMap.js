new maptilersdk.Map({
  container: 'map', // The ID of the div where the map will be displayed
  style: `https://api.maptiler.com/maps/basic/style.json?key=${maptilerApiKey}`, // Directly linking the map style
  center: coordinates,  // Set the map's center to the campground's coordinates
  zoom: 10 // Set the zoom level
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)