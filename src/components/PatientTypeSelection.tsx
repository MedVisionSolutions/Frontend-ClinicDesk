import { useState } from "react";
import { NewPatientForm } from "./NewPatientForm";
import { RegisteredPatientLookup } from "./RegisteredPatientLookup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";

export const PatientTypeSelection = () => {
  useInactivityTimer();
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<"new" | "registered" | null>(null);

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleRegistrationComplete = () => {
    setSelectedType("registered"); // Cambiar a la vista de check-in después del registro
  };

  if (selectedType === "new") {
    return <NewPatientForm onBack={handleBack} onRegistrationComplete={handleRegistrationComplete} />;
  }

  if (selectedType === "registered") {
    return <RegisteredPatientLookup 
      onBack={handleBack} 
      onNewPatient={() => setSelectedType("new")} 
    />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto p-4">
      <LanguageSelector />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedType("new")}>
          <h2 className="text-2xl font-semibold mb-4">{t('patientType.newPatient.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('patientType.newPatient.description')}
          </p>
          <Button className="w-full bg-secondary hover:bg-secondary/90">
            {t('patientType.newPatient.button')}
          </Button>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedType("registered")}>
          <h2 className="text-2xl font-semibold mb-4">{t('patientType.registeredPatient.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('patientType.registeredPatient.description')}
          </p>
          <Button className="w-full">{t('patientType.registeredPatient.button')}</Button>
        </Card>
      </motion.div>
    </div>
  );
};