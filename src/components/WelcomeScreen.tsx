import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export const WelcomeScreen = ({ onStart }: { onStart: () => void }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <LanguageSelector />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 p-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {t('welcome.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {t('welcome.subtitle')}
        </p>
        <Button
          onClick={onStart}
          className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90"
        >
          {t('welcome.startButton')}
        </Button>
      </motion.div>
    </div>
  );
};