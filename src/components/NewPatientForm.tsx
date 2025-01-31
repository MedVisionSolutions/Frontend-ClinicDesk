import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { useNavigate } from "react-router-dom";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";

type PatientData = {
  patient_full_name: string;
  parent_guardian_name: string;
  phone: string;
  email: string;
};

export const NewPatientForm = ({ onBack, onRegistrationComplete }: { 
  onBack: () => void;
  onRegistrationComplete?: () => void;
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PatientData>({
    patient_full_name: "",
    parent_guardian_name: "",
    phone: "",
    email: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useInactivityTimer();

  const validatePhoneNumber = (phone: string) => {
    // Acepta formatos como: (123) 456-7890, 123-456-7890, 1234567890
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'phone') {
      // Solo permite números y algunos caracteres especiales
      const cleaned = value.replace(/[^\d()-. ]/g, '');
      setFormData(prev => ({ ...prev, [id]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phone)) {
      toast({
        title: t('errors.validation.phone.title'),
        description: t('errors.validation.phone.description'),
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language
        }),
      });

      if (response.ok) {
        setIsRegistered(true);
        
        toast({
          title: t('newPatientForm.successTitle'),
          description: t('newPatientForm.successNoAppointment'),
        });

        setFormData({
          patient_full_name: "",
          parent_guardian_name: "",
          phone: "",
          email: "",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: t('errors.general.title'),
          description: errorData.message?.[language] || t('errors.general.description'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t('errors.general.title'),
        description: t('errors.general.description'),
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isRegistered && countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && onRegistrationComplete) {
      onRegistrationComplete();
    }

    return () => clearTimeout(timerId);
  }, [isRegistered, countdown, onRegistrationComplete]);

  if (isRegistered) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">{t('Patient Registered Successfully')}</h2>
        <p>
          {t('Thank you for registering! You will be redirected to the check-in page in')} {countdown} {t('seconds')}
        </p>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <LanguageSelector />
      <h2 className="text-2xl font-semibold mb-6">{t('newPatientForm.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patient_full_name">{t('newPatientForm.fullName')}</Label>
          <Input 
            id="patient_full_name" 
            value={formData.patient_full_name}
            onChange={handleChange}
            placeholder={t('newPatientForm.fullName')}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parent_guardian_name">{t('newPatientForm.parentName')}</Label>
          <Input 
            id="parent_guardian_name" 
            value={formData.parent_guardian_name}
            onChange={handleChange}
            placeholder={t('newPatientForm.parentName')}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('newPatientForm.phone')}</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('newPatientForm.phone')}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('newPatientForm.email')}</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder={t('newPatientForm.email')}
            required 
          />
        </div>

        <div className="pt-4 space-x-4">
          <Button type="submit">
            {t('newPatientForm.submit')}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            {t('newPatientForm.back')}
          </Button>
        </div>
      </form>
    </Card>
  );
};