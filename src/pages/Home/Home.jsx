import { HeroSearch } from "./components/HeroSearch.jsx";
import { Top10Movies } from "./components/Top10Movies.jsx";
import {RecommendedForYou} from "./components/RecommendedForYou.jsx";
import {RomanceMovies} from "./components/RomanceMovies.jsx";
import {DocumentaryMovies} from "./components/DocumentaryMovies.jsx";

export function Home() {
    return (
        <>
            <HeroSearch />
            <Top10Movies />
            <RecommendedForYou/>
            <RomanceMovies/>
            <DocumentaryMovies/>
        </>
    );
}
