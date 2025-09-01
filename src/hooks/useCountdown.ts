import { useState, useEffect } from 'react';

export interface CountdownResult {
  timeLeft: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isLowTime: boolean;
  formattedTime: string;
}

export function useCountdown(endTime: Date): CountdownResult {
  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, endTime.getTime() - new Date().getTime());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime.getTime() - new Date().getTime());
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  const isExpired = timeLeft <= 0;
  const isLowTime = timeLeft <= 5 * 60 * 1000; // Less than 5 minutes
  
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    timeLeft,
    hours,
    minutes,
    seconds,
    isExpired,
    isLowTime,
    formattedTime,
  };
}