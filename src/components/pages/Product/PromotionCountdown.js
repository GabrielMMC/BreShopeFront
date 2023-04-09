import React, { useState, useEffect } from 'react';

const PromotionCountdown = ({ expirationDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      const difference = new Date(expirationDate) - new Date();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const minutes = Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, '0');

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expirationDate]);

  return (
    <p className='countdown ms-auto'>{timeLeft.days} Dias, {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</p>
  );
};

export default PromotionCountdown;
