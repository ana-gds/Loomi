import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { PinkDiv } from "../../../components/ui/Divs/PinkDiv.jsx";
import { SectionTitle } from "../../../components/ui/Title/SectionTitle.jsx";
import { Link } from "react-router-dom";
import { getMoviesByGenre } from "../../../api/tmdb";
import defaultPoster from "../../../assets/imgs/default-movie.png";

/**
 * DocumentaryMovies
 * Mostra uma secção carrossel com documentários da TMDB (género ID 99).
 */


export function DocumentaryMovies() {
    const [movies, setMovies] = useState([]);

    // Carregar documentários
    useEffect(() => {
        async function fetchDocumentaryMovies() {
            try {
                // genre_id 99 = documentário
                const data = await getMoviesByGenre(99);
                // Extrair results ou usar array vazio se não existir
                setMovies(data?.results ?? []);
            } catch (err) {
                console.error("Erro ao carregar documentários:", err);
                setMovies([]);
            }
        }

        fetchDocumentaryMovies();
    }, []);


    return (
        <section className="ms-20 mt-16">
            <SectionTitle title="Documentários que valem a pena ver" />
            <PinkDiv width="w-40" />

            {/* Carrossel */}
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
