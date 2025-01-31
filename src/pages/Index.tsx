import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { PatientTypeSelection } from "@/components/PatientTypeSelection";
import { NewPatientForm } from "@/components/NewPatientForm";
import { RegisteredPatientLookup } from "@/components/RegisteredPatientLookup";

type Step = "welcome" | "selection" | "new-patient" | "registered-patient";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeScreen onStart={() => setCurrentStep("selection")} />;
      case "selection":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-center mb-8">
                Select Patient Type
              </h1>
              <PatientTypeSelection
                onSelect={(type) =>
                  setCurrentStep(
                    type === "new" ? "new-patient" : "registered-patient"
                  )
                }
              />
            </div>
          </div>
        );
      case "new-patient":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
            <div className="container mx-auto px-4">
              <NewPatientForm onBack={() => setCurrentStep("selection")} />
            </div>
          </div>
        );
      case "registered-patient":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
            <div className="container mx-auto px-4">
              <RegisteredPatientLookup onBack={() => setCurrentStep("selection")} />
            </div>
          </div>
        );
    }
  };

  return renderStep();
};

export default Index;