import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CameraFeedWeb() {
  const videoRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let stream = null;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().catch((err) => console.warn('Play error:', err));
            };
          }
        })
        .catch((err) => {
          console.warn('Webcam permission error:', err);
          setErrorMsg(
            'Permissão da câmera necessária no navegador. Clique no ícone de câmera/cadeado na barra de endereços para permitir.'
          );
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.errorBox}>
        <Ionicons name="videocam-off-outline" size={40} color="#8FB8A0" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        backgroundColor: '#000000',
      }}
    />
  );
}

const styles = StyleSheet.create({
  errorBox: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#0C1C13',
  },
  errorText: {
    color: '#B2C9BC',
    textAlign: 'center',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 10,
  },
});
