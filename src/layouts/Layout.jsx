import { Outlet } from "react-router-dom";
import { NavBar } from "../components/sections/NavBar/NavBar.jsx";

export function Layout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}
