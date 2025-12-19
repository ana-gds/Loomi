import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
import { InputL } from "../../components/ui/Input/Input.jsx";
import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";
import { useNavigate } from "react-router-dom";
import {GrayDiv} from "../../components/ui/Divs/GrayDiv.jsx";

/**
 * Login page
 * - Permite autenticação por email/password
 * - Permite autenticação via Google (popup)
 */

export function Login() {
    // Campos do formulário
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Mensagem de erro (visível no topo do form)
    const [error, setError] = useState("");

    // Estado de submissão para evitar envios duplicados e mostrar feedback
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    /**
     * handleLogin
     * Autentica com email e password, usaa SDK do Firebase Auth.
     * Em caso de sucesso redireciona para a homepage.
     * Em caso de erro apresenta mensagem genérica.
     */
    async function handleLogin(e) {
        e.preventDefault();
        if (loading) return; 
        setError("");
        setLoading(true);

        // Normalizar email e remover espaços
        const emailTrim = (email || "").trim().toLowerCase();
        const passwordRaw = password || "";

        try {
            await signInWithEmailAndPassword(auth, emailTrim, passwordRaw);
            navigate("/");
        } catch (err) {
            // Mapear alguns códigos comuns do Firebase para mensagens amigáveis
            const code = err?.code || "";
            if (code === "auth/wrong-password" || code === "auth/user-not-found") {
                setError("Email ou palavra-passe incorretos.");
            } else if (code === "auth/invalid-email") {
                setError("Email inválido.");
            } else if (code === "auth/too-many-requests") {
                setError("Muitas tentativas falhadas. Tenta de novo mais tarde.");
            } else {
                setError("Erro ao iniciar sessão. Verifica a tua ligação e tenta de novo.");
            }
        } finally {
            setLoading(false);
        }
    }

    /**
     * handleGoogleLogin
     * Abre um popup do Google para autenticação. Se o utilizador já tiver conta
     * ligada ao mesmo email, o Firebase associa automaticamente.
     */
    async function handleGoogleLogin() {
        if (loading) return;
        setError("");
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (err) {
            const code = err?.code || "";
            if (code === "auth/popup-closed-by-user") {
                setError(""); 
            } else {
                setError("Erro ao entrar com Google. Verifica as definições do popup.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secundario ">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm p-6 rounded-xl bg-fundo"
            >
                <h1 className="text-texto-principal text-2xl text-center font-bold mb-6 mt-4">Iniciar sessão</h1>

                {/* Exibe mensagem de erro quando existe */}
                {error && (
                    <p role="alert" aria-live="assertive" className="text-red-400 text-center mb-3">{error}</p>
                )}

                {/* Campo Email controlado */}
                <InputL
                    label="Email"
                    placeholder="O teu email"
                    icon={<i className="bi bi-envelope"></i>}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />

                {/* Campo Palavra-passe controlado */}
                <div className="mt-4">
                    <InputL
                        label="Palavra-passe"
                        placeholder="A tua palavra-passe"
                        icon={<i className="bi bi-lock"></i>}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                {/* Botão de submit do formulário */}
                <div className="flex justify-center">
                    <ButtonPink
                        label={loading ? "Entrando..." : "Entrar"}
                        type="submit"
                        disabled={loading}
                        ClassNames="mt-9 mb-4 w-75"
                    />
                </div>

                <p className="text-center text-texto-secundario text-sm mb-2">OU</p>

                {/* Autenticação via Google (popup) */}
                <div className="flex justify-center mt-3">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex justify-center gap-2 bg-white text-black px-4 py-2 w-75 rounded-lg shadow-md cursor-pointer"
                        aria-label="Entrar com Google"
                        disabled={loading}
                    >
                        <i className="bi bi-google"></i>
                        {loading ? "A processar..." : "Entrar com Google"}
                    </button>
                </div>

                {/* Link para registo */}
                <p className="text-center text-texto-secundario text-sm mt-6">
                    Ainda não tens conta?{" "}
                    <button
                        type="button"
                        className="text-principal underline cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Registra-te.
                    </button>
                </p>
            </form>
        </div>
    );
}
