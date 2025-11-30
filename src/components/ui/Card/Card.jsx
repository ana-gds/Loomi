export function Card ({
    title = '',
    rating = '',
    duration = '',
    year  = '',
    poster= '',
    ClassNames = '',
    ...rest
                             }) {
    return (
        <>
            <div className="mb-4">
                <div className={`w-48 h-80 bg-white rounded-2xl shadow-md ${ClassNames}`} {...rest}>
                    <img
                        src={poster}
                        alt={title}
                        className="h-64 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-texto-principal mb-2">{title}</h3>
                        <p className="text-sm text-texto-secundario mb-1">Ano: {year}</p>
                        <p className="text-sm text-texto-secundario mb-1">Duração: {duration}</p>
                        <p className="text-sm text-texto-secundario">Classificação: {rating}</p>
                    </div>
                </div>
            </div>
        </>
    );
}