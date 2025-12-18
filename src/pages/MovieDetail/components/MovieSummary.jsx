/**
 * MovieSummary
 * Exibe a sinopse final do filme.
 * - `overview` pode vir da TMDB (primeira escolha) ou de fallback (Wikipedia/TMDB fallback).
 * - Se não houver overview disponível, mostra uma mensagem de fallback.
 *
 * Props:
 * @param {string|null} overview - Texto da sinopse (já decidido pelo pai)
 * @returns {JSX.Element} Bloco com a sinopse ou mensagem "Sinopse não disponível"
 */

export function MovieSummary({ overview }) {
    return (
        <div className="text-texto-principal movie-summary">
            {/* Se existir overview renderiza-o; caso contrário, mostra texto de fallback */}
            {overview ? (
                <p>{overview}</p>
            ) : (
                <p className="movie-summary text-texto-principal opacity-70">Sinopse não disponível.</p>
            )}
        </div>
    );
}
