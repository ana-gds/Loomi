export const TRAKT_CLIENT_ID =
    "fcaf9c1971de00311c62e95e6982e934c1d87e7872d1ff8ff7c9a24cac262a7d";

export async function getRelatedContent(tmdbId) {
    try {
        // 1. Lookup TMDB -> descobrir se é movie ou show
        const lookupRes = await fetch(
            `https://api.trakt.tv/search/tmdb/${tmdbId}`,
            {
                headers: {
                    "trakt-api-key": TRAKT_CLIENT_ID,
                    "trakt-api-version": "2",
                    "Content-Type": "application/json",
                },
            }
        );

        if (!lookupRes.ok) {
            console.error("Lookup TMDB -> Trakt falhou:", lookupRes.status);
            return [];
        }

        const lookupData = await lookupRes.json();
        if (!lookupData.length) {
            console.warn("TMDB ID não encontrado na Trakt.");
            return [];
        }

        // A Trakt já devolve o type: "movie" ou "show"
        const item = lookupData[0];
        const type = item.type;  // "movie" ou "show"

        const traktId =
            type === "movie" ? item.movie.ids.trakt : item.show.ids.trakt;

        // 2. Endpoint correto
        const endpoint =
            type === "movie"
                ? `movies/${traktId}/related`
                : `shows/${traktId}/related`;

        // 3. Buscar conteúdo relacionado
        const relatedRes = await fetch(
            `https://api.trakt.tv/${endpoint}`,
            {
                headers: {
                    "trakt-api-key": TRAKT_CLIENT_ID,
                    "trakt-api-version": "2",
                    "Content-Type": "application/json",
                },
            }
        );

        if (!relatedRes.ok) {
            console.error("Erro ao pedir recomendações:", relatedRes.status);
            return [];
        }

        const related = await relatedRes.json();

        return related;

    } catch (err) {
        console.error("Erro inesperado em getRelatedContent:", err);
        return [];
    }
}
