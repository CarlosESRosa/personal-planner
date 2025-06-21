import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Tasks from "../pages/Tasks";
import NewTask from "../pages/NewTask";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import StyleGuide from "../pages/StyleGuide";

export const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/tarefas" replace /> },
    { path: "/login", element: <Login /> },
    { path: "/cadastro", element: <Register /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: "/tarefas", element: <Tasks /> },
            { path: "/nova-tarefa", element: <NewTask /> },
            { path: "/perfil", element: <Profile /> },
        ],
    },
    { path: "/styleguide", element: <StyleGuide /> },
    { path: "*", element: <NotFound /> },
]);