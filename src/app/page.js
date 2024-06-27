'use client';
import React, { useEffect } from 'react';
import Script from 'next/script';

const Home = () => {
  useEffect(() => {
    const initMap = async (position) => {
      const { Map, InfoWindow } = await google.maps.importLibrary('maps');
      const { PlacesService, PlacesServiceStatus } = await google.maps.importLibrary('places');

      const center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      const map = new Map(document.getElementById('map'), {
        center: center,
        zoom: 14,
      });

      const service = new PlacesService(map);
      let markers = [];
      let currentInfoWindow = null;

      const clearMarkers = () => {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
      };

      const generateStarsHTML = (rating) => {
        const fullStarWidth = (rating / 5) * 100; // Regla de 3 simple para el ancho de las estrellas llenas
        return `
          <div class="stars-container">
            <div class="stars-background"></div>
            <div class="stars-foreground" style="width: ${fullStarWidth}%;"></div>
          </div>
          <span class="rating-value">${rating}</span>
        `;
      };

      const performSearch = () => {
        const bounds = map.getBounds();
        const request = {
          bounds: bounds,
          type: 'cafe',
        };

        service.nearbySearch(request, (results, status) => {
          if (status === PlacesServiceStatus.OK && results) {
            clearMarkers();
            results.forEach((place) => {
              const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: place.name,
                icon: {
                  url: 'https://cdn-icons-png.flaticon.com/512/5497/5497803.png',
                  scaledSize: new google.maps.Size(50, 50),
                },
              });

              // Añadir evento de mouseover para aplicar la clase de animación
              google.maps.event.addListener(marker, 'mouseover', () => {
                marker.setIcon({
                  url: 'https://cdn-icons-png.flaticon.com/512/5497/5497803.png',
                  scaledSize: new google.maps.Size(50, 50),
                  className: 'marker-icon-hover', // Clase que define la animación
                });
              });

              // Añadir evento de mouseout para quitar la clase de animación
              google.maps.event.addListener(marker, 'mouseout', () => {
                marker.setIcon({
                  url: 'https://cdn-icons-png.flaticon.com/512/5497/5497803.png',
                  scaledSize: new google.maps.Size(50, 50),
                });
              });

              const infoWindowContent = `
                <div class="custom-info-window">
                  <h3>${place.name}</h3>
                  <p>${place.vicinity}</p>
                  <div>${generateStarsHTML(place.rating)}</div>
                  <a href="/details?name=${encodeURIComponent(place.name)}&vicinity=${encodeURIComponent(place.vicinity)}">
                    <button>Ver más</button>
                  </a>
                </div>
              `;

              const infoWindow = new InfoWindow({
                content: infoWindowContent,
              });

              marker.addListener('click', () => {
                if (currentInfoWindow) {
                  currentInfoWindow.close();
                }
                localStorage.setItem('selectedPlace', JSON.stringify({
                  photo: place.photos[0]?.getUrl() || '',
                  rating: place.rating
                }));
                infoWindow.open({
                  anchor: marker,
                  map,
                  shouldFocus: false,
                });
                currentInfoWindow = infoWindow;
              });

              markers.push(marker);
            });
          } else {
            console.log('No results');
          }
        });
      };

      const searchButton = document.createElement('button');
      searchButton.textContent = 'Buscar en esta Área';
      searchButton.classList.add('search-button');
      searchButton.addEventListener('click', performSearch);

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchButton);

      performSearch();
    };

    const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    };

    if (typeof window !== 'undefined') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initMap(position);
          },
          () => {
            handleLocationError(true, currentInfoWindow, map.getCenter());
          }
        );
      } else {
        handleLocationError(false, currentInfoWindow, map.getCenter());
      }
    }
  }, []);

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.CLAVE_API_GOOGLE}&libraries=places`}
      />
      <div id="map" style={{ height: '100vh', width: '100%' }} />
    </>
  );
};

export default Home;
