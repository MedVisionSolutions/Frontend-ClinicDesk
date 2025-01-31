import { useEffect } from 'react';

export const useInactivityTimer = (timeout: number = 300000) => { // 300000ms = 5 minutos
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        window.location.href = '/';
      }, timeout);
    };

    // Eventos a monitorear
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Iniciar el timer
    resetTimer();

    // Agregar event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout]);
}; 