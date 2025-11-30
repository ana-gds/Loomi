import {NavBar} from "../components/sections/NavBar/NavBar.jsx";
import {HeroSearch} from "../components/sections/Hero/HeroSearch.jsx";
import {HomeSection} from "../components/sections/HomeSections/HomeSection.jsx";

export function Layout() {
    return (
        <>
            <NavBar/>
                <HeroSearch/>
                <HomeSection/>
        </>
    )
}