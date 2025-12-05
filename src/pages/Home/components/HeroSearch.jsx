import {Searchbar} from "../../../components/ui/SearchBar/SearchBar.jsx";

export function HeroSearch() {
    return (
        <>
            <section className="hero text-center bg-gradient-to-t from-fundo to-secundario ">
                <p className="hero-title font-normal text-texto-principal pt-20">Descobre o teu próximo</p>
                <p className="hero-title font-semibold text-principal">filme favorito</p>
                <p className="hero-subtitle text-texto-secundario mt-7">Milhares de filmes, séries e documentários à tua espera</p>
                <div className="mt-8 w-full max-w-xl justify-center mx-auto pb-20">
                    <Searchbar placeholder={"Procura por filmes, séries, documentários..."} />
                </div>
            </section>
        </>
    )
}