import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

function loadServiceAccount() {
    const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (jsonEnv) {
        try {
            return JSON.parse(jsonEnv);
        } catch (e) {
            try {
                return JSON.parse(Buffer.from(jsonEnv, 'base64').toString('utf8'));
            } catch (err) {
                throw new Error('FIREBASE_SERVICE_ACCOUNT no es JSON válido ni base64 decodificable');
            }
        }
    }

    if (path) {
        if (!fs.existsSync(path)) {
            throw new Error(`El archivo indicado en FIREBASE_SERVICE_ACCOUNT_PATH no existe: ${path}`);
        }
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (err) {
            throw new Error(`JSON inválido en ${path}: ${err.message}`);
        }
    }

    return null;
}

export default function initFirebase() {
    if (admin.apps && admin.apps.length) {
        // ya inicializado
        return admin.firestore();
    }

    const serviceAccount = loadServiceAccount();

    try {
        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID
            });
        } else {
            // intenta credenciales por defecto (Cloud Run, GCE, GOOGLE_APPLICATION_CREDENTIALS)
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: process.env.FIREBASE_PROJECT_ID
            });
        }

        return admin.firestore();
    } catch (err) {
        throw new Error(`Error inicializando Firebase Admin SDK: ${err.message}. ` +
            `Asegura FIREBASE_SERVICE_ACCOUNT_PATH o FIREBASE_SERVICE_ACCOUNT, o configura GOOGLE_APPLICATION_CREDENTIALS / credenciales de la plataforma.`);
    }
}

export function getDb() {
    if (!admin.apps || !admin.apps.length) {
        return initFirebase();
    }
    return admin.firestore();
}

export function getAuth() {
    if (!admin.apps || !admin.apps.length) {
        initFirebase();
    }
    return admin.auth();
}