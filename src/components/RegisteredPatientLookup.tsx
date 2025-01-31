import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'];

// Función para convertir hora de 12h a 24h
const convertTo24Hour = (hour: string, minute: string, period: string): string => {
  let hours = parseInt(hour, 10);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minute}`;
};

type PatientInfo = {
  parent_guardian_name: string;
  phone: string;
  email: string;
};

interface Props {
  onBack: () => void;
  onNewPatient?: () => void;
}

export const RegisteredPatientLookup = ({ onBack, onNewPatient }: Props) => {
  useInactivityTimer();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [patientName, setPatientName] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState<PatientInfo | null>(null);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isRegistered && countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      window.location.href = '/'; // Redirigir al WelcomeScreen
    }

    return () => clearTimeout(timerId);
  }, [isRegistered, countdown]);

  const verifyPatient = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/verify-patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_full_name: name }),
      });

      const data = await response.json();

      if (response.ok) {
        setPatientInfo(data.patientInfo);
        setShowUpdateDialog(true);
        setUpdatedInfo(data.patientInfo);
      } else {
        toast({
          title: t('errors.patientNotFound.title'),
          description: (
            <div className="space-y-4">
              <p>{t('errors.patientNotFound.description')}</p>
              <Button onClick={onNewPatient}>{t('errors.patientNotFound.registerButton')}</Button>
            </div>
          ),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error verifying patient:", error);
      toast({
        title: t('errors.general.title'),
        description: t('errors.general.description'),
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyPatient(patientName);
  };

  const handleUpdateSubmit = async () => {
    if (!updatedInfo) return;

    try {
      if (JSON.stringify(patientInfo) !== JSON.stringify(updatedInfo)) {
        const updateResponse = await fetch('http://localhost:5000/api/update-patient', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patient_full_name: patientName,
            ...updatedInfo
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update patient information');
        }

        toast({
          title: t('success.update.title'),
          description: t('success.update.description'),
        });
      }

      // Proceder con el check-in
      const session_time = convertTo24Hour(selectedHour, selectedMinute, selectedPeriod);
      const response = await fetch('http://localhost:5000/api/patient-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_full_name: patientName,
          session_time,
        }),
      });

      if (response.ok) {
        setShowUpdateDialog(false);
        setIsRegistered(true);
      } else {
        throw new Error('Failed to complete check-in');
      }
    } catch (error) {
      console.error("Error in check-in process:", error);
      toast({
        title: t('errors.checkIn.title'),
        description: t('errors.checkIn.description'),
        variant: "destructive"
      });
    }
  };

  if (showUpdateDialog && patientInfo) {
    return (
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Patient Information</DialogTitle>
            <DialogDescription>
              Please verify if any information needs to be updated:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Parent/Guardian Name</Label>
              <Input
                value={updatedInfo?.parent_guardian_name}
                onChange={(e) => setUpdatedInfo(prev => ({
                  ...prev!,
                  parent_guardian_name: e.target.value
                }))}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={updatedInfo?.phone}
                onChange={(e) => setUpdatedInfo(prev => ({
                  ...prev!,
                  phone: e.target.value
                }))}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={updatedInfo?.email}
                onChange={(e) => setUpdatedInfo(prev => ({
                  ...prev!,
                  email: e.target.value
                }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => handleUpdateSubmit()}>
                No Changes Needed
              </Button>
              <Button onClick={() => handleUpdateSubmit()}>
                Update & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isRegistered) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">Check-in Successful!</h2>
        <p className="mb-4">
          Thank you for your registration. A message has been sent to the Receptionist and the Therapist. 
          They will be with you shortly!
        </p>
        <p>Redirecting to welcome screen in {countdown} seconds...</p>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-6">
      <LanguageSelector />
      <h2 className="text-2xl font-semibold mb-6">{t('registeredPatient.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">{t('registeredPatient.patientName')}</Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder={t('registeredPatient.patientName')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>{t('Initial Session Time')}</Label>
          <div className="grid grid-cols-3 gap-2">
            <Select value={selectedHour} onValueChange={setSelectedHour}>
              <SelectTrigger>
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMinute} onValueChange={setSelectedMinute}>
              <SelectTrigger>
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 space-x-4">
          <Button type="submit">
            {t('registeredPatient.submit')}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            {t('registeredPatient.back')}
          </Button>
        </div>
      </form>
    </Card>
  );
};