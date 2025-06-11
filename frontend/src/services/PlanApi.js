const API_BASE_URL = 'https://khelverse-perf-gen.hf.space/api/v1';

export const generatePlan = async (athleteProfile, planType, focus, timeToAchieve) => {
    try {
        const response = await fetch(`${API_BASE_URL}/plans/generate`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                athlete_profile: athleteProfile,
                plan_type: planType,
                focus: focus,
                time_to_achieve: timeToAchieve,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate plan');
        }

        return await response.json();
    } catch (error) {
        console.error("Error generating plan:", error);
        throw error;
    }
};

export const revisePlan = async (originalPlan, review) => {
    try {
        const response = await fetch(`${API_BASE_URL}/plans/revise`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                original_plan: originalPlan,
                review: review,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to revise plan');
        }

        return await response.json();
    } catch (error) {
        console.error("Error revising plan:", error);
        throw error;
    }
};