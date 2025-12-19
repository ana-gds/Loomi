import { db } from "./firebase";
import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    getDocs,
    collection
} from "firebase/firestore";


/**
 * addFavorite
 * Guarda um filme como favorito do utilizador.
 */

export async function addFavorite(userId, movieId) {
    // Validação básica
    if (!userId || !movieId) {
        throw new Error("userId e movieId são obrigatórios");
    }
    await setDoc(
        doc(db, "users", userId, "favorites", movieId.toString()),
        { id: movieId }
    );
}

/**
 * removeFavorite
 * Remove um filme da lista de favoritos do utilizador.
 * Se não existe, não lança erro
 */
export async function removeFavorite(userId, movieId) {
    if (!userId || !movieId) {
        throw new Error("userId e movieId são obrigatórios");
    }
    await deleteDoc(
        doc(db, "users", userId, "favorites", movieId.toString())
    );
}

/**
 * isFavorite
 * Verifica se um filme já está salvo como favorito.
 */

export async function isFavorite(userId, movieId) {
    if (!userId || !movieId) {
        throw new Error("userId e movieId são obrigatórios");
    }
    const snap = await getDoc(
        doc(db, "users", userId, "favorites", movieId.toString())
    );
    return snap.exists();
}

/**
 * getFavorites
 * Vai buscar todos os favoritos do utilizador.
 */

export async function getFavorites(userId) {
    if (!userId) {
        throw new Error("userId é obrigatório");
    }
    const ref = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => doc.data());
}
