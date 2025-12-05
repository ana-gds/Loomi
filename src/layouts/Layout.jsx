import {NavBar} from "../components/sections/NavBar/NavBar.jsx";
import {HeroSearch} from "../pages/Home/components/HeroSearch.jsx";
import {HomeSection} from "../pages/Home/components/HomeSection.jsx";

export function Layout() {
    return (
        <>
            <NavBar/>
                <HeroSearch/>
                <HomeSection/>
        </>
    )
}