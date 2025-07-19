import { useState, useEffect } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '@/lib/firebase';

const useFCM = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          const fcmToken = await getToken(messaging, {
            vapidKey: '5XX31IY_HhcFJc-lT3gjVf9EW9l9_emH660f1HgZNX8',
          });
          setToken(fcmToken);
        } else {
          setError('Notification permission not granted.');
        }
      } catch (err) {
        setError(err);
      }
    };

    requestPermission();
  }, []);

  return { token, error };
};

export default useFCM;
