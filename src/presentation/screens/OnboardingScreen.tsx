import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import "../../../global.css";

export default function ProfileFormScreen() {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl' | 'na' | null>(null);
    const [dob, setDob] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    const handleConfirm = () => {
        console.log({ name, gender, dob });
    };

    return (
        <ScrollView className="p-5 pb-10 flex-grow bg-white">
            <Text className="mb-1 font-semibold mt-12">Name</Text>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
            />

            <View className="flex-row justify-around mb-4 mt-8">
                {['boy', 'girl', 'na'].map((g) => (
                    <TouchableOpacity
                        key={g}
                        className={`p-2 rounded-full border min-w-[90px] items-center ${
                            gender === g ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}
                        onPress={() => setGender(g as typeof gender)}
                    >
                        <Text
                            className={`${
                                gender === g ? 'text-white font-bold' : 'text-black'
                            }`}
                        >

                            {g === 'boy'
                                ? 'Boy'
                                : g === 'girl'
                                ? 'Girl'
                                : 'Rather not say'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text className="mb-1 font-semibold">Date of Birth</Text>
            <TouchableOpacity
                onPress={() => setShowPicker(true)}
                className="p-3 rounded-lg border border-gray-300 mb-4"
            >
                <Text>{dob ? dob.toDateString() : 'Select date'}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={dob || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            setDob(selectedDate);
                        }
                    }}
                />
            )}

            <TouchableOpacity
                className="bg-red-500 py-4 rounded-full items-center mt-auto"
                onPress={handleConfirm}
            >
                <Text className="text-white text-lg font-bold">Continue</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
