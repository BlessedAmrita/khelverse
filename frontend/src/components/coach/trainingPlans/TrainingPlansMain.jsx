'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { db } from '@/firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import FeatureHero from '@/components/shared/FeatureHero';
import PendingPlanCard from './PendingPlanCard';
import ReviewedPlanCard from './ReviewedPlanCard'; // Corrected import path, assuming ReviewedPlanCard is in a subfolder. If not, revert.
import { toast } from 'sonner';
// import { usePlans } from '@/hooks/usePlans'; // No longer directly calling usePlans here for its fetchPlans

const TrainingPlans = () => {
    const [pendingPlans, setPendingPlans] = useState([]);
    const [reviewedPlans, setReviewedPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user);

    // fetchAthletePlans already correctly defined and memoized
    const fetchAthletePlans = useCallback(async () => {
        console.log("Starting fetchAthletePlans...");
        console.log("Current coach user data (from Redux):", user);

        if (!user || !user.uid) {
            console.log("User or user UID not available. Skipping fetch.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let connectedAthleteIds = [];
            const coachDocRef = doc(db, 'users', user.uid);
            const coachDocSnap = await getDoc(coachDocRef);

            if (coachDocSnap.exists()) {
                const coachData = coachDocSnap.data();
                connectedAthleteIds = coachData.connectedAthletes || [];
                console.log("Connected Athlete IDs fetched from coach's Firestore profile:", connectedAthleteIds);
            } else {
                console.warn("Coach's user document not found in Firestore for UID:", user.uid);
                toast.info("Your coach profile could not be loaded.");
                setLoading(false);
                return;
            }

            if (connectedAthleteIds.length === 0) {
                console.log("No connected athletes found for this coach. Displaying empty states.");
                toast.info("You don't have any connected athletes yet.");
                setPendingPlans([]);
                setReviewedPlans([]);
                setLoading(false);
                return;
            }

            console.log("Fetching athlete profiles for UIDs:", connectedAthleteIds);
            const athletesRef = collection(db, 'users');
            // Firestore 'in' query supports up to 10 items. Consider batching if connectedAthleteIds can be larger.
            const athletesQuery = query(athletesRef, where('uid', 'in', connectedAthleteIds));
            const athletesSnapshot = await getDocs(athletesQuery);

            const athletesMap = {};
            athletesSnapshot.forEach(doc => {
                const athleteData = doc.data();
                athletesMap[athleteData.uid] = athleteData;
                console.log(`Fetched athlete profile: ${athleteData.firstName} ${athleteData.lastName} (UID: ${athleteData.uid})`);
            });
            console.log("Constructed Athletes Map:", athletesMap);

            console.log(`Fetching plans where coachId is '${user.uid}' and athleteId is in:`, connectedAthleteIds);
            const plansRef = collection(db, 'plans');
            const plansQuery = query(
                plansRef,
                where('coachId', '==', user.uid),
                where('athleteId', 'in', connectedAthleteIds)
            );
            const plansSnapshot = await getDocs(plansQuery);

            const fetchedPendingPlans = [];
            const fetchedReviewedPlans = [];

            console.log(`Found ${plansSnapshot.docs.length} plans matching the query.`);
            if (plansSnapshot.empty) {
                console.log("No plans found for this coach and connected athletes.");
            }

            plansSnapshot.forEach(planDoc => {
                const planData = planDoc.data();
                const planId = planDoc.id;
                console.log(`Processing plan ID: ${planId}, Status: ${planData.status}, Athlete ID: ${planData.athleteId}, Coach ID: ${planData.coachId}`);

                const athleteProfile = athletesMap[planData.athleteId];

                if (athleteProfile) {
                    console.log(`Athlete profile found for plan ID ${planId}: ${athleteProfile.firstName}`);
                    const fullPlanData = {
                        id: planId,
                        ...planData,
                        athlete_profile: {
                            firstName: athleteProfile.firstName,
                            lastName: athleteProfile.lastName,
                            sport: athleteProfile.sport,
                            experienceLevel: athleteProfile.experienceLevel,
                        }
                    };

                    if (fullPlanData.status === 'waiting_for_approval') {
                        fetchedPendingPlans.push(fullPlanData);
                        console.log(`Plan ${planId} added to pending plans. Current pending count: ${fetchedPendingPlans.length}`);
                    } else {
                        fetchedReviewedPlans.push(fullPlanData);
                        console.log(`Plan ${planId} added to reviewed plans (Status: ${fullPlanData.status}). Current reviewed count: ${fetchedReviewedPlans.length}`);
                    }
                } else {
                    console.warn(`Athlete profile not found in map for plan ID ${planId} (Athlete ID: ${planData.athleteId}). This plan might not be shown.`);
                }
            });

            console.log("Final Pending Plans count:", fetchedPendingPlans.length);
            console.log("Final Reviewed Plans count:", fetchedReviewedPlans.length);

            setPendingPlans(fetchedPendingPlans);
            setReviewedPlans(fetchedReviewedPlans);

        } catch (error) {
            console.error("Error fetching athlete plans:", error);
            toast.error("Failed to load plans.");
        } finally {
            setLoading(false);
            console.log("Finished fetchAthletePlans.");
        }
    }, [user]);

    useEffect(() => {
        if (user && user.uid) {
            fetchAthletePlans();
        }
    }, [user, fetchAthletePlans]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-khelverse-black via-khelverse-gray to-khelverse-black w-full">
            <div className="w-full">
                <FeatureHero title={'Training Plans'} />

                <div
                    className="min-h-screen bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
                >
                    <div className="min-h-screen bg-black/55 py-8">
                        {loading ? (
                            <div className="text-center py-12 text-white">Loading plans...</div>
                        ) : (
                            <Tabs defaultValue="pending" className="w-full px-4 max-w-7xl mx-auto">
                                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-khelverse-gray border-none">
                                    <TabsTrigger
                                        value="pending"
                                        className="data-[state=active]:bg-athletePurple data-[state=active]:text-white"
                                    >
                                        Pending Review
                                        <Badge className="ml-2 bg-khelverse-purple-light text-white">
                                            {pendingPlans.length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reviewed"
                                        className="data-[state=active]:bg-athletePurple data-[state=active]:text-white"
                                    >
                                        Reviewed
                                        <Badge className="ml-2 bg-khelverse-purple-light text-white">
                                            {reviewedPlans.length}
                                        </Badge>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="pending" className="space-y-6">
                                    {pendingPlans.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="bg-khelverse-gray/50 rounded-xl p-8 border border-khelverse-purple/20">
                                                <h3 className="text-xl font-semibold text-white mb-2">No pending plans</h3>
                                                <p className="text-gray-400">All training plans have been reviewed!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {pendingPlans.map((plan) => (
                                                <PendingPlanCard
                                                    key={plan.id}
                                                    plan={plan}
                                                    // Pass the fetchAthletePlans callback as a prop
                                                    onPlanUpdated={fetchAthletePlans}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="reviewed" className="space-y-6">
                                    {reviewedPlans.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="bg-khelverse-gray/50 rounded-xl p-8 border border-khelverse-purple/20">
                                                <h3 className="text-xl font-semibold text-white mb-2">No reviewed plans</h3>
                                                <p className="text-gray-400">Start reviewing pending plans to see them here!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {reviewedPlans.map((plan) => (
                                                <ReviewedPlanCard
                                                    key={plan.id}
                                                    plan={plan}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingPlans;