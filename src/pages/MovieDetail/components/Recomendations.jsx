import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { getMovieDetails } from "../../../api/tmdb.js";
import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";
import {PinkDiv} from "../../../components/ui/Divs/PinkDiv.jsx";

export function Recommendations({ related }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function loadRecommendedMovies() {
            if (!related || related.length === 0) return;

            // 1) apanhar só os IDs TMDb válidos
            const ids = related
                .map((item) => item.ids?.tmdb)
                .filter(Boolean);

            // 2) remover duplicados (Set)
            const uniqueIds = [...new Set(ids)];

            // 3) buscar detalhes de cada filme
            const results = await Promise.all(
                uniqueIds.map(async (id) => {
                    try {
                        const movie = await getMovieDetails(id);
                        return movie;
                    } catch (e) {
                        console.error("Erro a carregar filme recomendado", id, e);
                        return null;
                    }
                })
            );

            // 4) filtrar nulos
            setMovies(results.filter(Boolean));
        }

        loadRecommendedMovies();
    }, [related]);

    if (movies.length === 0) return null;

    return (
        <div className="mt-16">
            <SectionTitle title={'Recomendações com base neste título'}/>
            <PinkDiv/>
            <div className="flex gap-6 overflow-x-auto pb-4 pt-2">
                {movies.slice(0, 12).map((movie, index) => (
                    <Link key={`${movie.id}-${index}`} to={`/movie/${movie.id}`}>
                        <Card
                            title={movie.title}
                            rating={movie.vote_average?.toFixed(1)}
                            year={movie.release_date?.slice(0, 4)}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "/default-poster.png"
                            }
                            ClassNames="cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
