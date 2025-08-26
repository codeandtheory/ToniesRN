import React, { useState } from 'react';
import { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import "../../../global.css";
import { useLocalUsersStore } from '../viewmodels/onboardingStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileFormScreen() {

    const users = useLocalUsersStore((s) => s.user);
    const isLoading = useLocalUsersStore((s) => s.isLoading);
    const errorMessage = useLocalUsersStore((s) => s.errorMessage);
    const loadUsers = useLocalUsersStore((s) => s.loadUsers);
    const storeUser = useLocalUsersStore((s) => s.storeUser);
    const refresh = useLocalUsersStore((s) => s.refresh);
    const clearError = useLocalUsersStore((s) => s.clearError);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);


    const [name, setName] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl' | 'na' | null>(null);
    const [dob, setDob] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    const handleConfirm = () => {
        console.log({ name, gender, dob });
        if (name != "" && gender != null && dob != null) {
            console.log("inside");
            storeUser(name, gender, dob.getTime())
        }
    };

    return (
        <SafeAreaView>
            <ScrollView className="p-5 pb-10 flex-grow bg-white">

                {users ? (
                    <>
                        <View className="bg-blue-400 p-5 rounded-2xl shadow-sm mb-6">
                            <Text className="text-xl font-bold text-black mb-2">Profile</Text>

                            <View className="mb-3">
                                <Text className="text-gray-100 text-sm">Name</Text>
                                <Text className="text-lg text-black font-bold capitalize">{users.name}</Text>
                            </View>

                            <View className="mb-3">
                                <Text className="text-gray-100 text-sm">Gender</Text>
                                <Text className="text-lg text-black font-bold capitalize">
                                    {users.gender}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-gray-100 text-sm">Date of Birth</Text>
                                <Text className="text-lg text-black font-bold capitalize">
                                    {new Date(users.dob).toDateString()}
                                </Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <>
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
                                    className={`p-2 rounded-full border min-w-[90px] items-center ${gender === g ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                        }`}
                                    onPress={() => setGender(g as typeof gender)}
                                >
                                    <Text
                                        className={`${gender === g ? 'text-white font-bold' : 'text-black'
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

                    </>
                )
                }
            </ScrollView>
        </SafeAreaView>
    );
}
