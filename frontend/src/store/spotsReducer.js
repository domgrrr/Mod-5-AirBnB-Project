const initialState = {
  spots: []
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SPOTS':
      return { ...state, spots: action.spots };
    default:
      return state;
  }
};

export default spotsReducer;