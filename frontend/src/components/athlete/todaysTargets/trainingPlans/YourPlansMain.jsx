import React, { useEffect, useState} from 'react'; // Added useCallback
import { Button, useDisclosure, Spinner } from "@heroui/react";
import { GeneratePlanModal } from './GeneratePlanModal';
import { PlanCard } from './PlanCard';
import { PlanViewModal } from './PlanViewModal';
import { RevisePlanModal } from './RevisePlanModal'; // Keep this import
import { usePlans } from '@/hooks/usePlans';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db  } from '@/firebase/firebase';
import { doc, getDoc } from "firebase/firestore";
import Loader from '@/components/shared/Loader';


export const YourPlansMain = () => {
  const { isOpen: isGenerateModalOpen, onOpen: onGenerateModalOpen, onOpenChange: onGenerateModalOpenChange } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onOpenChange: onViewModalOpenChange } = useDisclosure();
  const { isOpen: isReviseModalOpen, onOpen: onReviseModalOpen, onOpenChange: onReviseModalOpenChange } = useDisclosure();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanToRevise, setSelectedPlanToRevise] = useState(null); // State for the plan being revised

  // Get current Firebase user for UID
  const currentUserFirebase = auth.currentUser;
  const currentAthleteId = currentUserFirebase ? currentUserFirebase.uid : null;

  // States for user role and coach connection, managed locally in this component
  const [hasCoach, setHasCoach] = useState(null);
  const [role, setRole] = useState(null); 
  const [connectedCoachId, setConnectedCoachId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userData, setUserData] = useState(null)
  const {
    plans,
    loading, 
    error,
    generateNewPlan,
    reviseExistingPlan, 
    updatePlanApprovalStatus,
    restartPlan,
    fetchPlans,
    stopPlan,
  } = usePlans();

  // Effect to fetch user role and connected coach details from Firestore
  useEffect(() => {
    const fetchUserDetailsAndCoach = async () => {
      setLoadingAuth(true);
      if (!currentAthleteId) {
        setRole(null);
        setHasCoach(false);
        setConnectedCoachId(null);
        setLoadingAuth(false);
        return;
      }

      try {
        // Fetch user document from Firestore using the currentAthleteId
        const userDoc = await getDoc(doc(db, "users", currentAthleteId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
          setRole(userData.role); 
          setHasCoach(!!userData.connectedCoachId); 
          setConnectedCoachId(userData.connectedCoachId || null);
        } else {
          console.warn("User document not found for:", currentAthleteId);
          setRole(null);
          setHasCoach(false);
          setConnectedCoachId(null);
        }
      } catch (err) {
        console.error("Error fetching user details or coach connection:", err);
        setRole(null);
        setHasCoach(false);
        setConnectedCoachId(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    // Subscribe to Firebase Auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserDetailsAndCoach();
      } else {
        setRole(null);
        setHasCoach(false);
        setConnectedCoachId(null);
        setLoadingAuth(false); 
      }
    });
    return () => unsubscribe();
  }, [currentAthleteId]);


  // Handler for generating a new plan
  const handleGeneratePlan = async (athleteProfile, planType, focus, timeToAchieve) => {
    // Pass hasCoach and connectedCoachId to generateNewPlan in usePlans
    const generated = await generateNewPlan(athleteProfile, planType, focus, timeToAchieve, hasCoach, connectedCoachId);
    if (generated) {
      toast.success('Plan generated successfully!');
      onGenerateModalOpenChange(false);
      fetchPlans(); // Re-fetch plans to update the list
    } else {
      toast.error('Failed to generate plan.');
    }
  };

  // Handler to open the plan view modal
  const handleOpenPlan = (plan) => {
    setSelectedPlan(plan);
    onViewModalOpen();
  };

  // Handler to open the revise modal
  const handleOpenReviseModal = (plan) => {
    setSelectedPlanToRevise(plan);
    onReviseModalOpen();
  };

  // Handler for submitting the revision (this was commented out, now activate it)
  const handleRevisePlan = async (plan, reviewFeedback) => {
    console.log("Submitting revision for plan:", plan, "with feedback:", reviewFeedback);
    try {
      const success = await reviseExistingPlan(plan, reviewFeedback);
      if (success) {
        toast.success('Plan revised successfully!');
        onReviseModalOpenChange(false); // Close the modal
        setSelectedPlanToRevise(null); // Clear selected plan
        fetchPlans(); // Re-fetch plans to update the list
      } else {
        toast.error('Failed to revise plan.');
      }
    } catch (err) {
      console.error("Error revising plan:", err);
      toast.error(`Error: ${err.message}`);
    }
  };

  // Handlers for approval/rejection (for coaches)
  const handleApprovePlan = async (planId) => {
    console.log("Approving plan with ID:", planId);
    try {
      const success = await updatePlanApprovalStatus(planId, 'active');
      if (success) {
        toast.success('Plan approved!');
        fetchPlans(); // Re-fetch plans to update the list
      } else {
        toast.error('Failed to approve plan.');
      }
    } catch (err) {
      console.error("Error approving plan:", err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleRejectPlan = async (planId) => {
    try {
      const success = await updatePlanApprovalStatus(planId, 'rejected'); // 'rejected' status
      if (success) {
        toast.info('Plan rejected.');
        fetchPlans(); // Re-fetch plans to update the list
      } else {
        toast.error('Failed to reject plan.');
      }
    } catch (err) {
      console.error("Error rejecting plan:", err);
      toast.error(`Error: ${err.message}`);
    }
  };

  // Handler for restarting a plan
  const handleRestartPlan = async (originalPlan) => {
    if (window.confirm("Are you sure you want to restart this plan? This will create a new plan based on this one and mark the original as 'past plan'.")) {
      try {
        const newPlan = await restartPlan(originalPlan);
        if (newPlan) {
          toast.success('Plan restarted successfully!');
          fetchPlans(); // Re-fetch plans to update the list
        } else {
          toast.error('Failed to restart plan.');
        }
      } catch (err) {
        console.error("Error restarting plan:", err);
        toast.error(`Error: ${err.message}`);
      }
    }
  };

   const handleStopPlan = async (planId) => {
    if (window.confirm("Are you sure you want to stop this plan? It will be marked as 'past plan'.")) {
      try {
        const success = await stopPlan(planId);
        if (success) {
          toast.success('Plan stopped successfully!');
          fetchPlans(); // Re-fetch plans to update the list
        } else {
          toast.error('Failed to stop plan.');
        }
      } catch (err) {
        console.error("Error stopping plan:", err);
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  // Sort plans by creation date, newest first
  const sortedPlans = [...plans].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Display loading states for both auth/coach details and plan fetching
  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-apts-black">
        {/* <Spinner size="lg" />
        <div className="ml-3 text-lg text-lavender">{loadingAuth ? <Loader /> : 'Loading plans...'}</div> */}
        {loadingAuth ? 
       <div className="text-center">
       <div className="w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto"></div>
       <p className="mt-4 text-apts-white text-lg font-sprintura">TRACK. TRAIN. TRIUMPH</p>
     </div>
        : 
        <div className="text-center">
       <div className="w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto"></div>
       <p className="mt-4 text-apts-white text-lg font-sprintura">Loading plans...</p>
     </div>
        }
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 bg-apts-dark min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
      >
        <div className="min-h-screen bg-black/70">
      <h1 className="text-3xl mt-2 text-center font-bold text-lavender-200 font-sprintura mb-8">Your Training Plans</h1>

      <div className="flex flex-wrap  justify-center gap-4 mb-8">
        <Button
          color="primary"
          size="lg"
          onPress={onGenerateModalOpen}
          className="bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn"
        >
          Generate a New Plan
        </Button>
      </div>

      <hr className="my-8 border-white/20" />

      <h2 className="text-2xl font-semibold  font-sprintura text-lavender-200 mb-6">All Your Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlans.length > 0 ? (
          sortedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onOpenPlan={handleOpenPlan}
              onRevise={handleOpenReviseModal} 
              onApprove={handleApprovePlan}
              onReject={handleRejectPlan}
              onRestart={handleRestartPlan}
              onStop={handleStopPlan}
              userRole={role}
              hasCoach={hasCoach}
              currentUserData={userData} 
            />
          ))
        ) : (
          <p className="text-gray-400 text-lg col-span-full">No plans generated yet. Click "Generate a New Plan" to create one!</p>
        )}
      </div>

      {/* Modals */}
      <GeneratePlanModal
        isOpen={isGenerateModalOpen}
        onOpenChange={onGenerateModalOpenChange}
        onGeneratePlan={handleGeneratePlan}
        loading={loading}
        error={error}
        hasCoach={hasCoach} 
      />

      <PlanViewModal
        isOpen={isViewModalOpen}
        onOpenChange={onViewModalOpenChange}
        plan={selectedPlan}
        hasCoach={hasCoach}
        userRole={role}
        onRevise={handleOpenReviseModal}
        onApprove={handleApprovePlan} 
        onReject={handleRejectPlan}
      />

      {selectedPlanToRevise && (
        <RevisePlanModal
          isOpen={isReviseModalOpen}
          onOpenChange={onReviseModalOpenChange}
          onSubmit={handleRevisePlan} 
          plan={selectedPlanToRevise}
        />
      )}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
    </div>
    </div>
  );
};