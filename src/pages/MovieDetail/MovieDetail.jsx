import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieTrailer } from "./components/MovieTrailer";
import { MovieSummary } from "./components/MovieSummary.jsx";
import { MovieInfo } from "./components/MovieInfo.jsx";
import { MovieStreaming } from "./components/MovieStreaming.jsx";
import { MovieCast } from "./components/MovieCast.jsx";
import { Recommendations } from "./components/Recomendations.jsx";
import { MovieExtraInfo } from "./components/MovieExtraInfo.jsx";

import { getRelatedContent } from "../../api/trakt.js";
import { getMovieDetails, getMovieVideos, getMovieCredits, getMovieProviders } from "../../api/tmdb";
import { getOMDbById } from "../../api/omdb.js";
import { getYoutubeTrailer } from "../../api/youtube.js";

/**
 * Pagina de detalhes de um filme
 * Carrega dados de multiplas APIs (TMDB, OMDB, Trakt, YouTube)
 * Exibe: trailer, sinopse, elenco, streaming, recomendacoes
 */

export function MovieDetail() {
    const { id } = useParams(); // ID do filme da URL

    // ========== ESTADO ==========
    const [movie, setMovie] = useState(null); // Dados do filme
    const [trailerKey, setTrailerKey] = useState(null); // Chave do trailer YouTube
    const [credits, setCredits] = useState(null); // Elenco e crew do filme
    const [providers, setProviders] = useState(null); // Plataformas de streaming
    const [cast, setCast] = useState([]); // Array de atores
    const [omdb, setOmdb] = useState(null); // Dados OMDB (rating, premios)
    const [related, setRelated] = useState([]); // Filmes recomendados
    const [finalOverview, setFinalOverview] = useState(null); // Sinopse
    const [error, setError] = useState(null); // Erro de carregamento

    // EFEITO 1: Carregar dados principais do filme
    useEffect(() => {
        async function fetchMovieData() {
            try {
                const data = await getMovieDetails(id);
                setMovie(data);
            } catch (err) {
                console.error("Erro ao carregar filme:", err);
                setError("Nao foi possivel carregar o filme");
            }
        }

        fetchMovieData();
    }, [id]);

    // EFEITO 2: Carregar trailer
    useEffect(() => {
        async function fetchTrailer() {
            if (!id || !movie?.title) return;

            try {
                // Primeiro tenta TMDB
                const data = await getMovieVideos(id);

                const trailer = data.results?.find(
                    (video) => video.type === "Trailer" && video.site === "YouTube"
                );

                if (trailer) {
                    setTrailerKey(trailer.key);
                    return;
                }

                // Se nao encontrou, usar YouTube API
                const youtubeKey = await getYoutubeTrailer(movie.title);
                setTrailerKey(youtubeKey || null);
            } catch (err) {
                console.error("Erro ao carregar trailer:", err);
            }
        }

        fetchTrailer();
    }, [id, movie?.title]);

    // EFEITO 3: Carregar creditos e elenco
    useEffect(() => {
        async function fetchCreditsData() {
            if (!id) return;

            try {
                const data = await getMovieCredits(id);
                setCredits(data);
                setCast(data.cast || []);
            } catch (err) {
                console.error("Erro ao carregar creditos:", err);
            }
        }

        fetchCreditsData();
    }, [id]);

    // EFEITO 4: Carregar plataformas de streaming
    useEffect(() => {
        async function fetchProviders() {
            if (!id) return;

            try {
                const data = await getMovieProviders(id);
                setProviders(data);
            } catch (err) {
                console.error("Erro ao carregar providers:", err);
            }
        }

        fetchProviders();
    }, [id]);

    // EFEITO 5: Carregar filmes relacionados
    useEffect(() => {
        async function fetchRelated() {
            if (!id) return;

            try {
                const data = await getRelatedContent(id);
                setRelated(data || []);
            } catch (err) {
                console.error("Erro ao carregar recomendacoes:", err);
            }
        }

        fetchRelated();
    }, [id]);

    // EFEITO 6: Carregar dados OMDB (rating, premios)
    useEffect(() => {
        async function loadOMDb() {
            if (!movie?.imdb_id) return;

            try {
                const data = await getOMDbById(movie.imdb_id);
                setOmdb(data);
            } catch (err) {
                console.error("Erro ao carregar OMDB:", err);
            }
        }

        loadOMDb();
    }, [movie?.imdb_id]);

    // EFEITO 7: Resolver sinopse (TMDB > null)
    useEffect(() => {
        async function resolveOverview() {
            if (!movie?.title) return;

            if (movie.overview && movie.overview.trim().length > 20) {
                setFinalOverview(movie.overview);
            } else {
                setFinalOverview(null);
            }
        }

        resolveOverview();
    }, [movie?.title, movie?.overview]);

    if (error) {
        return <p className="text-red-500 p-10">{error}</p>;
    }

    if (!movie) {
        return <p className="text-center p-10">A carregar...</p>;
    }

    return (
        <>
            <MovieTrailer
                backdrop={movie.backdrop_path}
                title={movie.title}
                rating={omdb?.imdbRating}
                trailerKey={trailerKey}
                movieId={movie.id}
                movieTitle={movie.title}
                moviePoster={movie.poster_path}
            />

            <div className="px-20 mt-20 grid grid-cols-10 items-stretch">
                <div className="col-span-3">
                    <MovieInfo movie={movie} credits={credits} />
                </div>

                <div className="col-span-7 ps-12 flex flex-col justify-between h-full">
                    <MovieSummary overview={finalOverview} />
                    <MovieExtraInfo omdb={omdb} />
                </div>
            </div>

            <div className="px-20 mt-10 mb-20">
                <MovieCast cast={cast} />
            </div>

            <div className="px-20 mt-10 mb-20">
                <MovieStreaming providers={providers} />
            </div>

            <div className="px-20 mt-10 mb-20">
                <Recommendations related={related} />
            </div>
        </>
    );
}
