import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es';

type Translations = {
  [key in Language]: {
    welcome: {
      title: string;
      subtitle: string;
      startButton: string;
    };
    patientType: {
      title: string;
      newPatient: {
        title: string;
        description: string;
        button: string;
      };
      registeredPatient: {
        title: string;
        description: string;
        button: string;
      };
    };
    newPatientForm: {
      title: string;
      fullName: string;
      passportId: string;
      ssn: string;
      parentName: string;
      phone: string;
      email: string;
      submit: string;
      back: string;
      registering: string;
      successTitle: string;
      successWithAppointment: string;
      successNoAppointment: string;
      errorTitle: string;
      errorMessage: string;
    };
    registeredPatient: {
      title: string;
      patientId: string;
      submit: string;
      back: string;
      verifying: string;
      successTitle: string;
      successWithAppointment: string;
      successNoAppointment: string;
      notFoundTitle: string;
      notFoundMessage: string;
      errorTitle: string;
      errorMessage: string;
      close: string;
      register: string;
      patientName: string;
      therapist: string;
      sessionTime: string;
      selectTherapist: string;
      selectTime: string;
    };
    errors: {
      patientNotFound: {
        title: string;
        description: string;
        registerButton: string;
      };
      general: {
        title: string;
        description: string;
      };
      checkIn: {
        title: string;
        description: string;
      };
      validation: {
        phone: {
          title: {
            en: "Invalid Phone Number",
            es: "Número de Teléfono Inválido"
          },
          description: {
            en: "Please enter a valid US phone number (XXX) XXX-XXXX",
            es: "Por favor ingrese un número de teléfono válido de EE.UU. (XXX) XXX-XXXX"
          }
        }
      }
    };
    success: {
      update: {
        title: string;
        description: string;
      };
    };
  };
};

