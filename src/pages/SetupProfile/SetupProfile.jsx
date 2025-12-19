import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase.js";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";
import { doc, setDoc, query, where, collection, getDocs } from "firebase/firestore";
import {InputL} from "../../components/ui/Input/Input.jsx";

/**
 * SetupProfile
 * Página de configuração de perfil para utilizadores recém-registados.
 * Permite escolher um username único e atualizar o perfil no Firebase Auth e Firestore.
 */
export function SetupProfile() {
    const navigate = useNavigate();
    
    // Estado de autenticação
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Form state
    const [username, setUsername] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Aguardar pelo Firebase auth carregar
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingUser(false);
        });

        return () => unsubscribe();
    }, []);

    async function handleSave(e) {
        e.preventDefault();
        setError("");

        // Validação: utilizador autenticado
        if (!user) {
            setError("Nenhum utilizador encontrado.");
            return;
        }

        // Normalizar e validar username (4-15 chars, a-z0-9 . _ )
        const clean = (username || "").trim().toLowerCase();
        const usernamePattern = /^[a-z0-9._]{4,15}$/; // Regex para validar formato

        if (!usernamePattern.test(clean)) {
            setError("O nome de utilizador deve ter 4–15 caracteres; usa letras minúsculas, números, pontos ou underscores.");
            return;
        }

        setSubmitting(true);
        try {
            // Verificar se o username já existe no Firestore 
            const q = query(
                collection(db, "users"),
                where("username", "==", clean)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Username já existe
                setError("Este nome de utilizador já existe. Escolhe outro.");
                setSubmitting(false);
                return;
            }

            // Atualizar displayName no Firebase Auth 
            await updateProfile(user, {
                displayName: clean
            });

            // Guardar documento do utilizador no Firestore com username e email
            await setDoc(doc(db, "users", user.uid), {
                username: clean,
                email: user.email
            });

            navigate("/");

        } catch (err) {
            // Log para debugging; mostrar ao utilizador uma mensagem clara
            console.error("Erro ao atualizar perfil:", err);
            const code = err?.code || "";
            if (code === "permission-denied") {
                setError("Sem permissões para atualizar o perfil. Tenta novamente mais tarde.");
            } else if (code === "unavailable") {
                setError("Serviço temporariamente indisponível. Tenta mais tarde.");
            } else {
                setError("Erro ao atualizar perfil. Tenta outra vez.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    // Mostra loading enquanto aguarda o Firebase Auth carregar
    if (loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secundario">
                <p className="text-white">A carregar...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secundario">
            <form
                onSubmit={handleSave}
                className="w-full max-w-sm p-6 rounded-xl bg-fundo"
            >
                <h1 className="text-texto-principal text-2xl text-center font-bold mb-6 mt-4">
                    Completar Perfil
                </h1>

                {/* Mensagem de erro*/}
                {error && (
                    <p role="alert" aria-live="assertive" className="text-red-400 text-center mb-4">{error}</p>
                )}

                {/* Campo de username */}
                <label htmlFor="username" className="text-texto-principal">Nome de utilizador</label>
                <InputL
                    id="username"
                    name="username"
                    type="text"
                    className="w-full mt-2 p-2 rounded bg-white/10 text-texto-secundario"
                    placeholder="Escolhe um username único"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-describedby="usernameHelp"
                    required
                />
                {/* Texto de ajuda */}
                <p id="usernameHelp" className="text-xs text-texto-secundario mt-2">4–15 caracteres: letras minúsculas, números, pontos ou underscores.</p>

                {/* Botão de submit */}
                <ButtonPink
                    type="submit"
                    ClassNames="mt-9 mb-4 w-full"
                    label={submitting ? "A guardar..." : "Guardar"}
                    disabled={submitting}
                />
            </form>
        </div>
    );
}
