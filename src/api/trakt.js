export const TRAKT_API_KEY =
    "fcaf9c1971de00311c62e95e6982e934c1d87e7872d1ff8ff7c9a24cac262a7d";

export async function getRelatedContent(tmdbId) {
    try {
        // 1. Lookup TMDB ID → descobrir o Trakt ID REAL do filme
        const lookup = await fetch(
            `https://api.trakt.tv/search/tmdb/${tmdbId}?type=movie`,
            {
                headers: {
                    "trakt-api-key": TRAKT_API_KEY,
                    "trakt-api-version": "2",
                },
            }
        );

        const data = await lookup.json();
        const movie = data[0]?.movie;

        if (!movie?.ids?.trakt) return [];

        const traktId = movie.ids.trakt;

        // 2. Buscar recomendações de filmes
        const res = await fetch(
            `https://api.trakt.tv/movies/${traktId}/related`,
            {
                headers: {
                    "trakt-api-key": TRAKT_API_KEY,
                    "trakt-api-version": "2",
                },
            }
        );

        const related = await res.json();

        // 3. Garantir que só ficam items com TMDB ID válido
        return related.filter((r) => r?.ids?.tmdb);
    } catch (err) {
        console.error("Erro em getRelatedContent:", err);
        return [];
    }
}
