import { createBrowserRouter } from "react-router-dom";
import { Login, Register, Home } from "@pages/index";
import Root from "./root";
import NotFound from "./404";

const router = createBrowserRouter([
    {
        path: '/AsyStorage',
        element: <Root />,
        errorElement: <NotFound />,
        
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path:"login",
                element: <Login />
            }
        ]
    },
]);

export { router };