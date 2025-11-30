import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase.js";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ButtonPink } from "../../components/ui/Button/ButtonPink.jsx";
import { doc, setDoc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import {InputL} from "../../components/ui/Input/Input.jsx";

export function SetupProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    // Esperar pelo Firebase auth carregar
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

        if (!user) {
            setError("Nenhum utilizador encontrado.");
            return;
        }

        // Validar username (4-15 chars, letras minúsculas, números, . e _)
        const usernamePattern = /^[a-z0-9._]{4,15}$/;

        if (!usernamePattern.test(username)) {
            setError("O nome de utilizador deve ter 4–15 caracteres, apenas letras minúsculas, números, pontos ou underscores.");
            return;
        }

        try {
            // Verificar se o username já existe
            const q = query(
                collection(db, "users"),
                where("username", "==", username)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError("Este nome de utilizador já existe. Escolhe outro.");
                return;
            }

            // Atualizar displayName no Auth
            await updateProfile(user, {
                displayName: username
            });

            // Guardar no firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: user.email
            });


            navigate("/");

        } catch (err) {
            console.error(err);
            setError("Erro ao atualizar perfil. Tenta outra vez.");
        }
    }

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

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}

                <label className="text-texto-principal">Nome de utilizador</label>
                <InputL
                    type="text"
                    className="w-full mt-2 p-2 rounded bg-white/10 text-texto-secundario"
                    placeholder="Escolhe um username único"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <ButtonPink
                    type="submit"
                    ClassNames="mt-9 mb-4 w-full"
                    label="Guardar"
                />
            </form>
        </div>
    );
}
