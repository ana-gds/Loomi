import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieTrailer } from "./components/MovieTrailer";
import {MovieSummary} from "./components/MovieSummary.jsx";
import {MovieInfo} from "./components/MovieInfo.jsx";
import {MovieStreaming} from "./components/MovieStreaming.jsx";
import {MovieCast} from "./components/MovieCast.jsx";
import {Recommendations} from "./components/Recomendations.jsx";
import {MovieExtraInfo} from "./components/MovieExtraInfo.jsx";

import {getRelatedContent} from "../../api/trakt.js";
import { TMDB_API_KEY } from "../../api/tmdb";
import { getOMDbById } from "../../api/omdb.js";
import { getYoutubeTrailer } from "../../api/youtube.js";


export function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

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

    const [trailerKey, setTrailerKey] = useState(null);


    useEffect(() => {
        async function fetchTrailer() {
            // Primeiro tenta TMDB
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=pt-PT`
            );
            const data = await res.json();

            const trailer = data.results.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
            );

            if (trailer) {
                setTrailerKey(trailer.key);
                return;
            }

            // Se não encontrou, usar YouTube
            if (movie?.title) {
                const youtubeKey = await getYoutubeTrailer(movie.title);
                setTrailerKey(youtubeKey || null);
            }
        }

        fetchTrailer();
    }, [id, movie]);




    const [credits, setCredits] = useState(null);

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


    const [providers, setProviders] = useState(null);

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


    const [cast, setCast] = useState([]);

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

    const [related, setRelated] = useState([]);

    useEffect(() => {
        async function fetchRelated() {
            const data = await getRelatedContent(id); // usa a nova função
            setRelated(data);
        }

        fetchRelated();
    }, [id]);

    const [omdb, setOmdb] = useState(null);

    useEffect(() => {
        async function loadOMDb() {
            if (!movie?.imdb_id) return;
            const data = await getOMDbById(movie.imdb_id);
            setOmdb(data);
        }

        loadOMDb();
    }, [movie]);



    if (!movie) return <p>A carregar...</p>;

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
                    <MovieSummary overview={movie.overview} />
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
