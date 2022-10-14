
const tennis_parks = {
    "features": [
      {
        "type": "Feature",
        "properties": {
          "name": "San Jose Country Club",
          "description": "Private Country Club",
          "courts":12,
          "surface":"clay",
          "address":"7529 San Jose Blvd, Jacksonville,FL",
          "phone":"904-733-1414"
        },
        "geometry": {
          "coordinates": [-81.624521,
        30.243008],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "South Side Tennis Park",
          "description": "Public Tennis Courts",
          "courts":"12",
          "surface":"mixed hard and clay",
          "address":"1539 Hendricks Ave, Jacksonville, FL",
          "phone":"904-399-1761"
        },
        "geometry": {
          "coordinates": [-81.654452,30.309857],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Florida Yatch Club",
          "description": "Private Club",
          "courts":10,
          "surface":"clay",
          "address":"5210 Yacht Club Road, Jacksonville, FL",
          "phone":"904-387-1653"
        },
        "geometry": {
          "coordinates": [-81.690595,30.252485],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Julington Creek Plantation",
          "description": "Neighborhood Facility",
          "courts":10,
          "surface":"clay",
          "address":"350 Plantation Club Pkwy, Jacksonville, FL",
          "phone":"904-287-2633"
        },
        "geometry": {
          "coordinates": [-81.583068,30.103567],
          "type": "Point"
        }
      },
      
      {
        "type": "Feature",
        "properties": {
          "name": "Club Continental",
          "description": "Private Tennis Facility",
          "courts":7,
          "surface":"hard",
          "address":"111 Milwaukee Ave, Orange Park,FL",
          "phone":"904-269-6090"
        },
        "geometry": {
          "coordinates": [-81.699439,30.1686],
          "type": "Point"
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Williams YMCA",
          "description": "Private Tennis Facility",
          "courts":13,
          "surface":"clay",
          "address":"10415 San Jose Blvd, Jacksonville,FL",
          "phone":"904-292-1660"
        },
        "geometry": {
          "coordinates": [-81.625871,30.189304],
          "type": "Point"
        }
      }
    ],
    "type": "FeatureCollection"
  };
const navImgPath = '<img src="images/gps-30.png"/>';


mapboxgl.accessToken = 'pk.eyJ1IjoicmFrYSIsImEiOiJjaXE1Y2Z0ZmswMDVlZnRtMWpxcmwyYXNxIn0.qeT03bdaXEYxv6z0H5aCnQ';

tennis_parks.features.forEach((park, i) => {
    park.properties.id = i;
    //call the geocoder and get the getCoordinates
    // const geoData = callGeocoder(park.properties.address);
    // console.log(geoData);
    // let xCoord = geoData.addressMatches[0].coordinates.x;
    // let yCoord = geoData.addressMatches[0].coordinates.y;
    // park.geometry.coordinates = [xCoord,yCoord];
    // console.log(park.properties.name+": coord: "+park.geometry.coordinates);

    // Get the Weather Grid Number based on the coordinates
    let response = getGridNumber(park.geometry.coordinates[0],park.geometry.coordinates[1])
    .then((data) =>{
        //console.log(data);
        let x = data.properties.gridX;
        let y = data.properties.gridY;
         park.properties.gridNumber = x+','+y;
        console.log(park.properties);
    });
    
    
 });


  /**
       * Add a listing for each store to the sidebar.
       **/
   function buildLocationList(tennis_parks) {
    for (const tennis_loc of tennis_parks.features) {
      /* Add a new listing section to the sidebar. */
      const listings = document.getElementById('listings');
      const listing = listings.appendChild(document.createElement('div'));
      /* Assign a unique `id` to the listing. */
      listing.id = `listing-${tennis_loc.properties.id}`;
      /* Assign the `item` class to each listing for styling. */
      listing.className = 'item';

      /* Add the link to the individual listing created above. */
      const link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      link.id = `link-${tennis_loc.properties.id}`;
      link.innerHTML = `${tennis_loc.properties.name}<img onclick="alert('clicked');" style="vertical-align:middle;padding-left:20px;" src="images/gps-30.png"/>`;

      
      /* Add details to the individual listing. */
      const details = listing.appendChild(document.createElement('div'));
      let parsedAddress = tennis_loc.properties.address.split(',');
      //console.log(parsedAddress);
      details.innerHTML = `${parsedAddress[0]}`;
      if (tennis_loc.properties.phone) {
        details.innerHTML += ` <br> ${tennis_loc.properties.phone}`;
      }

      /**
       * Listen to the element and when it is clicked, do four things:
       * 1. Update the `currentFeature` to the store associated with the clicked link
       * 2. Fly to the point
       * 3. Close all other popups and display popup for clicked store
       * 4. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      link.addEventListener('click', function () {
        for (const tennis_loc of tennis_parks.features) {
          if (this.id === `link-${tennis_loc.properties.id}`) {
            flyToFeature(tennis_loc);
            createPopUp(tennis_loc);
          }
        }
        const activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');
      });
    }
  }

  function addMarkers(tennis_parks){
    //add markers to the map
    for (const tennis_loc of tennis_parks.features) {
      const el = document.createElement('div');
      el.className="marker";
      el.id = `marker-${tennis_loc.properties.id}`;

      new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(tennis_loc.geometry.coordinates)
      .addTo(map);

      //add event listeners
      el.addEventListener('click',(e) => {
        flyToFeature(tennis_loc);
        /* Close all other popups and display popup for clicked store */
        createPopUp(tennis_loc);
        /* Highlight listing in sidebar */
        const activeItem = document.getElementsByClassName('active');
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        const listing = document.getElementById(
          `listing-${tennis_loc.properties.id}`
        );
        listing.classList.add('active');
      });
    }
  }

  

  /**
       * Use Mapbox GL JS's `flyTo` to move the camera smoothly
       * a given center point.
       **/
   function flyToFeature(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 12
    });
  }

  /**
   * Create a Mapbox GL JS `Popup`.
   **/
  function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) {
      popUps[0].remove();
    }
    const popup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<h3>${currentFeature.properties.name}</h3><h4>${currentFeature.properties.address}</h4><h4>${currentFeature.properties.gridNumber}</h4>`
      )
      .addTo(map);
  }
  async function getGridNumber(x,y){

    let url = "https://api.weather.gov/points/"+y+","+x;
    let response = await fetch(url);
    return response.json();
  }

  async function callWeatherAPI(lat,lon){
    let url = new URL("https://api.openweathermap.org/data/3.0/onecall?");
    url.searchParams.append("lat",lat);
    url.searchParams.append("lon",lon);
    url.searchParams.append("appid","c9a3925634e7e901a11ec462b9199929");
    let response = await fetch(url);
    return response.json();
  }

  async function callGeocoderAPI(address){

    let key = ['street','city','state'];
    let url = new URL("https://geocoding.geo.census.gov/geocoder/geographies/address?");
    
    for (const loc of tennis_parks.features) {
      let addressData = loc.properties.address.split(',');
      for (let k in data) {
        url.searchParams.append(key[k], addressData[k].trim());
      }
      url.searchParams.append('benchmark','Public_AR_Census2020');
      url.searchParams.append('vintage','Census2020_Census2020');
      url.searchParams.append('layers','10');
      url.searchParams.append('format','json');
    // call the geocoder
      let response = await fetch(url);
      let data = await response.json();
    }
    
  }
  