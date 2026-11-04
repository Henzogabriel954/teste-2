import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView } from 'expo-camera';

export default function CameraFeed({
  torchOn = false,
  scanned = false,
  onBarcodeScanned,
  cameraKey = 1,
}) {
  return (
    <View style={styles.container}>
      <CameraView
        key={`cam-native-${cameraKey}`}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
});
