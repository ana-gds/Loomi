import { useEffect, useState } from "react";
import {Card} from "../../../components/ui/Card/Card.jsx";
import {PinkDiv} from "../../../components/ui/Divs/PinkDiv.jsx";
import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";
import { Link } from "react-router-dom";
import { fetchTopMovies } from "../../../api/tmdb.js";
import defaultPoster from "../../../assets/imgs/default-movie.png";

/**
 * Top10Movies
 * Mostra uma secção carrossel com os top 10 filmes da semana da TMDB.
 */

export function Top10Movies() {
    // Estado para armazenar a lista de filmes retornada pela API
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function loadTopMovies() {
            try {
                const data = await fetchTopMovies();
                // Usar array vazio se a resposta for null/undefined
                setMovies(data || []);
            } catch (error) {
                console.error("Erro ao carregar top filmes:", error);
                setMovies([]);
            }
        }

        loadTopMovies();
    }, []);


    return (
        <section className="ms-20 mt-16">
            <SectionTitle title={'Top 10 da semana'}/>
            <PinkDiv width={'w-40'}/>
            {/* Carrossel horizontal com scroll; renderiza até 10 filmes mais populares */}
            <div className="flex gap-6 overflow-x-scroll pb-4 pt-2">
                {movies.slice(0, 10).map((movie) => (
                    // Link para página de detalhes do filme
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <Card
                            title={movie.title}
                            rating={movie.vote_average?.toFixed(1) ?? "N/A"}
                            year={movie.release_date?.slice(0, 4)}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : defaultPoster
                            }
                            ClassNames={"hover:scale-105 transition-transform"}
                        />
                    </Link>
                ))}

            </div>
        </section>
    );
}