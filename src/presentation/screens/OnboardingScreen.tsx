import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import "../../../global.css";
import { useLocalUsersStore } from '../viewmodels/onboardingStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router} from 'expo-router'
import { useFormReducer } from '../hooks/useFormReducer';



export default function ProfileFormScreen() {

    const users = useLocalUsersStore((s) => s.user);
    const isLoading = useLocalUsersStore((s) => s.isLoading);
    const errorMessage = useLocalUsersStore((s) => s.errorMessage);
    const loadUsers = useLocalUsersStore((s) => s.loadUsers);
    const storeUser = useLocalUsersStore((s) => s.storeUser);
    const refresh = useLocalUsersStore((s) => s.refresh);
    const clearError = useLocalUsersStore((s) => s.clearError);

    // useEffect(() => {
    //     loadUsers();
    // }, [loadUsers]);
    
    const [userState, dispatch] = useFormReducer();

    const handleConfirm = async () => {
        console.log({ name: userState.name, gender: userState.gender, dob: userState.dob });
        if (userState.name != "" && userState.gender != null && userState.dob != null) {
            console.log("inside");
            const result = await storeUser(userState.name, userState.gender, userState.dob.getTime());
            result ? router.back() : Alert.alert("Error", "Error saving details. Please try again");
        }
    };

    return (
        <SafeAreaView>
            <ScrollView className="p-5 pb-10 flex-grow bg-white">

                {/* {users ? (
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
                ) : ( */}
                    <>
                        <TextInput
                            label="Name"
                            value={userState.name}
                            onChangeText={(text) => dispatch({type: "setName", payLoad:text})}
                            mode="outlined"
                        />
                        <View className="flex-row justify-around mb-4 mt-8">
                            {['boy', 'girl', 'na'].map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    className={`p-2 rounded-full border min-w-[90px] items-center ${userState.gender === g ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                        }`}
                                    onPress={() => {dispatch({type: "setGender", payLoad: g})}}
                                >
                                    <Text
                                        className={`${userState.gender === g ? 'text-white font-bold' : 'text-black'
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
                            onPress={() => dispatch({type: 'showPicker', payLoad: true})}
                            className="p-3 rounded-lg border border-gray-300 mb-4"
                        >
                            <Text>{userState.dob ? userState.dob.toDateString() : 'Select date'}</Text>
                        </TouchableOpacity>

                        {userState.showPicker && (
                            <DateTimePicker
                                value={userState.dob || new Date()}
                                mode="date"
                                display="spinner"
                                onChange={(event, selectedDate) => {
                                    dispatch({type:'showPicker', payLoad:false});
                                    if (selectedDate) {
                                        dispatch({type:'setDob', payLoad: selectedDate});
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
                {/* )7 */}
            </ScrollView>
        </SafeAreaView>
    );
}
