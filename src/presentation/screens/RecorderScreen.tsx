import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, Alert, Image, Modal} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRecorderStore} from '@/src/presentation/viewmodels/recorderStore';
import {useBottomTabOverflow} from '@/src/presentation/components/ui/TabBarBackground';
import {useSeekBar} from '@/src/presentation/hooks/useSeekBar';
import {SeekBar} from '@/src/presentation/components/SeekBar';
import RecordingIcon from '@/assets/images/Recordings.png';
import {Ionicons} from '@expo/vector-icons';
import "../../../global.css";
import {SwipeListView} from "react-native-swipe-list-view";

export default function RecorderScreen() {
    const items = useRecorderStore((s) => s.items);
    const isRecording = useRecorderStore((s) => s.isRecording);
    const isPreparing = useRecorderStore((s) => s.isPreparing);
    const isStopping = useRecorderStore((s) => s.isStopping);
    const isPaused = useRecorderStore((s) => s.isPaused);
    const errorMessage = useRecorderStore((s) => s.errorMessage);
    const isPlaying = useRecorderStore((s) => s.isPlaying);
    const isPausedPlayback = useRecorderStore((s) => s.isPausedPlayback);
    const playingUri = useRecorderStore((s) => s.playingUri);
    const playbackPosition = useRecorderStore((s) => s.playbackPosition);
    const playbackDuration = useRecorderStore((s) => s.playbackDuration);

    const load = useRecorderStore((s) => s.load);
    const start = useRecorderStore((s) => s.start);
    const stopAndSave = useRecorderStore((s) => s.stopAndSave);
    const pause = useRecorderStore((s) => s.pause);
    const resume = useRecorderStore((s) => s.resume);
    const play = useRecorderStore((s) => s.play);
    const pausePlayback = useRecorderStore((s) => s.pausePlayback);
    const resumePlayback = useRecorderStore((s) => s.resumePlayback);
    const stopPlayback = useRecorderStore((s) => s.stopPlayback);
    const seekPlayback = useRecorderStore((s) => s.seekPlayback);
    const clearError = useRecorderStore((s) => s.clearError);
    const deleteItem = useRecorderStore((s) => s.deleteRecording);


    const bottomInset = useBottomTabOverflow();
    const insets = useSafeAreaInsets();

    const {
        isSeeking,
        seekPosition,
        handleSeekStart,
        handleSeekChange,
        handleSeekComplete,
        formatTime,
    } = useSeekBar(playbackDuration, playbackPosition, seekPlayback);

  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

    useEffect(() => {
        if (errorMessage) {
            Alert.alert('Recorder', errorMessage, [{text: 'OK', onPress: clearError}]);
        }
    }, [errorMessage, clearError]);

    // Auto-close the dialog when playback ends (not when paused)
    useEffect(() => {
        if (!isPlaying && !isPausedPlayback && !playingUri) {
            setShowPlayer(false);
        }
    }, [isPlaying, isPausedPlayback, playingUri]);

    const busy = isPreparing || isStopping;

    const onPressPlay = async (uri: string) => {
        try {
            await play(uri);
            setShowPlayer(true);
        } catch {
        }
    };

    const renderPlayerControls = () => {
        if (!isPlaying && !isPausedPlayback && !playingUri) {
            return null;
        }
        const playingFileName = playingUri!.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Unknown';

        return (
            <View
                className="px-4 pt-4 border-t border-gray-300 bg-white"
                style={{paddingBottom: insets.bottom + bottomInset}}
            >

                {/* Seek Bar */}
                <SeekBar
                    duration={playbackDuration}
                    position={isSeeking ? seekPosition : playbackPosition}
                    onSeek={handleSeekComplete}
                    formatTime={formatTime}
                />
              {/* Display the name of the file being played */}
              <Text className="text-center text-gray-800 font-medium mb-2">
                {playingFileName}
              </Text>

                {/* Player Controls */}
                <View className="flex-row justify-center items-center py-4 gap-6">
                    {/* Pause/Resume Button */}
                    <TouchableOpacity
                        onPress={isPlaying ? pausePlayback : resumePlayback}
                        className="w-16 h-16 bg-[#D2000F] rounded-full items-center justify-center"
                    >
                        {isPlaying ? (
                            <Ionicons name="pause" size={28} color="#FFFFFF"/>
                        ) : (
                            <Ionicons name="play" size={28} color="#FFFFFF"/>
                        )}
                    </TouchableOpacity>

                    {/* Stop Button */}
                    <TouchableOpacity
                        onPress={() => {
                            stopPlayback();
                            setShowPlayer(false);
                        }}
                        className="w-12 h-12 bg-gray-600 rounded-full items-center justify-center"
                    >
                        <Ionicons name="stop" size={28} color="#FFFFFF"/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderRecordingControls = () => {
        if (isPlaying || isPausedPlayback || showPlayer) return null;

        return (
            <View
                className={`px-4 pt-4 border-t border-gray-300 bg-white ${busy ? 'opacity-60' : ''}`}
                style={{paddingBottom: bottomInset}}
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
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F1ED]">
            <SwipeListView
                data={items}
                keyExtractor={(item) => item.uri}
                contentContainerStyle={[
                    items.length === 0 ? {
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    } : {paddingTop: 16},
                    {paddingBottom: bottomInset + 88},
                ]}
                ListEmptyComponent={<Text className="text-gray-500 text-center">No recordings yet</Text>}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => onPressPlay(item.uri)} className="mx-4 mb-3">
                        <View className="bg-white rounded-xl p-4 flex-row items-center">
                            {/* Microphone Icon */}
                            <View className="w-16 h-16 bg-purple-200 rounded-lg items-center justify-center mr-4">
                                <Image
                                    source={RecordingIcon}
                                    style={{width: 64, height: 64, borderRadius: 8}}
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
                                onPress={() => onPressPlay(item.uri)}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                                    <Text className="text-red-600 text-lg">▶</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                renderHiddenItem={({item}) => (
                    <View className="flex-1 flex-row justify-end items-center mr-4">
                        <TouchableOpacity
                            onPress={() => deleteItem(item.uri)}
                            className="w-16 h-20 justify-center items-center bg-[#D2000F] rounded-xl"
                        >
                            <Ionicons name="trash" size={28} color="#fff" />
                            <Text className="text-white font-bold mt-1">Delete</Text>
                        </TouchableOpacity>
                    </View>

                )}
                rightOpenValue={-80}
            />


            {/* Recording Controls (hidden while modal is open) */}
            {renderRecordingControls()}

            {/* Player Controls Dialog */}
            <Modal
                visible={showPlayer}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    stopPlayback();
                    setShowPlayer(false);
                }}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-2xl overflow-hidden">
                        {/* Header */}
                        <View className="px-4 pt-3 pb-2 border-b border-gray-200 flex-row items-center justify-between">
                            <Text className="text-base font-semibold">Now Playing</Text>
                            <TouchableOpacity onPress={() => {
                                stopPlayback();
                                setShowPlayer(false);
                            }}>
                                <Text className="text-gray-600 text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>
                        {renderPlayerControls()}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}