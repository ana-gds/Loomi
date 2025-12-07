export function SectionTitle ({
                                  title,
                                  className,
                              }) {
    return (
        <p className={`section-title text-texto-principal ${className}`}>
            {title}
        </p>
    );
}