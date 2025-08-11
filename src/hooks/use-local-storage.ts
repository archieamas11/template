import { useEffect, useState } from 'react';

export function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue);
      }
    };

    const handleCustomStorageChange = () => {
      setValue(localStorage.getItem(key));
    };

    // 🎧 Listen for both native storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange);
    };
  }, [key]);

  const setStoredValue = (newValue: string | null) => {
    if (newValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newValue);
    }
    setValue(newValue);
    // 📢 Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('localStorage-change'));
  };

  return [value, setStoredValue] as const;
}
