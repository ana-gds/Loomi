import { useEffect, useState } from "react";
import {Card} from "../../../components/ui/Card/Card.jsx";

// Componente que mostra os top 10 filmes da semana
export function HomeSection() {
    // Estado para armazenar a lista de filmes retornada pela API
    const [movies, setMovies] = useState([]);

    // useEffect executa a busca apenas uma vez ao montar o componente
    useEffect(() => {
        async function fetchTopMovies() {
            // Chamada à API do TMDB (a chave está hardcoded aqui; considere mover para variável de ambiente)
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/top_rated?api_key=d2f1f1157371618f6450aee1f2fd50b7&language=pt-PT&page=1`
            );
            const data = await res.json();
            // Atualiza o estado com os resultados (array de filmes)
            setMovies(data.results);
        }

        fetchTopMovies();
    }, []); // array de dependências vazio -> roda somente no mount

    return (
        <section className="ms-20 mt-16">
            <p className="section-title text-texto-principal">Top 10 da semana</p>
            <div className="w-40 h-1.5 bg-principal rounded-full mt-2 mb-8"></div>

            <div className="flex gap-6 overflow-x-scroll pb-4">
                {movies.slice(0, 10).map((movie) => (
                    <Card
                        key={movie.id}
                        title={movie.title}
                        rating={movie.vote_average.toFixed(1)} // avaliação com uma casa decimal
                        year={movie.release_date?.slice(0, 4)} // ano de lançameto
                        poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // URL do poster
                    />
                ))}
            </div>
        </section>
    );
}