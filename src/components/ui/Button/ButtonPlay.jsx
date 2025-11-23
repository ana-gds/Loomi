export function ButtonPlay ({
    icon,
    onClick,
    type = 'button',
    ClassNames = '',
    ...rest
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`text-base bg-gradient-to-t from-principal to-gradiente text-fundo 
            rounded-xl shadow-sm shadow-color-texto-principal px-4 py-2 ${ClassNames}`}
            {...rest}
        >
            {icon}
        </button>
    );
}