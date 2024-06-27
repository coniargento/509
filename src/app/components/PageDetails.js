'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const Details = () => {
  const router = useRouter();
  const name = useSearchParams().get('name');
  const vicinity = useSearchParams().get('vicinity');

  const generateStarsHTML = (rating) => {
    const fullStarWidth = (rating / 5) * 100; // Regla de 3 simple para el ancho de las estrellas llenas
    return (
      <div className="rating-container">
        <div className="stars-container">
          <div className="stars-background"></div>
          <div className="stars-foreground" style={{ width: `${fullStarWidth}%` }}></div>
        </div>
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const place = localStorage.getItem('selectedPlace');
    if (place) {
      setSelectedPlace(JSON.parse(place));
    }
  }, []);

  if (!selectedPlace) {
    return <div>No place selected</div>;
  }

  return (
    <div className="paginainterna">
      <div className="tituloboton">
        <button className="botonatras" onClick={() => router.back()}>x</button>
        <h1>{name}</h1>
      </div>
      <p className="datos">{vicinity}</p>
      <div className="datos">{generateStarsHTML(selectedPlace.rating)}</div>
      {selectedPlace.photo && (
        <img className="imgpage" src={selectedPlace.photo} alt={`Photo of ${name}`} />
      )}
    </div>
  );
};

export default Details;