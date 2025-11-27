import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase';

// Guarda os dados de autenticação (utilizador + estado de loading) para toda a app.
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

    // Helper simples para permitir logout sem importar funções do Firebase em cada componente.
    const logout = () => signOut(auth);
    // Login com Google; pode ser chamado nos componentes de UI.
    const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

    return (
        <AuthContext.Provider value={{ user, loading, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

// Encapsula variáveis e funções do contexto para uso nos componentes.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
