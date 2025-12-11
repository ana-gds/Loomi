import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovieDetails } from "../../../api/tmdb.js";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { SectionTitle } from "../../../components/ui/Title/SectionTitle.jsx";

export function Recommendations({ related }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function load() {
            if (!related || related.length === 0) return;

            const tmdbIds = [...new Set(related.map((r) => r.ids.tmdb))];

            const results = await Promise.all(
                tmdbIds.map(async (id) => {
                    try {
                        return await getMovieDetails(id);
                    } catch {
                        return null;
                    }
                })
            );

            setMovies(results.filter(Boolean));
        }

        load();
    }, [related]);

    if (!movies.length) return null;

    return (
        <div className="mt-16">
            <SectionTitle title="Recomendações com base neste filme" />

            <div className="flex gap-6 overflow-x-auto pb-4 pt-2">
                {movies.slice(0, 6).map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
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
