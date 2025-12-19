import { HeroSearch } from "./components/HeroSearch.jsx";
import { Top10Movies } from "./components/Top10Movies.jsx";
import {RecommendedForYou} from "./components/RecommendedForYou.jsx";
import {RomanceMovies} from "./components/RomanceMovies.jsx";
import {DocumentaryMovies} from "./components/DocumentaryMovies.jsx";

/**
 * Home
 * Página inicial da aplicação.
 *
 * Secções:
 * 1. HeroSearch — barra de pesquisa
 * 2. Top10Movies — top 10 filmes da semana
 * 3. RecommendedForYou — recomendações personalizadas (baseadas em favoritos)
 * 4. RomanceMovies — filmes de romance
 * 5. DocumentaryMovies — documentários
 */

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
