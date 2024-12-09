import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import * as sessionActions from "./store/session";
import LandingPage from "./components/LandingPage/LandingPage";
import SpotDetail from "./components/SpotDetail/SpotDetail";
import Header from "./components/Header/Header";
import CreateSpotForm from "./components/CreateSpot/CreateSpotForm";
import ManageSpots from "./components/ManageSpots"; // Add this import

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Header isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/spots/new",
        element: <CreateSpotForm />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetail />,
      },
      {
        path: "/spots/current", 
        element: <ManageSpots />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;