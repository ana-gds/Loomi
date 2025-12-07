import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieTrailer } from "./components/MovieTrailer";
import {MovieSummary} from "./components/MovieSummary.jsx";
import {MovieInfo} from "./components/MovieInfo.jsx";
import {MovieStreaming} from "./components/MovieStreaming.jsx";
import {MovieCast} from "./components/MovieCast.jsx";
import {getRelatedContent} from "../../api/trakt.js";
import {Recommendations} from "./components/Recomendations.jsx";
import { TMDB_API_KEY } from "../../api/tmdb";


export function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [credits, setCredits] = useState(null);
    const [providers, setProviders] = useState(null);
    const [cast, setCast] = useState([]);
    const [related, setRelated] = useState([]);


    useEffect(() => {
        async function fetchMovie() {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-PT`
            );
            const data = await res.json();
            setMovie(data);
        }

        fetchMovie();
    }, [id]);

    useEffect(() => {
        async function fetchTrailer() {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=pt-PT`
            );

            const data = await res.json();

            // encontrar um trailer do YouTube
            const trailer = data.results.find(
                (video) =>
                    video.type === "Trailer" &&
                    video.site === "YouTube"
            );

            setTrailerKey(trailer?.key || null);
        }

        fetchTrailer();
    }, [id]);


    useEffect(() => {
        async function fetchCredits() {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=pt-PT`
            );
            const data = await res.json();
            setCredits(data);
        }

        fetchCredits();
    }, [id]);

    useEffect(() => {
        async function fetchProviders() {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`
                );
                const data = await res.json();
                setProviders(data);
            } catch (err) {
                console.error("Erro ao carregar providers:", err);
            }
        }

        fetchProviders();
    }, [id]);


    useEffect(() => {
        async function fetchMovie() {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-PT`
            );
            const data = await res.json();
            setMovie(data);
        }

        async function fetchCast() {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=pt-PT`
            );
            const data = await res.json();
            setCast(data.cast);
        }

        fetchMovie();
        fetchCast();
    }, [id]);

    useEffect(() => {
        async function fetchRelated() {
            const data = await getRelatedContent(id); // usa a nova função
            setRelated(data);
        }

        fetchRelated();
    }, [id]);



    if (!movie) return <p>A carregar...</p>;

    return (
        <>
            <MovieTrailer
                backdrop={movie.backdrop_path}
                title={movie.title}
                rating={movie.vote_average}
                trailerKey={trailerKey}
            />

            <div className="px-20 mt-20 grid grid-cols-10 items-start">
                <div className="col-span-3">
                <MovieInfo movie={movie} credits={credits} />
                </div>
                <div className="col-span-7 ps-12">
                <MovieSummary overview={movie.overview} />
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
