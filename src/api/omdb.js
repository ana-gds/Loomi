
export const OMDB_API_KEY = "38d31eac";

const BASE_URL = "https://www.omdbapi.com/";

// Buscar via IMDb ID 
export async function getOMDbById(imdbId) {
    if (!imdbId) return null;

    try {
        const res = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}`);
        const data = await res.json();

        return data.Response === "True" ? data : null;
    } catch (err) {
        console.error("Erro OMDb (ID):", err);
        return null;
    }
}
