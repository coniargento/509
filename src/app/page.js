'use client'; // Indica que este archivo se ejecuta en el lado del cliente
import React, { useEffect } from 'react'; // Importa React y el hook useEffect
import Script from 'next/script'; // Importa el componente Script de Next.js para cargar scripts externos

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
  
                const infoWindowContent = `
                  <div class="custom-info-window">
                    <h3>${place.name}</h3>
                    <p>${place.vicinity}</p>
                    <p>${place.rating}</p>
                    <a href="/details?name=${encodeURIComponent(place.name)}&vicinity=${encodeURIComponent(place.vicinity)}" >
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
                  localStorage.setItem('selectedPlace', JSON.stringify(place.photos[0].getUrl()));
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
        strategy="beforeInteractive" // Carga el script antes de que el resto del contenido interactivo de la página se cargue
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.CLAVE_API_GOOGLE}&libraries=places`} // URL del script de Google Maps con la clave de API y las bibliotecas necesarias
      />
      <div id="map" style={{ height: '100vh', width: '100%' }} /> {/* Div para contener el mapa */}
      
    </>
  );
};

export default Home; // Exporta el componente Home como el componente por defecto
