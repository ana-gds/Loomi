import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { PinkDiv } from "../../../components/ui/Divs/PinkDiv.jsx";
import { SectionTitle } from "../../../components/ui/Title/SectionTitle.jsx";
import { Link } from "react-router-dom";
import { getMoviesByGenre } from "../../../api/tmdb";
import defaultPoster from "../../../assets/imgs/default-movie.png";


export function DocumentaryMovies() {
    const [movies, setMovies] = useState([]);


    useEffect(() => {
        async function fetchDocumentaryMovies() {
            const data = await getMoviesByGenre(99);
            setMovies(data?.results ?? []);
            console.log(data);

        }

        fetchDocumentaryMovies();
    }, []);


    return (
        <section className="ms-20 mt-16">
            <SectionTitle title="Documentários que valem a pena ver" />
            <PinkDiv width="w-40" />

            <div className="flex gap-6 overflow-x-scroll pb-4 pt-2">
                {movies.slice(0, 10).map(movie => (
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <Card
                            title={movie.title}
                            rating={movie.vote_average?.toFixed(1)}
                            year={movie.release_date?.slice(0, 4)}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : defaultPoster
                            }
                            ClassNames="hover:scale-105 transition-transform"
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
}
