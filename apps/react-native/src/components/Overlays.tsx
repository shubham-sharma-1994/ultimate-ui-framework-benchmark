import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  SlideInDown,
  SlideOutDown,
  runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { AnimatedView } from './AnimatedView';
import { AnimatedText } from './AnimatedText';
import { Motion } from '../constants/Theme';

export const Overlays = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2000); // Stays 2s
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button testID="btn-dialog" title="Show dialog" onPress={() => setDialogVisible(true)} />
        <Button testID="btn-sheet" title="Show sheet" onPress={() => setSheetVisible(true)} />
        <Button testID="btn-toast" title="Toast" onPress={showToast} />
      </View>

      {/* Dialog Modal */}
      <Modal visible={dialogVisible} transparent animationType="none">
        <Animated.View entering={(FadeIn as any).duration(Motion.base.duration)} style={styles.scrim}>
          <AnimatedView
            bgKey="surface"
            style={styles.dialog}
            entering={(Animated as any).ZoomIn.duration(Motion.base.duration).withInitialValues({ transform: [{ scale: 0.9 }] })}
          >
            <AnimatedText type="title">Dialog</AnimatedText>
            <AnimatedText type="body" style={{ marginVertical: 16 }}>This is a modal dialog.</AnimatedText>
            <Button title="Close" onPress={() => setDialogVisible(false)} />
          </AnimatedView>
        </Animated.View>
      </Modal>

      {/* Sheet Modal */}
      <Modal visible={sheetVisible} transparent animationType="none">
        <SheetContent onClose={() => setSheetVisible(false)} />
      </Modal>

      {/* Toast */}
      {toastVisible && (
        <AnimatedView
          bgKey="surfaceAlt"
          style={styles.toast}
          entering={(SlideInDown as any).duration(Motion.base.duration)}
          exiting={(SlideOutDown as any).duration(Motion.base.duration)}
        >
          <AnimatedText type="body">This is a toast</AnimatedText>
        </AnimatedView>
      )}
    </View>
  );
};

const SheetContent = ({ onClose }: { onClose: () => void }) => {
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      if (event.translationY > 0) translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(500, Motion.base, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withTiming(0, Motion.base);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <View style={styles.sheetScrim}>
      <GestureDetector gesture={pan}>
        <AnimatedView
          bgKey="surface"
          style={[styles.sheet, style] as any}
          entering={(SlideInDown as any).duration(Motion.base.duration)}
        >
          <View style={styles.handle} />
          <AnimatedText type="title">Bottom Sheet</AnimatedText>
        </AnimatedView>
      </GestureDetector>
    </View>
  );
};

const Button = ({ title, onPress, testID }: any) => (
  <Pressable testID={testID} accessibilityLabel={testID} onPress={onPress} style={styles.button}>
    <AnimatedText type="label" colorKey="primary">{title}</AnimatedText>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 12,
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
  },
  sheetScrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: 300,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  }
});
