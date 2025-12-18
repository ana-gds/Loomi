import React, { useState, useEffect, useRef } from "react";
import { ButtonWhite } from "../../../components/ui/Button/ButtonWhite.jsx";
import { useAuth } from "../../../firebase/AuthContext";
import { addFavorite, removeFavorite, isFavorite } from "../../../firebase/favorites";

/**
 * MovieTrailer
 * Mostra o banner com backdrop, botão play (abre modal com YouTube),
 * controles de favorito e partilha.
 *
 * Props:
 * - backdrop: caminho do backdrop TMDB
 * - title: título do filme
 * - rating: classificação IMDB
 * - trailerKey: chave do YouTube (se existir)
 * - movieId: id TMDB para favoritos
 */

export function MovieTrailer({
       backdrop,
       title,
       rating,
       trailerKey,
       movieId,
}) {

    // Modal aberto
    const [isOpen, setIsOpen] = useState(false);

    // Toast de partilha
    const [showToast, setShowToast] = useState(false);

    // Favorito local
    const { user } = useAuth();
    const [fav, setFav] = useState(false);

    // Ref para o botão fechar
    const closeBtnRef = useRef(null);

    // Abre modal do trailer (só se existir trailerKey)
    function openModal() {
        if (!trailerKey) return;
        setIsOpen(true);
    }

    // Fecha modal
    function closeModal() {
        setIsOpen(false);
    }

    // Copia link da página para o clipboard com fallback
    async function handleCopyLink() {
        const text = window.location.href;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback para browsers antigos
                const fallback = window.prompt("Copia o link:", text);
                if (!fallback) throw new Error("Fallback cancelado");
            }

            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error("Erro ao copiar o link:", err);
            // Notifica o utilizador de forma simples
            alert("Não foi possível copiar o link automaticamente. Usa Ctrl+C para copiar.");
        }
    }

    // FAVORITOS

    useEffect(() => {
        if (!user || !movieId) return;

        let mounted = true;
        async function checkFavorite() {
            try {
                const exists = await isFavorite(user.uid, movieId);
                if (mounted) setFav(Boolean(exists));
            } catch (err) {
                console.error("Erro ao verificar favorito:", err);
            }
        }

        checkFavorite();
        return () => { mounted = false; };
    }, [user, movieId]);

    async function toggleFavorite() {
        if (!user) {
            alert("Tens de iniciar sessão para adicionar favoritos.");
            return;
        }

        try {
            if (fav) {
                await removeFavorite(user.uid, movieId);
                setFav(false);
            } else {
                await addFavorite(user.uid, movieId);
                setFav(true);
            }
        } catch (err) {
            console.error("Erro ao actualizar favoritos:", err);
            alert("Ocorreu um erro ao atualizar favoritos. Tenta novamente mais tarde.");
        }
    }

    // When modal opens, move focus to close button for accessibility
    useEffect(() => {
        if (isOpen && closeBtnRef.current) {
            closeBtnRef.current.focus();
        }
    }, [isOpen]);

    // Construção segura da URL do backdrop (fallback para imagem padrão)
    const backdropUrl = backdrop ? `https://image.tmdb.org/t/p/original${backdrop}` : "/default-backdrop.png";

    return (
        <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">

            {/* MODAL DO TRAILER */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-principal/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Trailer de ${title}`}
                >
                    <div
                        className="relative w-[90%] max-w-3xl aspect-video bg-black rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            ref={closeBtnRef}
                            className="absolute top-3 right-3 text-white text-3xl hover:text-principal"
                            onClick={closeModal}
                            aria-label="Fechar trailer"
                        >
                            ×
                        </button>

                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title={`Trailer de ${title}`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* IMAGEM DO BANNER */}
            <img
                src={backdropUrl}
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
                        aria-label="Abrir trailer"
                    />
                )}
            </div>

            {/* TÍTULO */}
            <div className="ms-20 absolute bottom-6">
                <div className="text-3xl movietrailer-title font-semibold flex items-center gap-6 text-texto-principal">
                    {title}
                    <div className="bg-texto-principal/60 px-3 py-2 rounded-md text-sm hero-subtitle text-white gap-2 flex items-center cursor-pointer hover:scale-110 transition-transform" aria-hidden>
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
                    aria-pressed={fav}
                    aria-label={fav ? "Remover favorito" : "Adicionar aos favoritos"}
                    disabled={!user}
                    title={!user ? "Inicia sessão para adicionar favoritos" : undefined}
                >
                    <i className={`bi ${fav ? "bi-bookmark-fill" : "bi-bookmark"} text-3xl`} />
                </button>

                {/* BOTÃO PARTILHAR */}
                <button
                    className="text-principal cursor-pointer hover:scale-110 transition-transform"
                    onClick={handleCopyLink}
                    aria-label="Partilhar link do filme"
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
