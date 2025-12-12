import { ButtonPink } from "../Button/ButtonPink.jsx";

export function Searchbar({
    type = "text",
    placeholder = "Pesquisa filmes...",
    value,
    onChange,
    onSubmit,
    ClassNames = "",
                          }) {
    return (
        <form
            onSubmit={onSubmit}
            className={`flex items-center shadow-sm shadow-color-texto-principal
            rounded-2xl px-2 py-2 bg-fundo ${ClassNames}`}
        >
            <i className="bi bi-search text-texto-secundario ms-1"></i>

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                className="w-full px-2 bg-transparent outline-none text-texto-principal
                placeholder-texto-secundario"
                onChange={onChange}
            />

            <ButtonPink
                label="Pesquisar"
                type="submit"
            />
        </form>
    );
}
