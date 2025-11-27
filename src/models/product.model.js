import { getDb } from './firebase.js';

const COLLECTION = 'products';

export async function findAll() {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).get();
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
}

export async function findById(id) {
    const db = getDb();
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
}

export async function createProduct(payload) {
    const db = getDb();
    const ref = await db.collection(COLLECTION).add(payload);
    const created = await ref.get();
    return { id: created.id, ...created.data() };
}

export async function deleteById(id) {
    const db = getDb();
    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
}