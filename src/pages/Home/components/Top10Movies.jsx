import { useEffect, useState } from "react";
import {Card} from "../../../components/ui/Card/Card.jsx";
import {PinkDiv} from "../../../components/ui/Divs/PinkDiv.jsx";
import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";
import { Link } from "react-router-dom";
import { fetchTopMovies } from "../../../api/tmdb.js";



// Componente que mostra os top 10 filmes da semana
export function Top10Movies() {
    // Estado para armazenar a lista de filmes retornada pela API
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function loadTopMovies() {
            try {
                const data = await fetchTopMovies();
                setMovies(data || []);
            } catch (error) {
                console.error("Erro ao carregar top filmes:", error);
            }
        }

        loadTopMovies();
    }, []);


    return (
        <section className="ms-20 mt-16">
            <SectionTitle title={'Top 10 da semana'}/>
            <PinkDiv width={'w-40'}/>
            <div className="flex gap-6 overflow-x-scroll pb-4 pt-2">
                {movies.slice(0, 10).map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <Card
                            title={movie.title}
                            rating={movie.vote_average.toFixed(1)}
                            year={movie.release_date?.slice(0, 4)}
                            poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            ClassNames={"hover:scale-105 transition-transform"}
                        />
                    </Link>
                ))}

            </div>
        </section>
    );
}