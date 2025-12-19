import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getMovieDetails } from "../../../api/tmdb.js";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { SectionTitle } from "../../../components/ui/Title/SectionTitle.jsx";
import {PinkDiv} from "../../../components/ui/Divs/PinkDiv.jsx";

// Cache simples em memória por sessões para detalhes de filmes TMDB
const movieDetailsCache = new Map();

/**
 * Recommendations
 * Carrega detalhes TMDB dos filmes relacionados e exibe carrossel
  */

export function Recommendations({ related }) {
    // Estado local para filmes, loading e erro
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoriza os IDs TMDB a partir do prop `related` para evitar recálculos desnecessários
    const tmdbIdsMemo = useMemo(() => {
        if (!related || related.length === 0) return [];
        return [...new Set(
            related
                .map((r) => r?.ids?.tmdb)
                .filter((id) => typeof id === "number" || (typeof id === "string" && id.trim() !== ""))
        )];
    }, [related]);

    useEffect(() => {
        async function load() {
            // Reset estado
            setError(null);
            setMovies([]);

            const tmdbIds = tmdbIdsMemo;
            if (!tmdbIds || tmdbIds.length === 0) return;

            setLoading(true);
            try {
                // Faz fetch em lotes para evitar throttling (3 em 3)
                const batchSize = 3;
                const results = [];
                for (let i = 0; i < tmdbIds.length; i += batchSize) {
                    const batch = tmdbIds.slice(i, i + batchSize);
                    const batchResults = await Promise.all(
                        batch.map(async (id) => {
                            try {
                                // Cache simples em memória para evitar requests repetidos na mesma sessão
                                if (movieDetailsCache.has(id)) return movieDetailsCache.get(id);
                                const res = await getMovieDetails(id);
                                movieDetailsCache.set(id, res);
                                return res;
                            } catch (e) {
                                console.warn(`Falha a carregar TMDB ${id}:`, e);
                                return null;
                            }
                        })
                    );
                    results.push(...batchResults);
                }

                // Filtra nulos e assegura que cada item tem id ou título
                const valid = results.filter((m) => m && (m.id || m.title));
                setMovies(valid);
            } catch (e) {
                console.error("Erro ao carregar recomendações:", e);
                setError("Não foi possível carregar recomendações");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [related]);

    // Se não houver nada para mostrar, mantém comportamento anterior (não renderiza)
    if (!movies.length && !loading) return null;

    // Helper local para construir URL da poster
    const posterUrl = (m) => (m?.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "/default-poster.png");

    return (
        <div className="mt-16">
            <SectionTitle title="Recomendações com base neste filme" />
            <PinkDiv width={'w-40'}/>

            {/* Mensagem de loading/erro simples */}
            {loading && <p className="text-texto-secundario mt-2">A carregar recomendações...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="flex gap-6 overflow-x-auto pb-4 pt-2" role="list" aria-label="Recomendações">
                {movies.slice(0, 6).map((movie) => (
                    // Usa movie.id como preferência para o key
                    movie.id ? (
                        <Link key={movie.id} to={`/movie/${movie.id}`} className="flex-shrink-0" role="listitem">
                            <Card
                                title={movie.title}
                                rating={movie.vote_average ? movie.vote_average.toFixed(1) : undefined}
                                year={movie.release_date ? movie.release_date.slice(0, 4) : undefined}
                                poster={posterUrl(movie)}
                                ClassNames="cursor-pointer hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    ) : (
                        // Se não houver ID TMDB, mostra o card sem link 
                        <div key={movie.title || Math.random()} className="flex-shrink-0" role="listitem" aria-label={movie.title}>
                            <Card
                                title={movie.title}
                                rating={movie.vote_average ? movie.vote_average.toFixed(1) : undefined}
                                year={movie.release_date ? movie.release_date.slice(0, 4) : undefined}
                                poster={posterUrl(movie)}
                                ClassNames="opacity-80"
                            />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
