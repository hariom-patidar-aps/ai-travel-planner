import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

/*
=====================================
Save Expense
=====================================
*/

export async function addExpense(
  destination,
  user,
  expense
) {
  await addDoc(collection(db, "expenses"), {
    destination,
    userId: user.uid,
    ...expense,
    createdAt: serverTimestamp(),
  });
}

/*
=====================================
Load Expenses
=====================================
*/

export async function getExpenses(
  destination,
  user
) {
  const q = query(
    collection(db, "expenses"),
    where("destination", "==", destination),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
=====================================
Delete Expense
=====================================
*/

export async function deleteExpense(id) {
  await deleteDoc(doc(db, "expenses", id));
}

/*
=====================================
Total Spent
=====================================
*/

export function calculateTotal(expenses) {
  return expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );
}