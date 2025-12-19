import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { PinkDiv } from "../../../components/ui/Divs/PinkDiv.jsx";
import { SectionTitle } from "../../../components/ui/Title/SectionTitle.jsx";
import { Link } from "react-router-dom";
import { getMoviesByGenre } from "../../../api/tmdb";
import defaultPoster from "../../../assets/imgs/default-movie.png";

/**
 * RomanceMovies
 * Mostra uma secção carrossel com filmes de romance da TMDB (género ID 10749).
 */
export function RomanceMovies() {
    const [movies, setMovies] = useState([]);

    // Carregar filmes de romance quando o componente monta
    useEffect(() => {
        async function fetchRomanceMovies() {
            try {
                // genre_id 10749 = romance
                const data = await getMoviesByGenre(10749);
                // Extrair results ou usar array vazio se não existir
                setMovies(data?.results ?? []);
            } catch (err) {
                console.error("Erro ao carregar filmes de romance:", err);
                setMovies([]);
            }
        }

        fetchRomanceMovies();
    }, []);


    return (
        <section className="ms-20 mt-16">
            <SectionTitle title="Filmes para te apaixonares" />
            <PinkDiv width="w-40" />

            {/* Carrossel horizontal com scroll; renderiza até 10 filmes de romance */}
            <div className="flex gap-6 overflow-x-scroll pb-4 pt-2">
                {movies.slice(0, 10).map(movie => (
                    // Link para página de detalhes do filme
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <Card
                            title={movie.title}
                            rating={movie.vote_average?.toFixed(1)}
                            year={movie.release_date?.slice(0, 4)}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : defaultPoster
                            }
                            ClassNames="hover:scale-105 transition-transform"
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
}
