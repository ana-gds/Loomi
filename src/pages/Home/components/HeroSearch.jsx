import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Searchbar } from "../../../components/ui/SearchBar/SearchBar.jsx";
import { searchMovies } from "../../../api/tmdb.js";
import defaultPoster from "../../../assets/imgs/default-movie.png";

/**
 * HeroSearch
 * - Gerir o estado do input (`query`)
 * - Fazer buscas à TMDB com debounce
 * - Mostra até 3 sugestões em dropdown
 * - Navega para detalhe ou página de resultados
 */

export function HeroSearch() {
    const [query, setQuery] = useState("");      // Texto do input
    const [results, setResults] = useState([]);  // Resultados de sugestão
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Debounce: espera 250ms após a última tecla antes de disparar a pesquisa
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            fetchSuggestions(query);
        }, 250);

        return () => clearTimeout(timer);
    }, [query]);

    // Faz a pesquisa na TMDB e atualiza resultados
    async function fetchSuggestions(text) {
        try {
            setLoading(true);
            const data = await searchMovies(text);
            setResults(data.results?.slice(0, 3) || []);
        } catch (err) {
            console.error("Erro na pesquisa TMDB:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function handleSelect(item) {
        navigate(`/movie/${item.id}`);
        setQuery("");
        setResults([]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    return (
        <section className="hero text-center bg-gradient-to-t from-fundo to-secundario ">
            <p className="hero-title font-normal text-texto-principal pt-20">
                Descobre o teu próximo
            </p>
            <p className="hero-title font-semibold text-principal">
                filme favorito
            </p>
            <p className="hero-subtitle text-texto-secundario mt-7">
                Descobre um mundo de filmes para ver hoje
            </p>

            <div className="mt-8 w-full max-w-xl justify-center mx-auto pb-20 relative overflow-visible">
                <Searchbar
                    placeholder="Procura por filmes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onSubmit={handleSubmit}
                />

                {/* Dropdown de sugestões: mostrado apenas quando há resultados */}
                {results.length > 0 && (
                    <ul className="absolute w-full bg-secundario rounded-xl shadow-lg mt-3 text-left z-20 p-2">
                        {results.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition"
                                onClick={() => handleSelect(item)}
                            >
                                {/* Poster */}
                                <img
                                    src={
                                        item.poster_path || item.profile_path
                                            ? `https://image.tmdb.org/t/p/w185${item.poster_path || item.profile_path}`
                                            : defaultPoster
                                    }
                                    alt={item.title || item.name}
                                    className="w-10 h-14 object-cover rounded"
                                />

                                <div className="flex flex-col">
                                    <span className="text-texto-principal font-medium">
                                        {item.title || item.name}
                                    </span>

                                    <span className="text-xs text-texto-secundario">
                                        {item.media_type === "movie" && "Filme"}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {loading && (
                    <p className="text-texto-secundario text-sm mt-2">A pesquisar...</p>
                )}
            </div>
        </section>
    );
}
