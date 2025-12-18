import { db } from "./firebase";
import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    getDocs,
    collection
} from "firebase/firestore";

// Guarda um filme como favorito do usuário atual
export async function addFavorite(userId, movieId) {
    await setDoc(
        doc(db, "users", userId, "favorites", movieId.toString()),
        { id: movieId }
    );
}

// Remove um filme da lista de favoritos do usuário
export async function removeFavorite(userId, movieId) {
    await deleteDoc(
        doc(db, "users", userId, "favorites", movieId.toString())
    );
}

// Verifica se um filme já está salvo como favorito
export async function isFavorite(userId, movieId) {
    const snap = await getDoc(
        doc(db, "users", userId, "favorites", movieId.toString())
    );
    return snap.exists();
}

// Vai buscar todos os favoritos do usuário e devolve apenas os dados dos docs
export async function getFavorites(userId) {
    const ref = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => doc.data());
}
