export function ButtonWhite ({
     icon,
     onClick,
     type = 'button',
     size = 'w-18 h-18',
     translate = '',
     ClassNames = '',
     ...rest
                             }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`
                bg-white text-principal 
                rounded-full shadow-md shadow-texto-principal/20
                flex items-center justify-center
                ${size} ${ClassNames} ${translate}
            `}
            {...rest}
        >
            {icon}
        </button>
    );
}
