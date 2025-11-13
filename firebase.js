import appFirebase from './credenciales.js';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(appFirebase);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(appFirebase);

export default appFirebase;
