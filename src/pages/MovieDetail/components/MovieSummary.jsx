export function MovieSummary({ overview }) {
    return (
        <div className="text-texto-principal movie-summary">
            {overview ? (
                <p>{overview}</p>
            ) : (
                <p className="movie-summary text-texto-principal opacity-70">Sinopse não disponível.</p>
            )}
        </div>
    );
}
