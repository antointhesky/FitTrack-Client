import React, { useRef, useState, useEffect } from 'react';

const Camera = ({ onPhotoUploaded }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [stream, setStream] = useState(null); 

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStream(stream); 
        }
      })
      .catch(err => {
        console.error("Error accessing the camera: ", err);
      });

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); // Stop all tracks
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video element
      }
    }
  };

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.error("Video or canvas element is missing.");
      return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    setHasPhoto(true);
  };

  const uploadPhoto = () => {
    const canvas = canvasRef.current;

    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'progress-snapshot.png');

      fetch('http://localhost:5050/upload', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Image uploaded:', data);
          setHasPhoto(false); // Reset after uploading
          onPhotoUploaded();  // Call the prop function to refresh the gallery
          stopCamera();       // Stop the camera stream after upload
        })
        .catch(error => console.error('Error uploading image:', error));
    }, 'image/png');
  };

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay className="camera-video"></video>
      <button onClick={takeSnapshot} className="camera-button">Take Snapshot</button>

      <canvas 
        ref={canvasRef} 
        className="camera-canvas" 
        style={{ display: hasPhoto ? 'block' : 'none' }}
      ></canvas>

      {hasPhoto && (
        <button onClick={uploadPhoto} className="camera-button">Upload Photo</button>
      )}
    </div>
  );
};

export default Camera;

