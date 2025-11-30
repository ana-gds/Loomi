import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createUserWithEmailAndPassword,
    browserLocalPersistence,
    browserSessionPersistence,
    setPersistence,
} from "firebase/auth";

import { auth } from "../../firebase/firebase.js";
import { useAuth } from '../../firebase/AuthContext';

import { InputL } from "../../components/ui/Input/Input.jsx";
import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";

export function Register() {
    const navigate = useNavigate();

    // Puxar loginWithGoogle do AuthContext (igual ao Login)
    const { loginWithGoogle } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /** ---------------------------------------------
     *  REGISTO NORMAL (EMAIL + PASSWORD)
     * --------------------------------------------- */
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== password2) {
            return setError("As palavras-passe não coincidem.");
        }

        setSubmitting(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/setup-profile");

        } catch (err) {
            setError(err.message ?? "Erro ao criar conta.");
        } finally {
            setSubmitting(false);
        }
    };

    /** ---------------------------------------------
     *  REGISTO / LOGIN COM GOOGLE
     * --------------------------------------------- */
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
                        ClassNames="mt-9 mb-4 w-full"
                        disabled={submitting}
                    />
                </div>


                {/* OU */}
                <p className="text-center text-texto-secundario text-sm mb-2">OU</p>

                <button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md w-full justify-center"
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
