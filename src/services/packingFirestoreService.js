import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

// ===============================
// Save Packing List
// ===============================

export async function savePackingList(
  destination,
  user,
  items
) {
  if (!user) return;

  await addDoc(
    collection(db, "packingLists"),
    {
      userId: user.uid,
      destination,
      items,
      createdAt: serverTimestamp(),
    }
  );
}

// ===============================
// Load Packing Lists
// ===============================

export async function getPackingLists(
  destination,
  user
) {
  if (!user) return [];

  const q = query(
    collection(db, "packingLists"),
    where("userId", "==", user.uid),
    where("destination", "==", destination),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// ===============================
// Delete Packing List
// ===============================

export async function deletePackingList(id) {
  await deleteDoc(
    doc(db, "packingLists", id)
  );
}