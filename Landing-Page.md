# List of All Spots

## Fetch The Spots Data
* Fetch data from the backend
  
  a.  Import the spotsReducer
  ```js
  import spotsReducer from './spotsReducer';
  ```

  b.  Add it to the rootReducer
  ```js
  const rootReducer = combineReducers({
    session: sessionReducer,
    spots: spotsReducer,  //  Add the spots reducer
    //  Add Reducers Here
  });
  ```

## Create The Spot Tile Component
* Create a component for the spot tile with required elements

## Style The Spot Tile Component
* Add styles to ensure the layout and element position is correct

## Display The Spots On The Landing Page
* Use the SpotTile component in landing page to list all spots

## Ensure Layout and Positioning to Wireframe