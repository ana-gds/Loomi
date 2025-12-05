export function Card ({
    title = '',
    rating = '',
    year  = '',
    poster= '',
    ClassNames = '',
    ...rest
                             }) {
    return (
        <>
            <div className="mb-3">
                <div className={`w-52 h-82 bg-white rounded-2xl shadow-md ${ClassNames}`} {...rest}>
                    <img
                        src={poster}
                        alt={title}
                        className="h-64 object-cover w-full rounded-t-2xl"
                    />
                    <div className="p-4 pt-2">
                        <h3 className="text-lg font-semibold text-texto-principal mb-1 truncate">{title}</h3>
                        <div className="flex justify-between">
                        <p className="text-sm text-texto-secundario mb-2"><i className="bi bi-calendar2 text-principal"></i> {year}</p>
                            <p className="text-sm text-texto-secundario"><i className="bi bi-star-fill text-principal"></i> {rating}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}