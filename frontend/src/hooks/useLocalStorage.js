import { useState } from 'react';

export default function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = (v) => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
        console.error("error in setting local storage")
    }
    setState(v);
  };

  return [state, setValue];
}
