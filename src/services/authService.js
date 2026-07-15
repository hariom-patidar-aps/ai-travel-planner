import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase";

// Google Provider
const googleProvider = new GoogleAuthProvider();

/* ===========================
   Google Login
=========================== */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/* ===========================
   Email Signup
=========================== */
export async function signupWithEmail(name, email, password) {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (name) {
    await updateProfile(result.user, {
      displayName: name,
    });
  }

  return result.user;
}

/* ===========================
   Email Login
=========================== */
export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}

/* ===========================
   Logout
=========================== */
export async function logoutUser() {
  await signOut(auth);
}

/* ===========================
   Current User Listener
=========================== */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/* ===========================
   Get Current User
=========================== */
export function getCurrentUser() {
  return auth.currentUser;
}