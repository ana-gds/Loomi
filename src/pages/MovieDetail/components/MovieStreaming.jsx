import {SectionTitle} from "../../../components/ui/Title/SectionTitle.jsx";

const IMG_BASE = "https://image.tmdb.org/t/p/w200";

export function MovieStreaming({ providers }) {
    const pt = providers?.results?.PT;

    if (!pt) {
        return (
            <div className="bg-secundario p-6 rounded-xl shadow-sm text-texto-principal">
                <SectionTitle title={'Onde ver'}/>
                <p className="italic opacity-70">Sem informação disponível.</p>
            </div>
        );
    }

    const flatrate = pt.flatrate || [];
    const rent = pt.rent || [];
    const buy = pt.buy || [];

    // Combinar tudo numa só lista estilo JustWatch
    const items = [
        ...flatrate.map((p) => ({ ...p, type: "Streaming" })),
        ...rent.map((p) => ({ ...p, type: "Aluguer" })),
        ...buy.map((p) => ({ ...p, type: "Compra" })),
    ];

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

    return (
        <div className="bg-secundario p-6 rounded-xl shadow-sm text-texto-principal">
            <SectionTitle title={'Onde ver'} className="mb-3"/>

            <div className="flex flex-col gap-4">
                {items.map((p) => (
                    <div
                        key={p.provider_id}
                        className="flex items-center gap-4 bg-white/20 rounded-lg py-3"
                    >
                        <img
                            src={`${IMG_BASE}${p.logo_path}`}
                            alt={p.provider_name}
                            className="w-10 h-10 rounded-md object-cover"
                        />

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
