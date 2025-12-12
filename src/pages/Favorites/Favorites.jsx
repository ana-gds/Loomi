import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { getFavorites } from "../../firebase/favorites";
import { useNavigate } from "react-router-dom";
import { TMDB_API_KEY } from "../../api/tmdb";

import { SectionTitle } from "../../components/ui/Title/SectionTitle.jsx";
import { Card } from "../../components/ui/Card/Card.jsx";
import { PinkDiv } from "../../components/ui/Divs/PinkDiv.jsx";

export function Favorites() {
    const { user, loading } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        async function loadFavorites() {
            // 1. Buscar apenas os ids guardados no Firestore
            const favDocs = await getFavorites(user.uid); // [{ id: 123 }, { id: 456 }]

            if (favDocs.length === 0) {
                setFavorites([]);
                return;
            }

            // 2. Fazer fetch à TMDB para ir buscar os dados reais
            const movies = await Promise.all(
                favDocs.map(async ({ id }) => {
                    const res = await fetch(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-PT`
                    );
                    return await res.json();
                })
            );

            // 3. Guardar os filmes completos no estado
            setFavorites(movies);
        }

        loadFavorites();
    }, [user]);


    if (loading)
        return <p className="ms-20 mt-10 text-texto-principal">A carregar...</p>;


    if (!user)
        return (
            <div className="p-20 text-texto-principal">
                <h2 className="text-3xl font-semibold">Tens de iniciar sessão</h2>
                <p className="mt-2">Entra na tua conta para veres os teus favoritos.</p>
            </div>
        );


    return (
        <div className="px-20 py-14">

            <SectionTitle title="Favoritos" />
            <PinkDiv width={'w-20'}/>

            {favorites.length === 0 && (
                <p className="text-texto-secundario text-lg">
                    Ainda não tens filmes adicionados aos favoritos.
                </p>
            )}

            {/* GRID COM O TEU COMPONENTE CARD */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 mt-10">
                {favorites.map((movie) => (
                    <Card
                        key={movie.id}
                        title={movie.title}
                        poster={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                : "/default-poster.png"
                        }
                        year={movie.release_date?.slice(0, 4)}
                        rating={movie.vote_average?.toFixed(1)}
                        ClassNames="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    />
                ))}
            </div>


            {/* LISTAS PERSONALIZADAS (FAREMOS A SEGUIR) */}
            <h2 className="text-3xl font-semibold text-texto-principal mt-14 mb-6">
                As tuas Listas
            </h2>

            <p className="text-texto-secundario">Funcionalidade em construção.</p>

        </div>
    );
}
