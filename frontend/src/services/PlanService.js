import { db } from '@/firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

const plansCollectionRef = collection(db, 'plans');

export const getPlans = async (userId = null) => {
    try {
        let q = query(plansCollectionRef, orderBy("createdAt", "desc"));
        if (userId) {
             q = query(plansCollectionRef, where("athleteId", "==", userId), orderBy("createdAt", "desc"));
        }
        const data = await getDocs(q);
        return data.docs.map(doc => ({ ...doc.data(), id: doc.id, createdAt: doc.data().createdAt?.toDate().toISOString() }));
    } catch (error) {
        console.error("Error fetching plans:", error);
        return [];
    }
};

export const addPlan = async (planData) => {
    try {
        const docRef = await addDoc(plansCollectionRef, {
            ...planData,
            createdAt: serverTimestamp(),
        });
        return { id: docRef.id, ...planData, createdAt: new Date().toISOString() };
    } catch (error) {
        console.error("Error adding plan:", error);
        throw error;
    }
};

export const updatePlanStatus = async (planId, newStatus) => {
    try {
        const planDocRef = doc(db, 'plans', planId);
        await updateDoc(planDocRef, { status: newStatus });
        console.log(`Plan ${planId} status updated to ${newStatus}`);
    } catch (error) {
        console.error("Error updating plan status:", error);
        throw error;
    }
};

export const updatePlan = async (planId, updatedPlanData) => {
    try {
        const planDocRef = doc(db, 'plans', planId);
        await updateDoc(planDocRef, {
            ...updatedPlanData,
            lastRevisedAt: serverTimestamp() 
        });
        console.log(`Plan ${planId} updated.`);
    } catch (error) {
        console.error("Error updating plan:", error);
        throw error;
    }
};