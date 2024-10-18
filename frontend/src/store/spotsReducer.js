import { csrfFetch } from "./csrf"

export const fetchSpotsAction = (spots) => {
  return {type:'SET_SPOTS', payload:spots}
}

export const fetchSpotsFunction = () => {
  return (dispatch) => {
    csrfFetch('/api/spots').then(response => response.json()).then(data => dispatch(fetchSpotsAction(data.Spots)))
  }
}

export const fetchSingleSpotAction = (spot) => {
  return {type: 'SET_SINGLE_SPOT', payload: spot};
}

export const setSingleSpotReviewsAction = (reviews) => {
  return {type: 'SET_SPOT_REVIEWS', payload: reviews};
}

export const fetchSingleSpotFunction = (spotId) => {
  return async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}`);
      const data = await response.json();
      
      dispatch(fetchSpotsAction(data));
      
      const reviewResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
      const reviewData = await reviewResponse.json();
      
      dispatch(setSingleSpotReviewsAction(reviewData.Reviews));
      return {spot: data};

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const initialState = {
  spots: [], spot: null
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SPOTS':
      return { ...state, spots: action.payload };
    case 'SET_SINGLE_SPOT':
      return { ...state, spot: action.payload || {} };
    default:
      return state;
  }
};

export default spotsReducer;