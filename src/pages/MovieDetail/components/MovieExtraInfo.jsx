

export function MovieExtraInfo({ omdb }) {
    if (!omdb) return null;

    return (
            <div className="flex gap-20 pt-6 justify-between flex-wrap">

                {/* Awards */}
                {omdb.Awards && omdb.Awards !== "N/A" && (
                    <div>
                        <p className="uppercase text-xs opacity-70 mb-1">Prémios</p>
                        <p>{omdb.Awards}</p>
                    </div>
                )}

                {/* Rated / Classificação etária */}
                {omdb.Rated && (
                    <div>
                        <p className="uppercase text-xs opacity-70 mb-1">Classificação etária</p>
                        <p className="text-lg font-medium">
                            {omdb.Rated}
                        </p>
                    </div>
                )}

            </div>

    );
}
