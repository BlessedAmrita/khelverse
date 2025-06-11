import { doc, getDocs, updateDoc, collection, query, where, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// 🔄 Set all plans for the athlete to isCurrent: false
async function clearCurrentPlans(athleteId) {
  const plansRef = collection(db, "plans");
  const q = query(plansRef, where("athleteId", "==", athleteId));
  const querySnapshot = await getDocs(q);
  for (const docSnap of querySnapshot.docs) {
    await updateDoc(doc(db, "plans", docSnap.id), { isCurrent: false });
  }
}

// ✅ Approve a plan
export async function approvePlan(planId, athleteId) {
  await clearCurrentPlans(athleteId);
  await updateDoc(doc(db, "plans", planId), {
    status: "approved",
    isCurrent: true,
  });
}

// ❌ Reject a plan
export async function rejectPlan(planId) {
  await updateDoc(doc(db, "plans", planId), {
    status: "rejected",
    isCurrent: false,
  });
}

// // 🔁 Submit revised plan
// export async function submitRevision(originalPlan, review, metaData) {
//   const res = await fetch("https://khelverse-perf-gen.hf.space/api/v1/plans/revise", {
//     method: "POST",
//     headers: {
//       "accept": "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       original_plan: {
//         type: originalPlan.type,
//         weekStart: originalPlan.weekStart,
//         plan: originalPlan.plan,
//         no_of_days_req: originalPlan.no_of_days_req,
//         no_of_weeks_req: originalPlan.no_of_weeks_req,
//         status: "active",
//       },
//       review,
//     }),
//   });

//   const revisedPlan = await res.json();

//   await addDoc(collection(db, "plans"), {
//     ...metaData,
//     plan: revisedPlan.plan,
//     type: revisedPlan.type,
//     weekStart: revisedPlan.weekStart,
//     no_of_days_req: revisedPlan.no_of_days_req,
//     no_of_weeks_req: revisedPlan.no_of_weeks_req,
//     createdAt: new Date(),
//     status: "revised",
//     isCurrent: false,
//     feedback: review,
//   });
// }

// 🔁 Submit revised plan
export async function submitRevision(planId, originalPlan, review) {
  const res = await fetch("https://khelverse-perf-gen.hf.space/api/v1/plans/revise", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      original_plan: {
        type: originalPlan.type,
        weekStart: originalPlan.weekStart,
        plan: originalPlan.plan,
        no_of_days_req: originalPlan.no_of_days_req,
        no_of_weeks_req: originalPlan.no_of_weeks_req,
        status: "active",
      },
      review,
    }),
  });

  const revisedPlan = await res.json();

  await updateDoc(doc(db, "plans", planId), {
    plan: revisedPlan.plan,
    type: revisedPlan.type,
    weekStart: revisedPlan.weekStart,
    no_of_days_req: revisedPlan.no_of_days_req,
    no_of_weeks_req: revisedPlan.no_of_weeks_req,
    status: "revised",
    feedback: review,
    revised: true,
    revisedAt: new Date(),
  });
}
