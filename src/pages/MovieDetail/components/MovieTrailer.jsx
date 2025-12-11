import React, { useState, useEffect } from "react";
import { ButtonWhite } from "../../../components/ui/Button/ButtonWhite.jsx";
import { useAuth } from "../../../firebase/AuthContext";
import { addFavorite, removeFavorite, isFavorite } from "../../../firebase/favorites";

export function MovieTrailer({
                                 backdrop,
                                 title,
                                 rating,
                                 trailerKey,
                                 movieId,
                                 movieTitle,
                                 moviePoster
                             }) {

    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    function openModal() {
        if (!trailerKey) return;
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function handleCopyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error("Erro ao copiar o link:", err);
            alert("Não foi possível copiar o link.");
        }
    }

    // -------------------
    // FAVORITOS
    // -------------------

    const { user } = useAuth();
    const [fav, setFav] = useState(false);

    // Quando o componente abre, verifica se é favorito
    useEffect(() => {
        if (!user || !movieId) return;

        async function checkFavorite() {
            const exists = await isFavorite(user.uid, movieId);
            setFav(exists);
        }

        checkFavorite();
    }, [user, movieId]);

    // Adicionar ou remover favorito
    async function toggleFavorite() {
        if (!user) {
            alert("Tens de iniciar sessão para adicionar favoritos.");
            return;
        }

        if (fav) {
            await removeFavorite(user.uid, movieId);
            setFav(false);
        } else {
            await addFavorite(user.uid, {
                id: movieId,
                title: movieTitle,
                poster_path: moviePoster
            });
            setFav(true);
        }
    }

    return (
        <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">

            {/* MODAL DO TRAILER */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-principal/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-[90%] max-w-3xl aspect-video bg-black rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-white text-3xl hover:text-principal"
                            onClick={closeModal}
                        >
                            ×
                        </button>

                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title="Trailer"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* IMAGEM */}
            <img
                src={`https://image.tmdb.org/t/p/original${backdrop}`}
                alt={title}
                className="w-full h-full object-cover brightness-[0.65]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-secundario/60 to-white/60" />

            {/* BOTÃO PLAY */}
            <div className="absolute inset-0 flex items-center justify-center">
                {trailerKey && (
                    <ButtonWhite
                        icon="▶︎"
                        ClassNames="text-4xl ps-1 pb-0.5 cursor-pointer hover:scale-110 transition-transform"
                        onClick={openModal}
                    />
                )}
            </div>

            {/* TÍTULO */}
            <div className="ms-20 absolute bottom-6">
                <div className="text-3xl movietrailer-title font-semibold flex items-center gap-6 text-texto-principal">
                    {title}
                    <div className="bg-texto-principal/60 px-3 py-2 rounded-md text-sm hero-subtitle text-white gap-2 flex items-center cursor-pointer hover:scale-110 transition-transform">
                        <i className="bi bi-star-fill text-principal" /> {rating || "—"}
                    </div>
                </div>
            </div>

            {/* FAVORITO E PARTILHA */}
            <div className="absolute bottom-6 right-6 flex gap-4 text-white text-xl me-14">

                {/* BOTÃO FAVORITO */}
                <button
                    onClick={toggleFavorite}
                    className="text-principal cursor-pointer hover:scale-110 transition-transform"
                >
                    <i className={`bi ${fav ? "bi-bookmark-fill" : "bi-bookmark"} text-3xl`} />
                </button>

                {/* BOTÃO PARTILHAR */}
                <button
                    className="text-principal cursor-pointer hover:scale-110 transition-transform"
                    onClick={handleCopyLink}
                >
                    <i className="bi bi-box-arrow-up text-3xl"></i>
                </button>
            </div>

            {/* TOAST */}
            {showToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-principal text-white px-6 py-3 rounded-lg shadow-lg animate-fade z-50 hero-subtitle">
                    Link copiado!
                </div>
            )}
        </div>
    );
}
