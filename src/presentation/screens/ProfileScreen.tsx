import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import "../../../global.css";
import { useLocalUsersStore } from '../viewmodels/onboardingStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router} from 'expo-router'
import { useEffect } from 'react';



export default function ProfileScreen() {

    const users = useLocalUsersStore((s) => s.user);
    const isLoading = useLocalUsersStore((s) => s.isLoading);
    const errorMessage = useLocalUsersStore((s) => s.errorMessage);
    const loadUsers = useLocalUsersStore((s) => s.loadUsers);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    if (errorMessage) {
        return (
          <SafeAreaView>
            <Text className="p-5 text-red-500">{errorMessage}</Text>
          </SafeAreaView>
        );
      }

      if (isLoading) {
        return (
          <SafeAreaView>
            <Text className="p-5">Loading...</Text>
          </SafeAreaView>
        );
      }

    return (
        <SafeAreaView>
            <ScrollView className="p-5 pb-10 h-screen bg-white">
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
                        <View className='flex-row justify-center items-start bg-blue-400 py-16 rounded-lg'>
                            <View className='flex-col items-center p-4 '>
                                <Text className='font-bold mb-4'> Profile is not setup yet. Please enter your details.</Text>
                                <TouchableOpacity className="bg-red-500 px-8 py-2 rounded-full items-center mt-auto" onPress={setupProfile}>
                                    <Text className="text-white text-lg font-bold">Continue</Text>
                                </TouchableOpacity>
                                   
                            </View>
                            
                        </View>
                    </>
                ) }
            </ScrollView>
        </SafeAreaView>
    );
}

function setupProfile() {
    router.push('/onboarding')
}
