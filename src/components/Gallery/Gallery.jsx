import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL;

const Gallery = ({ reload }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, [reload]);

  const fetchPhotos = () => {
    fetch(`${API_URL}/gallery`)
      .then((response) => response.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Error fetching gallery:", err));
  };

  const deletePhoto = (photoPath) => {
    fetch(`${API_URL}/delete-photo`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath: photoPath }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Image deleted:", data);
        fetchPhotos();
      })
      .catch((err) => console.error("Error deleting image:", err));
  };

  return (
    <div className="gallery__grid">
      {photos.length > 0 ? (
        photos.map((image, index) => (
          <div key={index} className="gallery__item">
            <img
              src={`${API_URL}${image}`}
              alt="Uploaded Snapshot"
              className="gallery-image"
            />
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
