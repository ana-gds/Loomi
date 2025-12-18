const YT_API_KEY = "AIzaSyBmbhXhgbboOZX0MTTBseDN0CA39OCU9ZE";


export async function getYoutubeTrailer(title) {
    // Monta query do trailer usando o título recebido
    const query = `${title} trailer oficial`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${YT_API_KEY}`;

    try {
        // Faz request na API e retorna o primeiro videoId encontrado
        const res = await fetch(url);
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
            console.warn("Nenhum trailer encontrado no YouTube.");
            return null;
        }

        return data.items[0].id.videoId;
    } catch (err) {
        console.error("Erro ao obter trailer do YouTube:", err);
        return null;
    }
}
