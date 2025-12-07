import { useEffect, useState } from "react";
import {Card} from "../../../components/ui/Card/Card.jsx";
import {PinkDiv} from "../../../components/ui/Divs/PinkDiv.jsx";
import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";
import { Link } from "react-router-dom";
import { TMDB_API_KEY } from "../../../api/tmdb";



// Componente que mostra os top 10 filmes da semana
export function HomeSection() {
    // Estado para armazenar a lista de filmes retornada pela API
    const [movies, setMovies] = useState([]);

    // useEffect executa a busca apenas uma vez ao montar o componente
    useEffect(() => {
        async function fetchTopMovies() {
            // Chamada à API do TMDB
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-PT&page=1`
            );
            const data = await res.json();
            // Atualiza o estado com os resultados (array de filmes)
            setMovies(data.results);
        }

        fetchTopMovies();
    }, []); // array de dependências vazio -> roda somente no mount

    return (
        <section className="ms-20 mt-16">
            <SectionTitle title={'Top 10 da semana'}/>
            <PinkDiv/>
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