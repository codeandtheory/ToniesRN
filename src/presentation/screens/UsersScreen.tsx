import { useEffect, useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View, Text } from 'react-native';

import { useUsersStore } from '@/src/presentation/viewmodels/usersStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../../../global.css";

export default function UsersScreen() {
  const users = useUsersStore((s) => s.users);
  const isLoading = useUsersStore((s) => s.isLoading);
  const errorMessage = useUsersStore((s) => s.errorMessage);
  const loadUsers = useUsersStore((s) => s.loadUsers);
  const refresh = useUsersStore((s) => s.refresh);
  const clearError = useUsersStore((s) => s.clearError);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const renderItem = useCallback(({ item }: { item: { id: number; name: string; email: string } }) => (
    <View className="p-3 rounded-lg border border-gray-200 bg-gray-50 mb-2">
      <Text className="text-gray-800 font-semibold">{item.name}</Text>
      <Text className="text-gray-600">{item.email}</Text>
    </View>
  ), []);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1ED] p-4">
      <View className="flex-1 gap-3">
        <Text className="text-2xl font-bold text-gray-900">Users</Text>

        {errorMessage ? (
          <View className="p-3 rounded-lg bg-red-100">
            <Text className="text-gray-800 mb-1">{errorMessage}</Text>
            <Text className="text-blue-600 underline" onPress={() => { clearError(); loadUsers(); }}>Retry</Text>
          </View>
        ) : null}

        {isLoading && users.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
            contentContainerStyle={users.length === 0 ? { flexGrow: 1, alignItems: 'center', justifyContent: 'center' } : undefined}
            ListEmptyComponent={!isLoading ? (
              <Text className="text-gray-600">No users found.</Text>
            ) : null}
          />
        )}
      </View>
    </SafeAreaView>
  );
}