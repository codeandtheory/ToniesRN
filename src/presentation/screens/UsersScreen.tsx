import { useEffect, useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { ThemedText } from '@/src/presentation/components/ThemedText';
import { ThemedView } from '@/src/presentation/components/ThemedView';
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
    <View className="p-3 rounded-xl border border-gray-200 bg-gray-50 mb-2">
      <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
      <ThemedText>{item.email}</ThemedText>
    </View>
  ), []);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1ED] p-4">
      <View className="flex-1 gap-3 ">
        <ThemedText type="title">Users</ThemedText>

        {errorMessage ? (
          <View className="p-3 rounded-lg bg-red-100">
            <ThemedText className="mb-1">{errorMessage}</ThemedText>
            <ThemedText type="link" onPress={() => { clearError(); loadUsers(); }}>Retry</ThemedText>
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
              <ThemedText>No users found.</ThemedText>
            ) : null}
          />
        )}
      </View>
    </SafeAreaView>
  );
}