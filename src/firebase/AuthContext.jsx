import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase';

/**
 * AuthContext
 * - Fornece `user` (Firebase User | null) e `loading` (quando o auth está a inicializar).
 * - Exporta helpers `loginWithGoogle` e `logout` para serem usados pelos componentes UI.
 */

const AuthContext = createContext({ user: null, loading: true });
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscreve ao Firebase Auth; o callback corre sempre que a sessão muda.
        const unsub = onAuthStateChanged(auth, current => {
            setUser(current);
            setLoading(false);
        });
        // Remove o listener quando o Provider é desmontado.
        return () => unsub();
    }, []);

    /**
     * logout
     * Wrapper assíncrono para `signOut` com logging de erro.
     * Os componentes podem `await logout()` e tratar UI localmente.
     */
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Erro ao fazer logout:', err);
            throw err;
        }
    };

    /**
     * loginWithGoogle
     * Abre o popup do Google e devolve a Promise do Firebase.
     */
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result;
        } catch (err) {
            console.error('Erro ao autenticar com Google:', err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

// Encapsula variáveis e funções do contexto para uso nos componentes.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
