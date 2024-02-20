import { createBrowserRouter } from "react-router-dom";
import Layout from "./component/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import { RouterProvider } from "react-router-dom";
import Login from "./routes/login";
import Signin from "./routes/signin";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect } from "react";
import Loading from "./component/loading";
import { useState } from "react";

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

  // firebase가 사용자를 확인하는 동안 loading을 걸어둠
  const [isLoading, setLoading] = useState(true);
  const init = async() => {
    // wait for firebase
    setLoading(false);
    //setTimeout(() => setLoading(false), 2000);
  };

  useEffect(() => {
    init();
  }, []);

  return(
    <>
      <GlobalSytles/>
      {isLoading ? <Loading/> : <RouterProvider router={router}/>}      
    </>
  ) 
}

export default App
