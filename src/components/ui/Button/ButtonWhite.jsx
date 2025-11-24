export function ButtonWhite ({
    icon,
    onClick,
    type = 'button',
    size = '',
    translate = '',
    ClassNames = '',
    ...rest
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`text-9xl bg-fundo text-principal 
            rounded-full shadow-sm shadow-color-texto-principal px-2 py-2 
            ${ClassNames} ${size} ${translate}`}
            {...rest}
        >
            {icon}
        </button>
    );
}