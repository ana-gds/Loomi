import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TMDB_API_KEY } from "../../api/tmdb";
import { SectionTitle } from "../../components/ui/Title/SectionTitle.jsx";
import { Card } from "../../components/ui/Card/Card.jsx";
import { PinkDiv } from "../../components/ui/Divs/PinkDiv.jsx";
import defaultPoster from "../../assets/imgs/default-movie.png";

/**
 * SearchResults
 * Pesquisa filmes na API TMDB com base no parâmetro `q` da URL.
 */

export function SearchResults() {
    const [searchParams] = useSearchParams();
    const rawQuery = searchParams.get("q");
    const query = rawQuery?.trim();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Se não tem query válida, limpa resultados e sai
        if (!query) {
            setMovies([]);
            setError(null);
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        // Debounce simples: só executa a busca 300ms depois da última mudança
        const timeout = setTimeout(() => {
            async function searchMovies() {
                setLoading(true);
                setError(null);

                try {
                    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pt-PT&query=${encodeURIComponent(
                        query
                    )}`;

                    const res = await fetch(url, { signal: controller.signal });

                    if (!res.ok) throw new Error(`TMDB responded ${res.status}`);

                    const data = await res.json();
                    if (!cancelled) setMovies(data.results || []);
                } catch (err) {
                    if (err.name === 'AbortError') {
                        // request cancelado — ignora
                        return;
                    }
                    console.error("Erro na pesquisa:", err);
                    if (!cancelled) {
                        setError("Erro ao pesquisar. Tenta novamente mais tarde.");
                        setMovies([]);
                    }
                } finally {
                    if (!cancelled) setLoading(false);
                }
            }

            searchMovies();
        }, 300);

        return () => {
            cancelled = true;
            controller.abort();
            clearTimeout(timeout);
        };
    }, [query]);

    // Se não existe query, não renderizar nada
    if (!query) return null;

    return (
        <div className="px-20 py-14">

            <SectionTitle title={`Resultados para "${query}"`} />
            <PinkDiv width={'w-40'}/>

            {loading && (
                <p className="text-texto-secundario mt-6">A pesquisar...</p>
            )}

            {error && (
                <p className="text-red-500 mt-6">{error}</p>
            )}

            {!loading && !error && movies.length === 0 && (
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
                            year={movie.release_date ? movie.release_date.slice(0, 4) : undefined}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                    : defaultPoster
                            }
                            ClassNames="hover:scale-105 transition-transform"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
