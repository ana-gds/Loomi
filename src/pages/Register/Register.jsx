import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
import { useAuth } from '../../firebase/AuthContext';
import { InputL } from "../../components/ui/Input/Input.jsx";
import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";

export function Register() {
    const navigate = useNavigate();

    // Puxar loginWithGoogle do AuthContext
    const { loginWithGoogle } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    // Mensagem de erro para mostrar ao utilizador
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /**
     *  REGISTO NORMAL (EMAIL + PASSWORD)
     */

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        // Trim inputs
        const cleanEmail = email.trim();
        const cleanPassword = password.trim();
        const cleanPassword2 = password2.trim();

        if (cleanPassword !== cleanPassword2) {
            return setError("As palavras-passe não coincidem.");
        }

        // Validação mínima do lado do cliente
        if (!cleanEmail) return setError("Introduz um email válido.");
        if (cleanPassword.length < 6) return setError("A palavra-passe deve ter pelo menos 6 caracteres.");

        setSubmitting(true);

        try {
            await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
            navigate("/setup-profile");

        } catch (err) {
            // Mapear códigos de erro Firebase para mensagens mais amigáveis
            const code = err?.code || "";
            switch (code) {
                case "auth/email-already-in-use":
                    setError("Este email já está a ser usado por outra conta.");
                    break;
                case "auth/invalid-email":
                    setError("Email inválido.");
                    break;
                case "auth/weak-password":
                    setError("A palavra-passe é demasiado fraca.");
                    break;
                case "auth/network-request-failed":
                    setError("Erro de rede. Verifica a tua ligação.");
                    break;
                default:
                    setError(err.message ?? "Erro ao criar conta.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    /** 
     *  REGISTO / LOGIN COM GOOGLE
    */
    const handleGoogleRegister = async () => {
        setError("");
        setSubmitting(true);

        try {
            await loginWithGoogle();
            navigate("/setup-profile");

        } catch (err) {
            setError(err.message ?? "Erro ao registar com Google.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secundario">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-sm p-6 rounded-xl bg-fundo"
            >
                <h1 className="text-texto-principal text-2xl text-center font-bold mb-6 mt-4">
                    Criar conta
                </h1>

                {error && (
                    <p className="text-red-400 text-center mb-3">{error}</p>
                )}

                <InputL
                    label="Email"
                    placeholder="O teu email"
                    type="email"
                    icon={<i className="bi bi-envelope"></i>}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="mt-4">
                    <InputL
                        label="Palavra-passe"
                        placeholder="A tua palavra-passe"
                        type="password"
                        icon={<i className="bi bi-lock"></i>}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <InputL
                        label="Confirmar palavra-passe"
                        placeholder="Repete a palavra-passe"
                        type="password"
                        icon={<i className="bi bi-lock-fill"></i>}
                        required
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>

                <div className="flex justify-center">
                    <ButtonPink
                        label={submitting ? "A criar conta..." : "Registar"}
                        type="submit"
                        ClassNames="mt-9 mb-4 w-75"
                        disabled={submitting}
                    />
                </div>


                <p className="text-center text-texto-secundario text-sm mb-2">OU</p>

                <button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md w-75 justify-center"
                >
                    <i className="bi bi-google"></i>
                    Registar com Google
                </button>

                <p className="text-center text-texto-secundario text-sm mt-6">
                    Já tens conta?{" "}
                    <button
                        type="button"
                        className="text-principal underline"
                        onClick={() => navigate("/login")}
                    >
                        Entrar
                    </button>
                </p>
            </form>
        </div>
    );
}
