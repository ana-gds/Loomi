import { db } from "./firebase";
import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    getDocs,
    collection
} from "firebase/firestore";

export async function addFavorite(userId, movie) {
    await setDoc(
        doc(db, "users", userId, "favorites", movie.id.toString()),
        movie
    );
}

export async function removeFavorite(userId, movieId) {
    await deleteDoc(
        doc(db, "users", userId, "favorites", movieId.toString())
    );
}

export async function isFavorite(userId, movieId) {
    const snap = await getDoc(
        doc(db, "users", userId, "favorites", movieId.toString())
    );
    return snap.exists();
}

export async function getFavorites(userId) {
    const ref = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => doc.data());
}
