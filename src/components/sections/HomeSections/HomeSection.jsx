import {Card} from "../../ui/Card/Card.jsx";

export function HomeSection () {
    return (
        <section className="ms-20 mt-16 ">
            <p className="section-title text-texto-principal">Top 10 da semana</p>
            <div className="w-40 h-1.5 bg-principal rounded-full mt-2 mb-8"></div>
            <Card></Card>
        </section>
    )
}