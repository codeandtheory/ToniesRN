import { useState, useCallback } from 'react';

export const useSeekBar = (
    duration: number,
    position: number,
    onSeek: (position: number) => void
) => {
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekPosition, setSeekPosition] = useState(position);

    const handleSeekStart = useCallback(() => {
        setIsSeeking(true);
        setSeekPosition(position);
    }, [position]);

    const handleSeekChange = useCallback((value: number) => {
        setSeekPosition(value);
    }, []);

    const handleSeekComplete = useCallback((value: number) => {
        setIsSeeking(false);
        // Ensure the value is within bounds
        const clampedValue = Math.max(0, Math.min(value, duration));
        onSeek(clampedValue);
    }, [onSeek, duration]);

    const formatTime = useCallback((milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    return {
        isSeeking,
        seekPosition,
        handleSeekStart,
        handleSeekChange,
        handleSeekComplete,
        formatTime,
    };
};
