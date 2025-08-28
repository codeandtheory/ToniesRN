// app/(tabs)/ProfileForm.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Button,
    StyleSheet,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { useOnboardingStore } from '@/src/presentation/viewmodels/onboardingStore';

export default function ProfileFormScreen() {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl' | 'na' | null>(null);
    const [dob, setDob] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const save = useOnboardingStore((s) => s.save);

    const handleConfirm = async () => {
        useOnboardingStore.setState({ name, gender, dob });
        await save();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
            />

            <View style={styles.genderContainer}>
                {['boy', 'girl', 'na'].map((g) => (
                    <TouchableOpacity
                        key={g}
                        style={[
                            styles.genderButton,
                            gender === g && styles.genderButtonSelected,
                        ]}
                        onPress={() => setGender(g as typeof gender)}
                    >
                        <Text
                            style={[
                                styles.genderText,
                                gender === g && styles.genderTextSelected,
                            ]}
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

            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
                <Text>{dob ? dob.toDateString() : 'Select date'}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={dob || new Date()}
                    mode="date"
                    display='spinner'
                    onChange={(_event: unknown, selectedDate?: Date | undefined) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            setDob(selectedDate);
                        }
                    }}
                />
            )}

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Continue</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
        marginTop: 50
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        marginTop: 30
    },
    genderButton: {
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        minWidth: 90,
        alignItems: 'center',
    },
    genderButtonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    genderText: {
        color: '#000',
    },
    genderTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dateInput: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
    },
    confirmButton: {
        backgroundColor: 'red',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: "auto",
    },

    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
