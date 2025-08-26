import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface SeekBarProps {
    duration: number;
    position: number;
    onSeek: (position: number) => void;
    formatTime: (milliseconds: number) => string;
}

export const SeekBar: React.FC<SeekBarProps> = ({
    duration,
    position,
    onSeek,
    formatTime,
}) => {
    const handleValueChange = (value: number) => {
        // Ensure the value is within bounds
        const clampedValue = Math.max(0, Math.min(value, duration || 1));
        onSeek(clampedValue);
    };

    return (
        <View className="px-4 py-3">
            <View className="flex-row items-center mb-2">
                <Text className="text-xs text-gray-600 w-12 text-right">
                    {formatTime(position)}
                </Text>
                <View className="flex-1 mx-3">
                    <Slider
                        style={{ width: '100%' }}
                        minimumValue={0}
                        maximumValue={duration || 1}
                        value={position}
                        onValueChange={handleValueChange}
                        minimumTrackTintColor="#D2000F"
                        maximumTrackTintColor="#E5E7EB"
                        thumbTintColor="#D2000F"
                    />
                </View>
                <Text className="text-xs text-gray-600 w-12 text-left">
                    {formatTime(duration)}
                </Text>
            </View>
        </View>
    );
};
