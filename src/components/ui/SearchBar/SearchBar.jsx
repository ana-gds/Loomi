import {ButtonPink} from "../Button/ButtonPink.jsx";

export function Searchbar({
    type = 'input',
    placeholder = 'Pesquisa filmes, séries, documentários...',
    onChange,
    ClassNames = '',
    ...rest
    }
) {
    return (
        <>
            <div className={`flex items-center shadow-sm shadow-color-texto-principal
            rounded-2xl px-2 py-2 bg-fundo ${ClassNames}`} {...rest}>
                <i className="bi bi-search text-texto-secundario ms-1"></i>
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-2 bg-transparent outline-none text-texto-principal
                    placeholder-texto-secundario"
                    onChange={onChange}
                />
                <ButtonPink
                    label="Pesquisar"
                />
            </div>
        </>
    )
}