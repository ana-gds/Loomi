import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";

    // Base URL para imagens do TMDB (tamanho w185)
    const IMG_BASE = "https://image.tmdb.org/t/p/w185";

    /**
     * MovieCast
     * Recebe `cast` (array de objetos de elenco) e renderiza uma lista
     * com até 12 atores ordenados por ordem de relevancia.
     */

    export function MovieCast({ cast }) {
        // Se não houver elenco, renderiza mensagem de fallback
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

                {/* Lista de atores */}
                <div className="flex gap-6 overflow-x-auto pb-4 pt-4">
                    {sortedCast.slice(0, 12).map((actor) => (
                        <div
                            key={actor.cast_id || actor.credit_id}
                            className="flex flex-col items-center min-w-[120px]"
                        >
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden shadow-md
                                           transform transition-all duration-300
                                           hover:scale-105 hover:shadow-lg hover:-translate-y-1"
                            >
                                <img
                                    loading="lazy"
                                    src={
                                        actor.profile_path
                                            ? `${IMG_BASE}${actor.profile_path}`
                                            : "/default-user.png" // fallback local
                                    }
                                    alt={actor.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Nome do ator */}
                            <p className="mt-3 text-sm font-medium text-texto-principal text-center">
                                {actor.name}
                            </p>

                            {/* Nome do personagem */}
                            <p className="text-xs text-texto-secundario text-center">
                                {actor.character}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }