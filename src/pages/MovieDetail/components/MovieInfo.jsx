export function MovieInfo({ movie, credits }) {
    if (!movie) return null;

    // Converter duração (minutos → "2h 28min")
    const convertRuntime = (min) => {
        if (!min) return "—";
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${h}h ${m}min`;
    };

    // Extrair diretor dos créditos
    const director = credits?.crew?.find((p) => p.job === "Director")?.name || "—";

    return (
        <div className="bg-secundario p-6 rounded-2xl shadow-sm w-full max-w-sm text-texto-principal">
            <p className="uppercase text-xs opacity-70 mb-1">Tipo</p>
            <p className="mb-4">Filme</p>

            <p className="uppercase text-xs opacity-70 mb-1">Género</p>
            <p className="mb-4">
                {movie.genres?.map((g) => g.name).join(", ") || "—"}
            </p>

            <p className="uppercase text-xs opacity-70 mb-1">Duração</p>
            <p className="mb-4">
                {convertRuntime(movie.runtime)}
            </p>

            <p className="uppercase text-xs opacity-70 mb-1">Data de lançamento</p>
            <p className="mb-4">
                {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("pt-PT")
                    : "—"}
            </p>

            <p className="uppercase text-xs opacity-70 mb-1">Diretor</p>
            <p>{director}</p>
        </div>
    );
}
