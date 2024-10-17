## Application Header

# 1. Browser Tab Settings
* Set the app name and favicon in index.html

  a.  Set the title of the webpage, which appears on the browser tab
  ```html
    <title>AirBnB</title>
  ```

  b.  Link the favicon
  ```html
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  ```

# 2.  Application Header Component
* Create a header component that includes logo and handles redirection and positioning

  a.  Create a new folder in frontend/src/components called Header

  b.  In the Header folder create a new file called Header.jsx

  c.  In the Header folder create a new file called Header.css

  d.  Use 3 import statements to import React, Link, and css
  ```js
    import React from 'react';
    import { Link } from 'reaft-router'dom';
    import './Header.css';
  ```

  e.  Create a component function called Header
  ```js
    const Header = () => {}
  ```

  f.  Inside the Header function use a return statement to return the jsx to be rendered

    * Inside the return statement we need a header element with a class of header for styling

    * Inside that header we need a link with a class of logo-link to create a clickable link that navigates to the home page

    * Inside that link we need an image element with the class of logo to display the logo image

    * Alongside the link class