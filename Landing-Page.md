# Feature 1 List of All Spots

## 1. Fetch The Spots Data
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

## 2. Create The Spot Tile Component
* Create a component for the spot tile with required elements

  a.  Create new folder in the frontend/src/components/ named SpotTile

  b.  Create a file in the SpotTile folder called SpotTile.jsx

  c.  In the jsx file create 3 different import statements to import React, Link from react-router, and css styling, once created

  ```js
  import React from 'react';
  import { Link } from 'react-router-dom';
  import './SpotTile.css';
  ```

  d.  Define the component function called SpotTile, which takes a spot prop
  ```js
  const SpotTile = ({ spot }) => {}
  ```
  e.  Use a return statement inside the function to return the JSX to be rendered. Inside the return statement we need a:
  
  * div with the class of spot-tile for styling

  * A link inside that div to navigate to the spot's detail page, with a tooltip showing the spots name

  * Inside that link an image element displaying the spot's thumbnail

  * Another div inside the link with the class of spot-info for the spot's information

  * A div inside spot-info with the class of spot-location to display the city and state from the spot prop

  * Another div inside spot-info with the class of spot-rating to display the spot's rating

  * Another div inside spot-info with the class of spot-price to display the spot's price

  f.  Use an export statement to export SpotTile component to be used in other parts of the app
  ```js
  export default SPotTile;
  ```


## 3. Style The Spot Tile Component
* Add styles to ensure the layout and element position is correct

## 4. Display The Spots On The Landing Page
* Use the SpotTile component in landing page to list all spots

  a.  Create a new folder in frontend/src/components/ named LandingPage

  b.  Create a file in the LandingPage folder called LandingPage.jsx

  c.  Use 5 different import statements to import React and useEffect hook from the React library, hooks from React Redux to interact with the Redux store, fetchSpots action creator from the spots reducer, the SpotTile component, and css styling, once created
  ```js
  import React, { useEffect } from 'react';
  import { useSelector, useDispatch } from 'react-redux';
  import { fetchSpots } from '../store/spotsReducer';
  import SpotTile from './SpotTile/SpotTile';
  import './LandingPage.css';
  ```

  d.  Define a component function called LandingPage
  ```js
  const LandingPage = () => {};
  ```

  e.  Inside the LandingPage function create a dispatch function to dispatch actions to the Redux store
  ```js
  const dispatch = useDispatch();
  ```

  f.  Select the spots data from the Redux store using useSelector
  ```js
  const spots = useSelector((state) => state.spots);
  ```

  g.  Inside the LandingPage function create a useEffect hook to perform side effects in the component
  ```js
  useEffect(() => {});
  ```

  h.  Inside the useEffect hook use the fetchSpots action to fetch the spots data from the backend
  ```js
  dispatch(fetchSpots());
  ```

  j.  Make sure to leave an empty dependency array, so it runs only once when the component mounts
  ```js
  useEffect (() => {/*insert dispatch here*/}, []);
  ```

  k.  Inside the LandingPage function, after the useEffect hook use a return statement to return the JSX to be rendered. Inside we need a:

    * div with the class of landing-page for styling

    * Inside that div we need a heading for the landing page

    * Also inside that div we need another div with the class of spots-list for the list of spots
    
    * Inside that div we want to map over the spots array to render a SpotTile for each spot and render a SpotTile component, passing the spot as a prop

  l.  Use an export statement to export the LandingPage component to be used in other parts of the app


## 5. Ensure Layout and Positioning to Wireframe