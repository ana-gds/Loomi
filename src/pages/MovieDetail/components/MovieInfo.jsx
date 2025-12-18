/**
 * Componente que exibe informações detalhadas sobre o filme
 * Mostra tipo, género, duração, data de lançamento e diretor
 * @param {Object} movie - Dados do filme da API TMDB
 * @param {Object} credits - Créditos do filme (elenco, crew)
 * @returns {JSX.Element|null} Card com informações do filme ou null se filme não existe
 */

export function MovieInfo({ movie, credits }) {
    // Retorna null se filme não está disponível
    if (!movie) return null;

    /**
     * Converte duração em minutos para formato legível (ex: "2h 28min")
     * @param {number} min - Duração em minutos
     * @returns {string} Duração formatada ou "—" se não disponível
     */

    const convertRuntime = (min) => {
        if (!min) return "—";
        const h = Math.floor(min / 60); // Extrai horas
        const m = min % 60; // Extrai minutos restantes
        return `${h}h ${m}min`;
    };

    // Extrai o nome do diretor da lista de crew, procura por job === "Director"
    const director = credits?.crew?.find((p) => p.job === "Director")?.name || "—";

    return (
        <div className="bg-secundario p-6 rounded-2xl shadow-sm w-full max-w-sm text-texto-principal">
            {/* Tipo de conteúdo (sempre filme) */}
            <p className="uppercase text-xs opacity-70 mb-1">Tipo</p>
            <p className="mb-4">Filme</p>

            {/* Géneros do filme separados por vírgula */}
            <p className="uppercase text-xs opacity-70 mb-1">Género</p>
            <p className="mb-4">
                {movie.genres?.map((g) => g.name).join(", ") || "—"}
            </p>

            {/* Duração convertida para formato legível */}
            <p className="uppercase text-xs opacity-70 mb-1">Duração</p>
            <p className="mb-4">
                {convertRuntime(movie.runtime)}
            </p>

            {/* Data de lançamento formatada para português */}
            <p className="uppercase text-xs opacity-70 mb-1">Data de lançamento</p>
            <p className="mb-4">
                {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("pt-PT")
                    : "—"}
            </p>

            {/* Nome do diretor extraído dos créditos */}
            <p className="uppercase text-xs opacity-70 mb-1">Diretor</p>
            <p>{director}</p>
        </div>
    );
}
