import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
import { InputL } from "../../components/ui/Input/Input.jsx";
import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";
import { useNavigate } from "react-router-dom";

export function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/"); // redireciona para a homepage
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secundario ">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-sm p-6 rounded-xl bg-fundo"
            >
                <h1 className="text-texto-principal text-2xl text-center font-bold mb-6 mt-4">
                    Criar conta
                </h1>

                <InputL
                    label="Email"
                    placeholder="O teu email"
                    icon={<i className="bi bi-envelope"></i>}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="mt-4">
                    <InputL
                        label="Palavra-passe"
                        placeholder="A tua palavra-passe"
                        icon={<i className="bi bi-lock"></i>}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-center">
                    <ButtonPink
                        label="Registar"
                        type="submit"
                        ClassNames="mt-9 mb-4"
                    />
                </div>
            </form>
        </div>
    );
}
