import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Gallery = ({ reload }) => {  // Add reload prop here
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, [reload]);  // Add reload as dependency

  const fetchPhotos = () => {
    fetch('http://localhost:5050/gallery')
      .then(response => response.json())
      .then(data => setPhotos(data))
      .catch(err => console.error('Error fetching gallery:', err));
  };

  const deletePhoto = (photoPath) => {
    fetch(`http://localhost:5050/delete-photo`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath: photoPath }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Image deleted:', data);
        fetchPhotos(); 
      })
      .catch(err => console.error('Error deleting image:', err));
  };

  return (
    <div className="gallery__grid">
      {photos.length > 0 ? (
        photos.map((image, index) => (
          <div key={index} className="gallery__item">
            <img src={`http://localhost:5050${image}`} alt="Uploaded Snapshot" className="gallery-image" />
            <button 
              className="gallery__delete-button" 
              onClick={() => deletePhoto(image)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))
      ) : (
        <p>No photos to display yet.</p>
      )}
    </div>
  );
};

export default Gallery;





