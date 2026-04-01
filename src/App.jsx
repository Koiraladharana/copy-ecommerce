import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MovieApp from './Movie'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children:[{
        path: "/",
        element: <Home />
    }]
  },

  {path: "signup", element:<Signup />},
  {path: "login", element:<Login />},
  {path: "*", element:<>Page Not Found</>},
  {path: "movie", element:<MovieApp />},
  

]);
function App(){
    return <RouterProvider router={router} />;
}

export default App;