// pages/details.js
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const Details = () => {
    const router = useRouter();
    const name = useSearchParams().get('name')
    const vicinity = useSearchParams().get('vicinity')
    const estrellas = (rating) => {
        const fullStarWidth = (rating / 5) * 100; // Regla de 3 simple para el ancho de las estrellas llenas
        return `
          <div class="stars-container">
            <div class="stars-background"></div>
            <div class="stars-foreground" style="width: ${fullStarWidth}%;"></div>
          </div>
          <span class="rating-value">${rating}</span>
        `;
      };

    const [selectedPlace, setSelectedPlace] = useState(null);

    useEffect(() => {
        const place = localStorage.getItem('selectedPlace');
        if (place) {
            setSelectedPlace(JSON.parse(place));
        }
        console.log(place)

    }, []);

    if (!selectedPlace) {
        return <div>No place selected</div>;
    }

    return (
        <div className="paginainterna">
            <div className="tituloboton">
                <button className="botonatras" onClick={()=>router.back()}>x</button>
                <h1>{name}</h1>
            </div>
            <p className="datos">{vicinity}</p>
            <p className="datos">{estrellas}</p>
            
            {selectedPlace && (
                <img className="imgpage" src={selectedPlace} alt={`Photo of ${selectedPlace.name}`} />
            )}
        </div>
    );

};

export default Details;