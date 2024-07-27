import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Advertise from "./components/Advertise";
import AddAccount from "./components/AddAccount";
import RenderAds from "./components/RenderAds";
import AddLoyal from "./components/AddLoyal";
import UserOptions from "./components/UserOption";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/advertise",
    element: <Advertise />,
  },
  {
    path: "/addAccount",
    element: <AddAccount />,
  },
  {
    path: "/addloyal",
    element: <AddLoyal />,
  },
  {
    path: "/useroptions",
    element: <UserOptions />,
  },
  {
    path: "/:postid/:recepientId",
    element: <RenderAds />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