const translations: Translations = {
  en: {
    welcome: {
      title: "Welcome to Health Center",
      subtitle: "Your health is our priority. Let's get you checked in.",
      startButton: "Start Check-in",
    },
    patientType: {
      title: "Select Patient Type",
      newPatient: {
        title: "New Patient",
        description: "First time visiting? We'll help you get registered.",
        button: "Register as New Patient",
      },
      registeredPatient: {
        title: "Registered Patient",
        description: "Already registered? Quick check-in with your Name.",
        button: "Quick Check-in",
      },
    },
    newPatientForm: {
      title: "New Patient Registration",
      fullName: "Full Name",
      passportId: "Passport/ID Number",
      ssn: "Social Security Number",
      parentName: "Parent/Guardian Name",
      phone: "Phone Number",
      email: "Email Address",
      submit: "Complete Registration",
      back: "Back",
      registering: "Registering...",
      successTitle: "Registration Successful",
      successWithAppointment: "You have an appointment scheduled for today with {therapist} at {time}",
      successNoAppointment: "Thank you for registering. You will receive instructions via message and email shortly.",
      errorTitle: "Error",
      errorMessage: "There was a problem processing your registration. Please try again.",
    },
    registeredPatient: {
      title: "Quick Check-in",
      patientId: "Patient ID/Passport Number",
      submit: "Check In",
      back: "Back",
      verifying: "Verifying...",
      successTitle: "Verification Successful",
      successWithAppointment: "Welcome {name}. Your appointment is with {therapist} at {time}",
      successNoAppointment: "Welcome {name}. You have no appointments scheduled for today.",
      notFoundTitle: "Patient Not Found",
      notFoundMessage: "We couldn't find a registered patient with that ID. Please register as a new patient.",
      errorTitle: "Error",
      errorMessage: "There was a problem verifying your information. Please try again.",
      close: "Close",
      register: "Go to Registration",
      patientName: "Patient Full Name",
      therapist: "Therapist",
      sessionTime: "Session Time",
      selectTherapist: "Select a therapist",
      selectTime: "Select a time",
    },
    errors: {
      patientNotFound: {
        title: "Patient Not Found",
        description: "The patient was not found in our records. Please verify the information or register as a new patient.",
        registerButton: "Register New Patient"
      },
      general: {
        title: "Error",
        description: "An unexpected error occurred. Please try again."
      },
      checkIn: {
        title: "Check-in Error",
        description: "There was an error processing your request. Please try again."
      },
      validation: {
        phone: {
          title: {
            en: "Invalid Phone Number",
            es: "Número de Teléfono Inválido"
          },
          description: {
            en: "Please enter a valid US phone number (XXX) XXX-XXXX",
            es: "Por favor ingrese un número de teléfono válido de EE.UU. (XXX) XXX-XXXX"
          }
        }
      }
    },
    success: {
      update: {
        title: "Success",
        description: "Patient information updated successfully"
      }
    }
  },
  es: {
    welcome: {
      title: "Bienvenido al Centro de Salud",
      subtitle: "Tu salud es nuestra prioridad. Vamos a registrarte.",
      startButton: "Comenzar Registro",
    },
    patientType: {
      title: "Seleccionar Tipo de Paciente",
      newPatient: {
        title: "Paciente Nuevo",
        description: "¿Primera visita? Te ayudaremos a registrarte.",
        button: "Registrarse como Nuevo Paciente",
      },
      registeredPatient: {
        title: "Paciente Registrado",
        description: "¿Ya registrado? Check-in rápido con tu Nombre.",
        button: "Check-in Rápido",
      },
    },
    newPatientForm: {
      title: "Registro de Nuevo Paciente",
      fullName: "Nombre Completo",
      passportId: "Número de Pasaporte/ID",
      ssn: "Número de Seguro Social",
      parentName: "Nombre del Padre/Tutor",
      phone: "Número de Teléfono",
      email: "Correo Electrónico",
      submit: "Completar Registro",
      back: "Volver",
      registering: "Registrando...",
      successTitle: "Registro Exitoso",
      successWithAppointment: "Tienes una cita programada para hoy con {therapist} a las {time}",
      successNoAppointment: "Gracias por registrarte. En breve recibirás las instrucciones por mensaje y correo electrónico.",
      errorTitle: "Error",
      errorMessage: "Hubo un problema al procesar tu registro. Por favor, intenta nuevamente.",
    },
    registeredPatient: {
      title: "Check-in Rápido",
      patientId: "ID de Paciente/Número de Pasaporte",
      submit: "Check In",
      back: "Volver",
      verifying: "Verificando...",
      successTitle: "Verificación Exitosa",
      successWithAppointment: "Bienvenido/a {name}. Tu cita es con {therapist} a las {time}",
      successNoAppointment: "Bienvenido/a {name}. No tienes citas programadas para hoy.",
      notFoundTitle: "Paciente No Encontrado",
      notFoundMessage: "No encontramos un paciente registrado con ese ID. Por favor, regístrate como nuevo paciente.",
      errorTitle: "Error",
      errorMessage: "Hubo un problema al verificar tu información. Por favor, intenta nuevamente.",
      close: "Cerrar",
      register: "Ir a Registro",
      patientName: "Nombre Completo del Paciente",
      therapist: "Terapeuta",
      sessionTime: "Hora de la Sesión",
      selectTherapist: "Seleccionar terapeuta",
      selectTime: "Seleccionar hora",
    },
    errors: {
      patientNotFound: {
        title: "Paciente No Encontrado",
        description: "El paciente no fue encontrado en nuestros registros. Por favor, verifique la información o regístrese como nuevo paciente.",
        registerButton: "Registrar Nuevo Paciente"
      },
      general: {
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, intente de nuevo."
      },
      checkIn: {
        title: "Error de Check-in",
        description: "Hubo un error al procesar su solicitud. Por favor, intente de nuevo."
      },
      validation: {
        phone: {
          title: {
            en: "Invalid Phone Number",
            es: "Número de Teléfono Inválido"
          },
          description: {
            en: "Please enter a valid US phone number (XXX) XXX-XXXX",
            es: "Por favor ingrese un número de teléfono válido de EE.UU. (XXX) XXX-XXXX"
          }
        }
      }
    },
    success: {
      update: {
        title: "Éxito",
        description: "Información del paciente actualizada exitosamente"
      }
    }
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (path: string) => {
    return path.split('.').reduce((obj, key) => obj[key as keyof typeof obj], translations[language] as any) || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
