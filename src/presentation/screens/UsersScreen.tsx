import { useEffect, useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/presentation/components/ThemedText';
import { ThemedView } from '@/src/presentation/components/ThemedView';
import { useUsersStore } from '@/src/presentation/viewmodels/usersStore';

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
    <View style={styles.card}>
      <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
      <ThemedText>{item.email}</ThemedText>
    </View>
  ), []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Users</ThemedText>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
          <ThemedText type="link" onPress={() => { clearError(); loadUsers(); }}>Retry</ThemedText>
        </View>
      ) : null}

      {isLoading && users.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
          contentContainerStyle={users.length === 0 ? styles.emptyList : undefined}
          ListEmptyComponent={!isLoading ? (
            <ThemedText>No users found.</ThemedText>
          ) : null}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.08)',
  },
  errorText: {
    marginBottom: 6,
  },
  emptyList: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: 8,
  },
}); 