import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase.js";

import { ButtonPink } from "../../ui/Button/ButtonPink.jsx";

/*
  NavBar:
 - controla o estado do menu de perfil (openProfile)
 - permite terminar sessão usando Firebase Auth
 - usa useNavigate para redirecionar após o logout
*/

export function NavBar() {
    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();

    // Faz logout do usuário e navega para /login
    async function handleLogout() {
        try {
            await signOut(auth);
            navigate("/login");
        } catch {
            alert("Erro ao terminar sessão.");
        }
    }

    return (
        <>
            <header className="bg-secundario min-h-20 flex items-center justify-between shadow-sm shadow-color-texto-principal">
                <h1 className="logo inline-block ms-20 cursor-pointer" onClick={() => navigate("/")}>LOOMI</h1>
                <div className="flex items-center gap-7 relative">
                    <ButtonPink label="Favoritos" onClick={() => navigate("/favoritos")} />

                    <button
                        type="button"
                        onClick={() => setOpenProfile((prev) => !prev)}
                        className="relative me-20 z-20"
                    >
                        <i className="bi bi-person-circle text-principal text-4xl mb-0.5 cursor-pointer"></i>

                        {openProfile && (
                            <div className="absolute right-0 mt-2 w-40 bg-fundo rounded-lg shadow-lg py-2">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-texto-principal hover:bg-secundario/60"
                                >
                                    Terminar sessão
                                </button>
                            </div>
                        )}
                    </button>
                </div>
            </header>
        </>
    );
}