import { useState, useEffect, useCallback } from 'react';
import { generatePlan as apiGeneratePlan, revisePlan as apiRevisePlan } from '@/services/PlanApi';
import { getPlans, addPlan, updatePlanStatus, updatePlan } from '@/services/PlanService';
import { auth } from '@/firebase/firebase';

export const usePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentAthleteId = auth.currentUser ? auth.currentUser.uid : null;
    const fetchPlans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Only fetch plans if currentAthleteId is available
            if (currentAthleteId) {
                const fetchedPlans = await getPlans(currentAthleteId);
                setPlans(fetchedPlans);
            } else {
                setPlans([]); // Clear plans if no athlete is logged in
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentAthleteId]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const generateNewPlan = async (athleteProfile, planType, focus, timeToAchieve, hasCoach, connectedCoachId) => {
        setLoading(true);
        setError(null);
        try {
            const newPlanFromApi = await apiGeneratePlan(athleteProfile, planType, focus, timeToAchieve);
            const planStatus = hasCoach ? 'waiting_for_approval' : 'waiting_for_approval';

            const planToSave = {
                ...newPlanFromApi,
                athlete_profile: athleteProfile,
                focus: focus,
                time_to_achieve: timeToAchieve,
                status: planStatus,
                coachId: connectedCoachId || null, 
                athleteId: currentAthleteId,
                createdBy: currentAthleteId,
            };
            const savedPlan = await addPlan(planToSave);
            setPlans((prevPlans) => [{ ...savedPlan, createdAt: savedPlan.createdAt }, ...prevPlans]);
            return savedPlan;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const reviseExistingPlan = async (planToRevise, reviewFeedback) => {
        setLoading(true);
        setError(null);
        try {
            const originalPlanDetailsForApi = {
                plan: planToRevise.plan,
                no_of_days_req: planToRevise.no_of_days_req,
                no_of_weeks_req: planToRevise.no_of_weeks_req,
                weekStart: planToRevise.weekStart,
                athlete_profile: planToRevise.athlete_profile,
                focus: planToRevise.focus,
                time_to_achieve: planToRevise.time_to_achieve,
                type: planToRevise.type,
            };
            const revisedPlanFromApi = await apiRevisePlan(originalPlanDetailsForApi, reviewFeedback);
            const updatedData = {
                plan: revisedPlanFromApi.plan,
                no_of_days_req: revisedPlanFromApi.no_of_days_req,
                no_of_weeks_req: revisedPlanFromApi.no_of_weeks_req,
                weekStart: revisedPlanFromApi.weekStart,
                status: 'active', // After revision, it becomes active
                lastRevisedAt: new Date().toISOString(), 
            };
            await updatePlan(planToRevise.id, updatedData); 
            setPlans((prevPlans) =>
                prevPlans.map((p) => (p.id === planToRevise.id ? { ...p, ...updatedData, lastRevisedAt: new Date().toISOString() } : p)), 
            );
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updatePlanApprovalStatus = async (planId, status) => {
        setLoading(true);
        setError(null);
        try {
            await updatePlanStatus(planId, status); // Update status in Firebase
            setPlans((prevPlans) =>
                prevPlans.map((p) => (p.id === planId ? { ...p, status: status } : p)),
            );
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const restartPlan = async (originalPlan) => {
        console.log('Attempting to restart plan based on:', originalPlan);
        setLoading(true);
        setError(null);
        try {
            await updatePlanStatus(originalPlan.id, 'past_plan');
            const newRestartedPlanData = await apiGeneratePlan(
                originalPlan.athlete_profile,
                originalPlan.type,
                originalPlan.focus,
                originalPlan.time_to_achieve,
            );

            // 3. Save the new plan to Firebase
            const planToSave = {
                ...newRestartedPlanData,
                athlete_profile: originalPlan.athlete_profile,
                focus: originalPlan.focus,
                time_to_achieve: originalPlan.time_to_achieve,
                status: 'active', // A restarted plan can be active immediately
                coachId: originalPlan.coachId || null, // Retain original coachId for the new plan
                athleteId: currentAthleteId,
                createdBy: currentAthleteId,
            };
            const savedPlan = await addPlan(planToSave);

            // 4. Update local state to reflect both the old plan's new status and the new plan
            setPlans((prevPlans) => [
                { ...savedPlan, createdAt: savedPlan.createdAt }, // New plan at the top
                ...prevPlans.map((p) => (p.id === originalPlan.id ? { ...p, status: 'past_plan' } : p)), // Update status of old plan
            ]);
            return savedPlan;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        plans,
        loading,
        error,
        generateNewPlan,
        reviseExistingPlan,
        updatePlanApprovalStatus,
        restartPlan,
        fetchPlans,
    };
};