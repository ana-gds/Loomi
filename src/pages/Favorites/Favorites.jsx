import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { getFavorites } from "../../firebase/favorites";
import { useNavigate } from "react-router-dom";

export function Favorites() {
    const { user, loading } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        async function loadFavorites() {
            const data = await getFavorites(user.uid);
            setFavorites(data);
        }

        loadFavorites();
    }, [user]);

    if (loading) return <p className="ms-20 mt-10 text-texto-principal">A carregar...</p>;

    if (!user)
        return (
            <div className="p-20 text-texto-principal">
                <h2 className="text-3xl font-semibold">Tens de iniciar sessão</h2>
                <p className="mt-2">Entra na tua conta para veres os teus favoritos.</p>
            </div>
        );

    return (
        <div className="px-20 py-14">

            {/* TÍTULO */}
            <h1 className="text-4xl font-semibold text-texto-principal mb-10">
                Os teus Favoritos
            </h1>

            {/* SE NÃO HOUVER FAVORITOS */}
            {favorites.length === 0 && (
                <p className="text-texto-secundario text-lg">
                    Ainda não tens filmes adicionados aos favoritos.
                </p>
            )}

            {/* GRID DE FILMES */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {favorites.map((movie) => (
                    <div
                        key={movie.id}
                        className="cursor-pointer group"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                    : "/default-poster.png"
                            }
                            alt={movie.title}
                            className="w-full rounded-lg shadow-md group-hover:scale-105 transition-transform"
                        />

                        <p className="mt-2 text-texto-principal font-medium">
                            {movie.title}
                        </p>
                    </div>
                ))}
            </div>

            {/* SEPARADOR PARA AS LISTAS DO UTILIZADOR (FAREmos já a seguir) */}
            <h2 className="text-3xl font-semibold text-texto-principal mt-14 mb-6">
                As tuas Listas
            </h2>

            <p className="text-texto-secundario">Funcionalidade em construção.</p>

        </div>
    );
}
