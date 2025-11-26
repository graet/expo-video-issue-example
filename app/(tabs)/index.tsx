import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, ViewToken } from 'react-native';

const VIDEO_URLS = [
  'https://assets.graet.com/videos/67fdc7c142798ffa8132e179/wall-video/691a6ae66bc19fda002cc3d4-segmentation-hls/691a6ae66bc19fda002cc3d4-segmentation.m3u8',
  'https://assets.graet.com/videos/663785d70727fd899b833932/wall-video/691a4d096bc19fda0024e098-segmentation-hls/691a4d096bc19fda0024e098-segmentation.m3u8',
  'https://assets.graet.com/videos/66f276122c6c97f9b2d16441/wall-video/6919b4b5fdd0a492f44b5925-segmentation-hls/6919b4b5fdd0a492f44b5925-segmentation.m3u8',
  'https://assets.graet.com/videos/68a221e4a7208f0e52a886fe/wall-video/691a30e84fb537c62d8e25cb-hls/691a30e84fb537c62d8e25cb.m3u8',
  'https://assets.graet.com/videos/670ef9958095b47243ec451b/wall-video/691bb17980e5006e9ba4b2b4-segmentation-hls/691bb17980e5006e9ba4b2b4-segmentation.m3u8',
  'https://assets.graet.com/videos/68b6c3236e3803cf080b0011/wall-video/691a512f6bc19fda00262c49-segmentation-hls/691a512f6bc19fda00262c49-segmentation.m3u8',
  'https://assets.graet.com/videos/66f6fb73b42415307f91c1d2/wall-video/691a4f936bc19fda0025baa0-hls/691a4f936bc19fda0025baa0.m3u8',
  'https://assets.graet.com/videos/678ac02db3ee30f1b429fa61/wall-video/6916619c07bc03253867d036-hls/6916619c07bc03253867d036.m3u8',
  'https://assets.graet.com/videos/68ee979df744d968262002b8/wall-video/68ee98c9dfff293e5a5dac5d-hls/68ee98c9dfff293e5a5dac5d_1080.m3u8',
  'https://assets.graet.com/videos/68b6c3236e3803cf080b0011/wall-video/691a512f6bc19fda00262c49-segmentation-hls/691a512f6bc19fda00262c49-segmentation_1080.m3u8',
  'https://assets.graet.com/videos/670ef9958095b47243ec451b/wall-video/691bb17980e5006e9ba4b2b4-segmentation-hls/691bb17980e5006e9ba4b2b4-segmentation_1080.m3u8',
  'https://assets.graet.com/videos/66f6fb73b42415307f91c1d2/wall-video/691a4f936bc19fda0025baa0-hls/691a4f936bc19fda0025baa0_1080.m3u8',
  'https://assets.graet.com/videos/671e2a2f7404e85f14e7e96e/wall-video/6914ee0299b9a96a2b8d369d-hls/6914ee0299b9a96a2b8d369d.m3u8',
  'https://assets.graet.com/videos/68a221e4a7208f0e52a886fe/wall-video/691a30e84fb537c62d8e25cb-hls/691a30e84fb537c62d8e25cb_1080.m3u8',
  'https://assets.graet.com/videos/67e8a78923996cae0d8f5a55/wall-video/691de0048e1a5fd295a961c4-hls/691de0048e1a5fd295a961c4_1080.m3u8',
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = 300;

interface VideoItemProps {
  url: string;
  index: number;
  isVisible: boolean;
}

function VideoItem({ url, index, isVisible }: VideoItemProps) {
  const player = useVideoPlayer(isVisible ? url : null, (player) => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
  }, [isVisible, player]);

  return (
    <View style={styles.videoContainer}>
      <Text style={styles.videoLabel}>Video {index + 1}</Text>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />
      <Text style={styles.statusText}>
        {isVisible ? '▶ Playing' : '⏸ Paused (unloaded)'}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set([0]));

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleIndices = new Set(
        viewableItems.map((item) => item.index).filter((i): i is number => i !== null)
      );
      setVisibleItems(visibleIndices);
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <VideoItem url={item} index={index} isVisible={visibleItems.has(index)} />
    ),
    [visibleItems]
  );

  const keyExtractor = useCallback((item: string, index: number) => `${index}-${item}`, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={VIDEO_URLS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT + 60,
    marginBottom: 20,
    backgroundColor: '#111',
  },
  videoLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  video: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  },
  statusText: {
    color: '#888',
    fontSize: 12,
    padding: 10,
  },
});
