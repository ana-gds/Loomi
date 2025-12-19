import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";

// URL base para as imagens dos provedores de streaming
const IMG_BASE = "https://image.tmdb.org/t/p/w200";

/**
 * Componente que mostra onde ver o filme
 * Mostra plataformas de streaming, aluguer e compra disponíveis em Portugal
 */

export function MovieStreaming({ providers }) {
    // Extrai informações de Portugal dos provedores
    const pt = providers?.results?.PT;

    // Se não há informações para Portugal, mostra mensagem
    if (!pt) {
        return (
            <div className="bg-secundario p-6 rounded-xl shadow-sm text-texto-principal">
                <SectionTitle title={'Onde ver'}/>
                <p className="italic opacity-70">Sem informação disponível.</p>
            </div>
        );
    }

    // Separa os provedores por tipo (streaming, aluguer, compra)
    const flatrate = pt.flatrate || [];
    const rent = pt.rent || [];
    const buy = pt.buy || [];

    // Combina todos os provedores numa única lista com tipo identificado
    const items = [
        ...flatrate.map((p) => ({ ...p, type: "Streaming" })),
        ...rent.map((p) => ({ ...p, type: "Aluguer" })),
        ...buy.map((p) => ({ ...p, type: "Compra" })),
    ];

    // Se não tiver nenhum dísponivel, mostra mensagem
    if (!items.length) {
        return (
            <div className="bg-secundario p-6 rounded-xl shadow-sm text-texto-principal">
                <SectionTitle title={'Onde ver'}/>
                <p className="italic opacity-70">
                    Não está disponível em plataformas em Portugal.
                </p>
            </div>
        );
    }

    // Renderiza a lista de provedores
    return (
        <div className="bg-secundario p-6 rounded-xl shadow-sm text-texto-principal">
            <SectionTitle title={'Onde ver'} className="mb-3"/>

            <div className="flex flex-col gap-4">
                {/* Itera sobre cada provedor e exibe logo + nome + tipo */}
                {items.map((p) => (
                    <div
                        // Chave única: combina ID do provedor + tipo
                        key={`${p.provider_id}-${p.type}`}
                        className="flex items-center gap-4 bg-white/20 rounded-lg py-3"
                    >
                        {/* Logo do provedor */}
                        <img
                            src={`${IMG_BASE}${p.logo_path}`}
                            alt={p.provider_name}
                            className="w-10 h-10 rounded-md object-cover"
                        />

                        {/* Nome do provedor e tipo (Streaming/Aluguer/Compra) */}
                        <div className="flex flex-col leading-tight">
                            <span className="text-texto-principal font-medium">
                                {p.provider_name}
                            </span>
                            <span className="text-xs text-texto-secundario">
                                {p.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}