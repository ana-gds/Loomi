/**
 * MovieSummary
 * Exibe a sinopse final do filme.
 *  * - Se não houver overview disponível, mostra uma mensagem de fallback.
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
