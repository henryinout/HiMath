// src/components/Timer.jsx
import React, { useState, useEffect } from "react";

const Timer = ({ durationInSeconds, onTimeUp }) => {
    const [remainingTime, setRemainingTime] = useState(durationInSeconds);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((time) => {
                if (time <= 1) {
                    clearInterval(timer);
                    onTimeUp();
                    return 0;
                }
                return time - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeUp]);

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <span className="fs-5">
            剩余时间: {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
    );
};

export default Timer;