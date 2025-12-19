import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { getFavorites } from "../../firebase/favorites";
import { useNavigate } from "react-router-dom";
import { getMovieDetails } from "../../api/tmdb";

import { SectionTitle } from "../../components/ui/Title/SectionTitle.jsx";
import { Card } from "../../components/ui/Card/Card.jsx";
import { PinkDiv } from "../../components/ui/Divs/PinkDiv.jsx";
import defaultPoster from "../../assets/imgs/default-movie.png";

/**
 * Favorites
 * - Vai busvar lista de IDs de favoritos do Firestore
 * - Faz requests à TMDB para obter os detalhes dos filmes
 */

export function Favorites() {
    const { user, loading } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadFavorites() {
            if (!user) return;

            setError(null);
            setLoadingFavorites(true);

            try {
                // Ir buscar os ids guardados no Firestore
                const favDocs = await getFavorites(user.uid); //

                if (!favDocs || favDocs.length === 0) {
                    setFavorites([]);
                    return;
                }

                // Fazer fetch à TMDB para obter os detalhes — usar allSettled para não falhar tudo
                const fetches = favDocs.map(({ id }) => getMovieDetails(id));

                const settled = await Promise.allSettled(fetches);

                // Filtrar apenas os resultados válidos
                const movies = settled
                    .filter((s) => s.status === "fulfilled" && s.value && s.value.id)
                    .map((s) => s.value);

                setFavorites(movies);
            } catch (err) {
                console.error("Erro ao carregar favoritos:", err);
                setError("Erro ao carregar favoritos. Tenta novamente mais tarde.");
            } finally {
                setLoadingFavorites(false);
            }
        }

        loadFavorites();
    }, [user]);

    // Enquanto o Auth ainda carrega
    if (loading) return <p className="ms-20 mt-10 text-texto-principal">A carregar...</p>;


    return (
        <div className="px-20 py-14">

            <SectionTitle title="Favoritos" />
            <PinkDiv width={'w-20'}/>

            {/* Estado de loading / erro */}
            {loadingFavorites && <p className="text-texto-secundario mt-6">A carregar favoritos...</p>}
            {error && <p className="text-red-500 mt-6">{error}</p>}

            {/* Mensagem quando não existem favoritos */}
            {!loadingFavorites && favorites.length === 0 && (
                <p className="text-texto-secundario text-lg">
                    Ainda não tens filmes adicionados aos favoritos.
                </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 mt-10">
                {favorites.map((movie) => (
                    <Card
                        key={movie.id}
                        title={movie.title}
                        poster={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                : defaultPoster
                        }
                        year={movie.release_date?.slice(0, 4)}
                        rating={movie.vote_average?.toFixed(1)}
                        ClassNames="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}
