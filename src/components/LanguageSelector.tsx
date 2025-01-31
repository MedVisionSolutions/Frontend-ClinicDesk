import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        onClick={() => setLanguage('en')}
        size="sm"
      >
        English
      </Button>
      <Button
        variant={language === 'es' ? 'default' : 'outline'}
        onClick={() => setLanguage('es')}
        size="sm"
      >
        Español
      </Button>
    </div>
  );
};