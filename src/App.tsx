import { createBrowserRouter } from "react-router-dom";
import Layout from "./component/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import { RouterProvider } from "react-router-dom";
import Login from "./routes/login";
import Signin from "./routes/signin";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";


// router
const router = createBrowserRouter([
 {
		path: "/",
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Home/>,
      },
      {
        path: "profile",
        element: <Profile/>,
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signin",
    element: <Signin/>,
  }
])


// global styles
const GlobalSytles = createGlobalStyle`
  ${reset}; //styled-reset
  *{
    box-sizing: border-box;
  }
  
  body{
    background-color: #f8f9fa;
    color:#2a2a2a;
    font-family: 'Noto Sans KR', sans-serif, system-ui;
  }
`;

function App() {
  return(
    <>
      <GlobalSytles/>
      <RouterProvider router={router}/>
    </>
  ) 
}

export default App
