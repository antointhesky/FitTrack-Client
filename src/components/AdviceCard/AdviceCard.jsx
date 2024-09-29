import React from 'react';
import './AdviceCard.scss';

const AdviceCard = ({ title, description, linkUrl }) => {
  return (
    <div className="advice-card-container">
      <div className="advice-card advice-card--grey"></div> {/* Background grey card */}
      <div className="advice-card advice-card--white"> {/* Overlapping white card */}
        <div className="advice-card__content">
          <h3>{title}</h3>
          <p>{description}</p>
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="advice-card__link">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdviceCard;

