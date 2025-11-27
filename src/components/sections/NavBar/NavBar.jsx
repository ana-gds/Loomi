import {ButtonPink} from "../../ui/Button/ButtonPink.jsx";

export function NavBar() {
    return (
        <>
            <header className="bg-secundario min-h-20 flex items-center justify-between shadow-sm shadow-color-texto-principal">
            <h1 className="logo inline-block ms-20">LOOMI</h1>
                <div className="flex items-center gap-7">
                    <ButtonPink label={"Favoritos"}>
                    </ButtonPink>
                    <i className="bi bi-person-circle text-principal text-4xl me-20 mb-0.5"></i>
                </div>
            </header>
        </>
    )
}