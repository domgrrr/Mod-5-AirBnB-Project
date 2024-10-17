import React from 'react';
import { Link } from 'react-router-dom';
import './SpotTile.css';

const SpotTile = ({ spot }) => {
  return (
    <div className="spot-tile">
      <Link to={`/spots/${spot.id}`} title={spot.name}>
        <img src={spot.thumbnail} alt={`${spot.name} thumbnail`} className="spot-thumbnail" />
        <div className="spot-info">
          <div className="spot-location">
            {spot.city}, {spot.state}
          </div>
          <div className="spot-rating">
            {spot.reviews.length > 0 ? spot.averageRating.toFixed(1) : 'New'}
          </div>
          <div className="spot-price">
            ${spot.price} / night
          </div>
        </div>
      </Link>
    </div>
  )
};

export default SpotTile;