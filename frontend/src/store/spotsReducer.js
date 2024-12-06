import { csrfFetch } from "./csrf"

const SET_SPOTS = 'SET_SPOTS';
const SET_SINGLE_SPOT = 'SET_SINGLE_SPOT';
const SET_SPOT_REVIEWS = 'SET_SPOT_REVIEWS';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const SET_USER_SPOTS = 'spots/SET_USER_SPOTS';
const CREATE_REVIEW = 'spots/CREATE_REVIEW';
const DELETE_REVIEW = 'spots/DELETE_REVIEW';

// Action Creators
export const fetchSpotsAction = (spots) => ({
  type: SET_SPOTS,
  payload: spots
});

export const fetchSingleSpotAction = (spot) => ({
  type: SET_SINGLE_SPOT,
  payload: spot
});

export const setSingleSpotReviewsAction = (reviews) => ({
  type: SET_SPOT_REVIEWS,
  payload: reviews
});

export const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  payload: spot
});

export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId
});

export const setUserSpotsAction = (spots) => ({
  type: SET_USER_SPOTS,
  payload: spots
});

export const createReviewAction = (review) => ({
  type: CREATE_REVIEW,
  payload: review
});

export const deleteReviewAction = (reviewId, spotId) => ({
  type: DELETE_REVIEW,
  payload: { reviewId, spotId }
});

// Thunk Action Creators
export const fetchSpotsFunction = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots');
    if (!response.ok) {
      throw new Error('Failed to fetch spots');
    }
    const data = await response.json();
    dispatch(fetchSpotsAction(data.Spots));
    return data.Spots;
  } catch (error) {
    console.error('Error fetching spots:', error);
    throw error;
  }
};

export const fetchSingleSpotFunction = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch spot');
    }
    const data = await response.json();
    
    dispatch(fetchSingleSpotAction(data));
    
    // Fetch reviews separately
    try {
      const reviewResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
      const reviewData = await reviewResponse.json();
      dispatch(setSingleSpotReviewsAction(reviewData.Reviews));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      dispatch(setSingleSpotReviewsAction([]));
    }
    
    return { spot: data };
  } catch (error) {
    console.error('Error fetching spot:', error);
    throw error;
  }
};

export const createSpot = (spotData) => async (dispatch) => {
  try {
    // First, create the spot
    const spotResponse = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: parseFloat(spotData.latitude) || 0,
        lng: parseFloat(spotData.longitude) || 0,
        name: spotData.name,
        description: spotData.description,
        price: parseFloat(spotData.price)
      }),
    });

    if (!spotResponse.ok) {
      const error = await spotResponse.json();
      throw error;
    }

    const newSpot = await spotResponse.json();

    // Then, add the preview image
    if (spotData.previewImage) {
      const previewImageResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: spotData.previewImage,
          preview: true
        }),
      });
      
      if (!previewImageResponse.ok) {
        throw new Error('Failed to upload preview image');
      }
    }

    // Add additional images
    const additionalImages = [
      spotData.image1,
      spotData.image2,
      spotData.image3,
      spotData.image4
    ].filter(url => url.trim());

    for (let imageUrl of additionalImages) {
      const imageResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          preview: false
        }),
      });
      
      if (!imageResponse.ok) {
        console.warn(`Failed to upload additional image: ${imageUrl}`);
      }
    }

    // Fetch the complete spot data after all images are uploaded
    const finalSpotResponse = await csrfFetch(`/api/spots/${newSpot.id}`);
    const finalSpotData = await finalSpotResponse.json();

    if (!finalSpotData.SpotImages) {
      finalSpotData.SpotImages = [];
    }
    
    dispatch(createSpotAction(finalSpotData));
    return finalSpotData;
  } catch (error) {
    console.error('Error in createSpot:', error);
    throw error;
  }
};

export const getUserSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots/current');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user spots');
    }
    
    const data = await response.json();
    dispatch(setUserSpotsAction(data.Spots));
    return data.Spots;
  } catch (error) {
    console.error('Error fetching user spots:', error);
    throw error;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete spot');
    }

    dispatch(deleteSpotAction(spotId));
    return spotId;
  } catch (error) {
    console.error('Error deleting spot:', error);
    throw error;
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review: reviewData.review,
        stars: parseInt(reviewData.stars)
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create review');
    }

    const newReview = await response.json();
    
    // Fetch updated spot data to get new average rating
    const spotResponse = await csrfFetch(`/api/spots/${spotId}`);
    const updatedSpot = await spotResponse.json();
    
    // Fetch all reviews again to ensure correct order
    const reviewsResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const reviewsData = await reviewsResponse.json();

    dispatch(createReviewAction(newReview));
    dispatch(fetchSingleSpotAction(updatedSpot));
    dispatch(setSingleSpotReviewsAction(reviewsData.Reviews));
    
    return newReview;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const deleteReview = (reviewId, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete review');
    }

    // Fetch updated spot data to get new average rating
    const spotResponse = await csrfFetch(`/api/spots/${spotId}`);
    const updatedSpot = await spotResponse.json();
    
    // Fetch all reviews again to ensure correct order
    const reviewsResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const reviewsData = await reviewsResponse.json();

    dispatch(deleteReviewAction(reviewId, spotId));
    dispatch(fetchSingleSpotAction(updatedSpot));
    dispatch(setSingleSpotReviewsAction(reviewsData.Reviews));
    
    return reviewId;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Initial State
const initialState = {
  spots: [],
  spot: null,
  spotReviews: []
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { 
        ...state, 
        spots: action.payload 
      };
    case SET_SINGLE_SPOT:
      return { 
        ...state, 
        spot: {
          ...action.payload,
          SpotImages: action.payload.SpotImages || []
        }
      };
    case SET_SPOT_REVIEWS:
      return { 
        ...state, 
        spotReviews: action.payload || [] 
      };
    case CREATE_SPOT:
      return { 
        ...state, 
        spots: [...state.spots, action.payload],
        spot: {
          ...action.payload,
          SpotImages: action.payload.SpotImages || []
        }
      };
    case SET_USER_SPOTS:
      return { 
        ...state, 
        spots: action.payload || [] 
      };
    case DELETE_SPOT:
      return {
        ...state,
        spots: state.spots.filter(spot => spot.id !== action.payload),
        spot: state.spot?.id === action.payload ? null : state.spot
      };
    case CREATE_REVIEW:
      return {
        ...state,
        spotReviews: [action.payload, ...state.spotReviews]
      };
    case DELETE_REVIEW:
      return {
        ...state,
        spotReviews: state.spotReviews.filter(
          review => review.id !== action.payload.reviewId
        )
      };
    default:
      return state;
  }
};

export default spotsReducer;