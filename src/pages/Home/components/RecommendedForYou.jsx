import { useEffect, useState } from "react";
import { useAuth } from "../../../firebase/AuthContext";
import { getFavorites } from "../../../firebase/favorites";
import { SectionTitle } from "../../../components/ui/Title/SectionTitle.jsx";
import { PinkDiv } from "../../../components/ui/Divs/PinkDiv.jsx";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { Link } from "react-router-dom";
import { TMDB_API_KEY } from "../../../api/tmdb";
import { TRAKT_API_KEY } from "../../../api/trakt";

// 1. Converter TMDB ID → IDs próprios da Trakt
async function getTraktIdsFromTMDB(tmdbId) {
    const res = await fetch(
        `https://api.trakt.tv/search/tmdb/${tmdbId}?type=movie`,
        {
            headers: {
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": TRAKT_API_KEY
            }
        }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data[0]?.movie?.ids || null;
}

// 2. Buscar filmes relacionados usando o TRAKT ID correto
async function getRelatedMovies(traktId) {
    const res = await fetch(
        `https://api.trakt.tv/movies/${traktId}/related?limit=5`,
        {
            headers: {
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": TRAKT_API_KEY,
            }
        }
    );

    if (!res.ok) return [];

    return await res.json(); // devolve array de filmes Trakt
}

// 3. Buscar detalhes reais TMDB
async function getTMDBMovie(id) {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-PT`
    );
    return await res.json();
}

export function RecommendedForYou() {
    const {user} = useAuth();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (!user) return;

        async function loadRecommendations() {
            // 1. Buscar favoritos (TMDB IDs)
            const favorites = await getFavorites(user.uid); // => [{ id: 12 }, { id: 98 }]

            if (!favorites.length) {
                setMovies([]);
                return;
            }

            let relatedTmdbIds = [];

            // 2. Para cada favorito, converter TMDB → TRAKT ID, depois buscar related
            for (const fav of favorites) {

                // Converter TMDB → Trakt IDs
                const ids = await getTraktIdsFromTMDB(fav.id);
                if (!ids?.trakt) continue;

                // Buscar relacionados (Trakt)
                const related = await getRelatedMovies(ids.trakt);

                // Guardar TMDB IDs encontrados
                related.forEach(r => {
                    if (r?.ids?.tmdb) relatedTmdbIds.push(r.ids.tmdb);
                });
            }

// remover duplicados
            relatedTmdbIds = [...new Set(relatedTmdbIds)];

// remover filmes que já estão nos favoritos
            const favoriteIds = favorites.map(f => f.id);
            relatedTmdbIds = relatedTmdbIds.filter(id => !favoriteIds.includes(id));


            // 4. Buscar detalhes reais na TMDB
            const tmdbMovies = await Promise.all(
                relatedTmdbIds.slice(0, 10).map(async (id) => {
                    try {
                        return await getTMDBMovie(id);
                    } catch {
                        return null;
                    }
                })
            );

            setMovies(tmdbMovies.filter(Boolean));
        }

        loadRecommendations();
    }, [user]);

    // Caso não tenha favoritos
    if (!user) return null;

// Não renderiza se não houver user ou recomendações
    if (!user || movies.length === 0) return null;

// Renderização normal
    return (
        <section className="ms-20 mt-16">
            <SectionTitle title="Recomendado para ti"/>
            <PinkDiv width="w-40"/>

            <div className="flex gap-6 overflow-x-scroll pb-4 pt-2">
                {movies.map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <Card
                            title={movie.title}
                            rating={movie.vote_average?.toFixed(1)}
                            year={movie.release_date?.slice(0, 4)}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "/default-poster.png"
                            }
                            ClassNames="hover:scale-105 transition-transform"
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
}