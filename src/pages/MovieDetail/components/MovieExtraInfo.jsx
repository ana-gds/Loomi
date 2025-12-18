

/**
 * Componente que exibe informações extras sobre o filme
 * Mostra prémios recebidos e classificação etária obtidos da API OMDB
 * @param {Object} omdb - Dados do filme da API OMDB
 * @returns {JSX.Element|null} Informações extras ou null se dados não disponíveis
 */

export function MovieExtraInfo({ omdb }) {
    // Retorna null se não houver dados OMDB disponíveis
    if (!omdb) return null;

    // Verifica se existe alguma informação para mostrar
    const hasAwards = omdb.Awards && omdb.Awards !== "N/A" && omdb.Awards.trim();
    const hasRated = omdb.Rated && omdb.Rated.trim();

    // Se não há informação, não renderiza nada
    if (!hasAwards && !hasRated) return null;

    return (
        <div className="flex gap-20 pt-6 justify-between flex-wrap">
            {/* Secção de Prémios - mostrada apenas se existirem prémios válidos */}
            {hasAwards && (
                <div>
                    <p className="uppercase text-xs opacity-70 mb-1">Prémios</p>
                    <p>{omdb.Awards}</p>
                </div>
            )}

            {/* Secção de Classificação Etária - mostrada apenas se existir classificação */}
            {hasRated && (
                <div>
                    <p className="uppercase text-xs opacity-70 mb-1">Classificação etária</p>
                    <p className="text-lg font-medium">
                        {omdb.Rated}
                    </p>
                </div>
            )}
        </div>
    );
}
