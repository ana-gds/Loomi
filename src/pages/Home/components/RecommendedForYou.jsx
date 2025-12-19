import { useEffect, useState } from "react";
import { useAuth } from "../../../firebase/AuthContext";
import { getFavorites } from "../../../firebase/favorites";
import { SectionTitle } from "../../../components/ui/Title/SectionTitle.jsx";
import { PinkDiv } from "../../../components/ui/Divs/PinkDiv.jsx";
import { Card } from "../../../components/ui/Card/Card.jsx";
import { Link } from "react-router-dom";
import { getMovieDetails } from "../../../api/tmdb";
import { getRelatedContent } from "../../../api/trakt";
import defaultPoster from "../../../assets/imgs/default-movie.png";

/**
 * RecommendedForYou
 * Mostra uma secção carrossel com filmes recomendados com base nos favoritos do utilizador.
 *
 * Fluxo:
 * 1. Carrega os IDs dos favoritos do utilizador autenticado.
 * 2. Para cada favorito, obtém conteúdo relacionado através da API Trakt.
 * 3. Extrai IDs TMDB dos relacionados, evita duplicados e favoritos.
 * 4. Busca detalhes dos filmes (máx 10) na TMDB.
 * 5. Renderiza um carrossel horizontal com Cards clicáveis.
 */

export function RecommendedForYou() {
    const { user } = useAuth();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (!user) return;

        async function loadRecommendations() {
            try {
                // Carregar IDs dos favoritos do utilizador
                const favorites = await getFavorites(user.uid);

                if (!favorites || !favorites.length) {
                    setMovies([]);
                    return;
                }

                // Construir lista de IDs favoritos para exclusão posterior
                const favoriteIds = favorites.map((f) => f?.id).filter(Boolean);
                const relatedIds = new Set();

                // Para cada favorito, obter conteúdo relacionado via Trakt
                for (const fav of favorites) {
                    if (fav?.id) {
                        try {
                            const related = await getRelatedContent(fav.id);
                            if (related && Array.isArray(related)) {
                                related.forEach((r) => {
                                    if (r?.ids?.tmdb) relatedIds.add(r.ids.tmdb);
                                });
                            }
                        } catch (err) {
                            // Log mas não bloqueia o resto das recomendações
                            console.warn(`Erro ao obter conteúdo relacionado para ${fav.id}:`, err);
                        }
                    }
                }

                // Remover filmes que já estão nos favoritos do conjunto de recomendações
                favoriteIds.forEach((id) => relatedIds.delete(id));

                // Buscar detalhes dos filmes na TMDB
                const tmdbMovies = await Promise.all(
                    Array.from(relatedIds).slice(0, 10).map(async (id) => {
                        try {
                            return await getMovieDetails(id);
                        } catch (err) {
                            console.warn(`Erro ao obter detalhes do filme ${id}:`, err);
                            return null;
                        }
                    })
                );

                // Filtrar valores null (filmes que falharam) e atualizar estado
                setMovies(tmdbMovies.filter(Boolean));
            } catch (err) {
                // Erro global ao carregar recomendações; esvazia a lista para segurança
                console.error("Erro ao carregar recomendações:", err);
                setMovies([]);
            }
        }

        loadRecommendations();
    }, [user]);

    // Oculta a secção se não houver utilizador autenticado ou recomendações
    if (!user || movies.length === 0) return null;

    return (
        <section className="ms-20 mt-16">
            <SectionTitle title="Recomendado para ti" />
            <PinkDiv width="w-40" />

            {/* Carrossel horizontal com scroll, sem scrollbar visível */}
            <div className="flex gap-6 overflow-x-scroll pb-4 pt-2">
                {movies.map((movie) => (
                    // Link para página de detalhes do filme
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
