# Feature 2 View Spot Details

## 1. Create The Spot Detail Component
* Create a component for the spot detail page with required elements

  a.  Create new folder in the frontend/src/components/ named SpotDetail

  b.  Create a file in the SpotDetail folder called SpotDetail.jsx

  c.  Create a file in the SpotDetail folder called SpotDetail.css

  d.  In the jsx file use 4 import statements to import React, useSelector, useParams and css
  ```js
  import React from 'react';
  import { useSelector } from 'react-redux';
  import { useSelector } from 'react-router-dom';
  import './SpotDetail.css';
  ```

  e.  Define a component function named SpotDetail
  ```js
  const SpotDetail = () => {}
  ```

  f.  Inside the SpotDetail function extract the spotId parameter from the URL using useParams
  ```js
  const { spotId } = useParams();
  ```

  g.  Inside the SpotDetail function, select the spot from the Redux store based on the spotId with useSelector
  ```js
  const spot = useSelector((state) => state.spots.spots.find(s => s.id === spotId));
  ```

  h.  Inside the SpotDetail function, check if the spot data is not yet loaded, if not loaded display a loading message until the spot data is available
  ```js
  if (!spot) {
    return <div>Loading...</div>;
  }
  ```

  i.  Inside the SpotDetail function, use a return statement that has the JSX to be rendered. Inside the return statement we need a:

    * div with the class of spot-detail for styling

      * Inside the div spot-detail we need an h1 to display the spot's name as a heading

      * Alongside that h1 we need another div with the class of location to display the spot's location

      * Alongside that h1 we need another div with the class of images to house the large image and the 4 smaller images

        * Inside the div images we need an image tag with the class of large-image to display the large image of the spot

        * Inside the div images we need another div with the class of small-images with some logic to map over the small images array to display each small image

          * We will use another image tag inside the div small-images to display each small image

      * Alongside the h1 we need another div with the class of hosted-by to display the host's first and last name

      * Alongside the h1 we need a paragraph element to display the spot's description

      * Alongside the h1 we need another div with the class of callout-box to house the spot's price per night

        * Inside the div callout-box we need another div with the class of price to display the spot's price per night

        * Inside the div callout-box we also need a button to to show an alert when clicked

  j.  Use an export statement to export the SpotDetail component to be used in other parts of the app
  ```js
  export default SpotDetail;
  ```



## 2. Update the Router
* In app.jsx use an import statement to import SpotDetail
```js
  import SpotDetail from './components/SpotDetail/SpotDetail';
```

* In app.jsx add a route for SpotDetail
```js
  {
    path: '/spots/:spotId',
    element: <SpotDetail />,
  }
```
