import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";

// Base URL para imagens do TMDB (tamanho w185)
const IMG_BASE = "https://image.tmdb.org/t/p/w185";

/**
 * Componente que exibe o elenco de um filme
 * Renderiza até 12 atores ordenados por relevância (order ascendente)
 * com fotos, nomes e personagens
 */

export function MovieCast({ cast }) {
    // Retorna mensagem se elenco não está disponível ou vazio
    if (!cast || cast.length === 0) {
        return (
            <div className="mt-16">
                <p className="text-texto-secundario italic">
                    Elenco não disponível.
                </p>
            </div>
        );
    }

    // Ordena por relevância (propriedade `order`) sem mutacionar o array original
    const sortedCast = [...cast].sort((a, b) => a.order - b.order);

    return (
        <div className="mt-16">
            <SectionTitle title={'Elenco'}/>
            
            {/* Container horizontal com até 12 atores */}
            <div className="flex gap-6 overflow-x-auto pb-4 pt-4">
                {sortedCast.slice(0, 12).map((actor) => (
                    <div
                        // Usa credit_id como chave única para cada ator
                        key={actor.credit_id}
                        className="flex flex-col items-center min-w-[120px]"
                    >
                        {/* Avatar circular do ator com efeito hover */}
                        <div
                            className="w-24 h-24 rounded-full overflow-hidden shadow-md
                                       transform transition-all duration-300
                                       hover:scale-105 hover:shadow-lg hover:-translate-y-1"
                        >
                            <img
                                // Lazy loading para melhor performance
                                loading="lazy"
                                src={
                                    // URL da foto ou fallback se não disponível
                                    actor.profile_path
                                        ? `${IMG_BASE}${actor.profile_path}`
                                        : "/default-user.png"
                                }
                                alt={actor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Nome do ator - validado para evitar undefined */}
                        <p className="mt-3 text-sm font-medium text-texto-principal text-center">
                            {actor.name || "Desconhecido"}
                        </p>

                        {/* Nome do personagem - validado para evitar undefined */}
                        <p className="text-xs text-texto-secundario text-center">
                            {actor.character || "Sem personagem"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}