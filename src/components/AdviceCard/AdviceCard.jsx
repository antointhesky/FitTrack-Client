import React from 'react';
import './AdviceCard.scss';

const AdviceCard = ({ title, description, linkUrl }) => {
  return (
    <div className="advice-card">
      <div className="advice-card__background"></div> 
      <div className="advice-card__foreground"> 
        <div className="advice-card__content">
          <h3 className="advice-card__title">{title}</h3>
          <p className="advice-card__description">{description}</p>
          <a href={linkUrl} className="advice-card__link">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdviceCard;


