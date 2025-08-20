import React, { useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecorderStore } from '@/src/presentation/viewmodels/recorderStore';
import { useBottomTabOverflow } from '@/src/presentation/components/ui/TabBarBackground';
import RecordingIcon from '@/assets/images/Recordings.png';
import "../../../global.css";

export default function RecorderScreen() {
  const items = useRecorderStore((s) => s.items);
  const isRecording = useRecorderStore((s) => s.isRecording);
  const isPreparing = useRecorderStore((s) => s.isPreparing);
  const isStopping = useRecorderStore((s) => s.isStopping);
  const isPaused = useRecorderStore((s) => s.isPaused);
  const errorMessage = useRecorderStore((s) => s.errorMessage);
  const load = useRecorderStore((s) => s.load);
  const start = useRecorderStore((s) => s.start);
  const stopAndSave = useRecorderStore((s) => s.stopAndSave);
  const pause = useRecorderStore((s) => s.pause);
  const resume = useRecorderStore((s) => s.resume);
  const play = useRecorderStore((s) => s.play);
  const clearError = useRecorderStore((s) => s.clearError);

  const bottomInset = useBottomTabOverflow();
  const insets = useSafeAreaInsets(); // Get safe area insets

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert('Recorder', errorMessage, [{ text: 'OK', onPress: clearError }]);
    }
  }, [errorMessage, clearError]);

  const busy = isPreparing || isStopping;

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1ED]">
      <FlatList
        data={items}
        keyExtractor={(item) => item.uri}
        contentContainerStyle={[
          items.length === 0 ? { flexGrow: 1, alignItems: 'center', justifyContent: 'center' } : { paddingTop: 16 },
          { paddingBottom: bottomInset + 88 },
        ]}
        ListEmptyComponent={<Text className="text-gray-500 text-center">No recordings yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => play(item.uri)} className="mx-4 mb-3">
            <View className="bg-white rounded-xl p-4 flex-row items-center">
              {/* Microphone Icon */}
              <View className="w-16 h-16 bg-purple-200 rounded-lg items-center justify-center mr-4">
                <Image
                  source={RecordingIcon}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                  resizeMode="contain"
                />
              </View>

              {/* Recording Details */}
              <View className="flex-1">
                <Text className="text-gray-800 font-medium text-base" numberOfLines={1}>
                  {item.filename.replace('.m4a', '')}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">{item.durationMs}</Text>
              </View>

              {/* Action Icon */}
              <TouchableOpacity
                onPress={() => play(item.uri)}
                className="w-10 h-10 items-center justify-center"
              >
                <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                  <Text className="text-red-600 text-lg">▶</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Controls section */}
      <View
        className={`px-4 pt-4 border-t border-gray-300 bg-white ${busy ? 'opacity-60' : ''}`}
        style={{ paddingBottom: bottomInset }}
      >
        {!isRecording ? (
          <TouchableOpacity
            className={`h-[52px] rounded-[18px] items-center justify-center bg-[#D2000F] active:bg-red-800 ${busy ? 'opacity-60' : ''
              }`}
            onPress={start}
            disabled={busy}
          >
            <Text className="text-white font-semibold text-base">Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row gap-3">
            {!isPaused ? (
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center bg-gray-600 active:bg-gray-700 ${busy ? 'opacity-60' : ''
                  }`}
                onPress={pause}
                disabled={busy}
              >
                <Text className="text-white font-semibold text-base">Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center bg-gray-600 active:bg-gray-700 ${busy ? 'opacity-60' : ''
                  }`}
                onPress={resume}
                disabled={busy}
              >
                <Text className="text-white font-semibold text-base">Resume</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className={`flex-1 py-4 rounded-lg items-center justify-center bg-red-500 active:bg-red-600 ${busy ? 'opacity-60' : ''
                }`}
              onPress={stopAndSave}
              disabled={busy}
            >
              <Text className="text-white font-semibold text-base">Stop & Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}