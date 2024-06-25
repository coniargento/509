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
    const rating = useSearchParams().get('rating')
    const reviews = useSearchParams().get('reviews')



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
            <p className="datos">{rating}</p>
            <p className="datos">{reviews}</p>

            {selectedPlace && (
                <img src={selectedPlace} alt={`Photo of ${selectedPlace.name}`} />
            )}
        </div>
    );

};

export default Details;