import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
} from '@heroui/react';
import { toast } from 'sonner';
import { sportsList } from '@/content/sportsList'; 
export const GeneratePlanModal = ({ isOpen, onOpenChange, onGeneratePlan, loading, error, hasCoach }) => {
  const [age, setAge] = useState('');
  const [sport, setSport] = useState('');
  const [goal, setGoal] = useState('');
  const [planType, setPlanType] = useState('weekly');
  const [focus, setFocus] = useState('');
  const [timeToAchieve, setTimeToAchieve] = useState('');

  const resetFields = () => {
    setAge('');
    setSport('');
    setGoal('');
    setPlanType('weekly');
    setFocus('');
    setTimeToAchieve('');
  };

  const handleSubmit = async () => {
    if (!age || !sport || !goal || !planType || !focus || !timeToAchieve) {
      toast.error('Please fill in all fields.');
      return;
    }

    const athleteProfile = { age: parseInt(age), sport, goal };
    await onGeneratePlan(athleteProfile, planType, focus, timeToAchieve, hasCoach);
    resetFields();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent className="bg-background text-foreground border border-apts-purple/20 rounded-xl">
        {(onClose) => (
          <>
            <ModalHeader className="text-lavender font-orbitron text-xl">Generate New Training Plan</ModalHeader>
            <ModalBody className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Athlete Profile</h3>
                <InputField label="Age" type="number" value={age} onChange={setAge} placeholder="e.g., 20" />

                <Select
                  label="Sport"
                  placeholder="Select a sport"
                  selectedKeys={sport ? [sport] : []}
                  onSelectionChange={(keys) => setSport(Array.from(keys)[0])}
                  variant="bordered"
                  fullWidth
                  className="mb-4"
                  classNames={{
                    trigger: 'bg-input border-border hover:bg-input-hover data-[hover=true]:border-lavender',
                    label: 'text-foreground',
                    value: 'text-foreground',
                    popoverContent: 'bg-card border border-border', 
                    listbox: 'text-foreground', 
                  }}
                >
                  {sportsList.map((s) => (
                    <SelectItem key={s} value={s} className="bg-card text-foreground">
                      {s}
                    </SelectItem>
                  ))}
                </Select>
                <InputField label="Goal" value={goal} onChange={setGoal} placeholder="e.g., build endurance" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Plan Details</h3>
                <Select
                  label="Plan Type"
                  placeholder="Select a plan type"
                  selectedKeys={[planType]}
                  onSelectionChange={(keys) => setPlanType(Array.from(keys)[0])}
                  variant="bordered"
                  fullWidth
                  className="mb-4"
                  classNames={{
                    trigger: 'bg-input border-border hover:bg-input-hover data-[hover=true]:border-lavender',
                    label: 'text-foreground',
                    value: 'text-foreground',
                    popoverContent: 'bg-card border border-border', 
                    listbox: 'text-foreground', 
                  }}
                >
                  <SelectItem key="weekly" value="weekly" className="bg-card text-foreground">Weekly</SelectItem>
                  <SelectItem key="daily" value="daily" className="bg-card text-foreground">Daily</SelectItem>
                </Select>
                <InputField label="Focus" value={focus} onChange={setFocus} placeholder="e.g., overall fitness" />
                <InputField label="Time to Achieve" value={timeToAchieve} onChange={setTimeToAchieve} placeholder="e.g., 6 weeks" />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} isDisabled={loading}>
                Cancel
              </Button>
              <Button
                className="apts-button"
                onPress={handleSubmit}
                isDisabled={loading}
              >
                {loading ? <Spinner size="sm" color="white" /> : 'Generate Plan'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const InputField = ({ label, value, onChange, ...rest }) => (
  <Input
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="mb-4"
    variant="bordered"
    fullWidth
    {...rest}
    classNames={{
      inputWrapper: 'bg-input border-border hover:bg-input-hover data-[hover=true]:border-lavender',
      label: 'text-foreground',
      input: 'text-foreground',
    }}
  />
);
