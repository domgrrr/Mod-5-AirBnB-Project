import { csrfFetch } from "./csrf"

const SET_SPOTS = 'SET_SPOTS';
const SET_SINGLE_SPOT = 'SET_SINGLE_SPOT';
const SET_SPOT_REVIEWS = 'SET_SPOT_REVIEWS';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const SET_USER_SPOTS = 'spots/SET_USER_SPOTS';

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

export const fetchSpotsFunction = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();
  dispatch(fetchSpotsAction(data.Spots));
};

export const fetchSingleSpotFunction = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();
    dispatch(fetchSingleSpotAction(data));
    
    const reviewResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const reviewData = await reviewResponse.json();
    dispatch(setSingleSpotReviewsAction(reviewData.Reviews));
    
    return { spot: data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spotData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const newSpot = await response.json();
  dispatch(createSpotAction(newSpot));
  return newSpot;
};

export const getUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  
  const data = await response.json();
  dispatch(setUserSpotsAction(data.Spots));
  return data.Spots;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  dispatch(deleteSpotAction(spotId));
};

// Initial State
const initialState = {
  spots: [],
  spot: null,
  spotReviews: []
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, spots: action.payload };
    case SET_SINGLE_SPOT:
      return { ...state, spot: action.payload || {} };
    case SET_SPOT_REVIEWS:
      return { ...state, spotReviews: action.payload };
    case CREATE_SPOT:
      return { 
        ...state, 
        spots: [...state.spots, action.payload],
        spot: action.payload 
      };
    case SET_USER_SPOTS:
      return { ...state, spots: action.payload };
    case DELETE_SPOT:
      return {
        ...state,
        spots: state.spots.filter(spot => spot.id !== action.payload),
        spot: null
      };
    default:
      return state;
  }
};

export default spotsReducer;