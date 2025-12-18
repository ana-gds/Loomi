const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_API_KEY = "d2f1f1157371618f6450aee1f2fd50b7";

// Helper para construir URL
function buildUrl(endpoint) {
    return `${TMDB_BASE_URL}/${endpoint}&api_key=${TMDB_API_KEY}&language=pt-PT`;
}

// Fetch genérico
export async function tmdbFetch(endpoint) {
    const url = buildUrl(endpoint);
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Erro ao obter dados da TMDB");
    }

    return await res.json();
}

export async function fetchTopMovies() {
    const data = await tmdbFetch("trending/movie/week?page=1&");
    return data.results;
}

// FILMES POR GÉNERO
export function getMoviesByGenre(genreId) {
    return tmdbFetch(`discover/movie?with_genres=${genreId}`);
}


// DETALHES
export function getMovieDetails(id) {
    return tmdbFetch(`movie/${id}?`);
}

// PESQUISA
export function searchMovies(query) {
    return tmdbFetch(`search/movie?query=${encodeURIComponent(query)}`);
}
