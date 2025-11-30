import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
import { InputL } from "../../components/ui/Input/Input.jsx";
import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";
import { useNavigate } from "react-router-dom";


export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /** ---------------------------------------------
     * LOGIN NORMAL (EMAIL + PASSWORD)
     * --------------------------------------------- */
    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError("Email ou palavra-passe incorretos.");
        }
    }

    /** ---------------------------------------------
     * LOGIN COM GOOGLE
     * --------------------------------------------- */
    async function handleGoogleLogin() {
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (err) {
            setError("Erro ao entrar com Google.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secundario ">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm p-6 rounded-xl bg-fundo"
            >
                <h1 className="text-texto-principal text-2xl text-center font-bold mb-6 mt-4">Iniciar sessão</h1>

                {error && (
                    <p className="text-red-400 text-center mb-3">{error}</p>
                )}

                {/* Email */}
                <InputL
                    label="Email"
                    placeholder="O teu email"
                    icon={<i className="bi bi-envelope"></i>}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* Password */}
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

                {/* Botão login */}
                <div className="flex justify-center">
                    <ButtonPink
                        label="Entrar"
                        type="submit"
                        ClassNames="mt-9 mb-4"
                    />
                </div>

                {/* OU */}
                <p className="text-center text-white/60 text-sm mb-2">OU</p>

                {/* Google Login */}
                <div className="flex justify-center mt-3">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md"
                    >
                        <i className="bi bi-google"></i>
                        Entrar com Google
                    </button>
                </div>
            </form>
        </div>
    );
}
