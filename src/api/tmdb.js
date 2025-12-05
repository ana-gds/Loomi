const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = 'd2f1f1157371618f6450aee1f2fd50b7';

// Helper para construir URL
function buildUrl(endpoint) {
    return `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=pt-PT`;
}

// Função genérica para fazer fetch
export async function tmdbFetch(endpoint) {
    const url = buildUrl(endpoint);
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Erro ao obter dados da TMDB");
    }

    return await res.json();
}

// TOP FILMES
export function getTopMovies() {
    return tmdbFetch("movie/top_rated");
}

// FILMES POPULARES
export function getPopularMovies() {
    return tmdbFetch("movie/popular");
}

// FILMES EM TENDÊNCIA (HOJE)
export function getTrendingToday() {
    return tmdbFetch("trending/movie/day");
}

// FILMES EM TENDÊNCIA (SEMANA)
export function getTrendingWeek() {
    return tmdbFetch("trending/movie/week");
}

// FILMES POR GÉNERO
export function getMoviesByGenre(genreId) {
    return tmdbFetch(`discover/movie&with_genres=${genreId}`);
}

// SÉRIES POPULARES
export function getPopularSeries() {
    return tmdbFetch("tv/popular");
}

// SÉRIES TOP RATED
export function getTopSeries() {
    return tmdbFetch("tv/top_rated");
}

// DETALHES DE UM FILME
export function getMovieDetails(id) {
    return tmdbFetch(`movie/${id}`);
}

// PESQUISA
export function searchMovies(query) {
    return tmdbFetch(`search/movie&query=${query}`);
}