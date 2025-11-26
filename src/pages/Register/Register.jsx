import { useState } from "react";
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { auth } from "../../firebase/firebase.js";
    import { InputL } from "../../components/ui/Input/Input.jsx";
    import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";
import { useNavigate } from "react-router-dom";


// Componente de página para registo de utilizador usando Firebase Authentication
    export function Register() {
        // Estados controlados para o formulário
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const navigate = useNavigate();

        /**
         * Handler do submit do formulário.
         * Prevê o comportamento por omissão e tenta criar a conta com Firebase.
         */
        async function handleRegister(e) {
            e.preventDefault();

            try {
                // Cria utilizador com email e password
                await createUserWithEmailAndPassword(auth, email, password);
                navigate("/");
            } catch (err) {
                // Exibe mensagem de erro retornada pelo Firebase
                alert(err.message);
            }
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-secundario">
                {/* Formulário de registo */}
                <form
                    onSubmit={handleRegister}
                    className="w-full max-w-sm p-6 rounded-xl bg-fundo"
                >
                    <h1 className="text-texto-principal text-2xl text-center font-bold mb-6">Criar conta</h1>

                    {/* Campo de email */}
                    <InputL
                        label="Email"
                        placeholder="O teu email"
                        icon={<i className="bi bi-envelope"></i>}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className=""
                    />

                    {/* Campo de palavra-passe */}
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

                    {/* Botão de submissão */}
                    <div className="flex justify-center">
                        <ButtonPink
                            label="Registar"
                            type="submit"
                            ClassNames="mt-9"
                        />
                    </div>
                </form>
            </div>
        );
    }