import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TMDB_API_KEY } from "../../api/tmdb";
import { SectionTitle } from "../../components/ui/Title/SectionTitle.jsx";
import { Card } from "../../components/ui/Card/Card.jsx";

export function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setMovies([]);
            return;
        }

        async function searchMovies() {
            setLoading(true);

            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pt-PT&query=${encodeURIComponent(
                        query
                    )}`
                );

                const data = await res.json();
                setMovies(data.results || []);
            } catch (err) {
                console.error("Erro na pesquisa:", err);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        }

        searchMovies();
    }, [query]);

    if (!query) return null;

    return (
        <div className="px-20 py-14">

            <SectionTitle title={`Resultados para "${query}"`} />

            {loading && (
                <p className="text-texto-secundario mt-6">A pesquisar...</p>
            )}

            {!loading && movies.length === 0 && (
                <p className="text-texto-secundario mt-6">
                    Nenhum resultado encontrado.
                </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 mt-10">
                {movies.map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <Card
                            title={movie.title}
                            rating={movie.vote_average?.toFixed(1)}
                            year={movie.release_date?.slice(0, 4)}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                    : "/default-poster.png"
                            }
                            ClassNames="hover:scale-105 transition-transform"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
