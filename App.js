import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      const statusMedia = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted" && statusMedia.status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // https://docs.expo.dev/versions/v42.0.0/sdk/camera/
  // https://docs.expo.dev/versions/latest/sdk/media-library/#medialibrarysavetolibraryasynclocaluri
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: "flex-end",
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Ionicons
                name={
                  Platform.OS === "ios"
                    ? "ios-camera-reverse"
                    : "camera-reverse"
                }
                size={40}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync({opacity: 0.5, base64: true});
                  await MediaLibrary.saveToLibraryAsync(photo.uri);
                  // base64 could be sent to a backend to be handled and stored
                  //console.log("photo", photo.uri, photo.base64);
                }
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: "white",
                  height: 50,
                  width: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: "white",
                    height: 40,
                    width: 40,
                    backgroundColor: "white",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{alignSelf: 'center'}} onPress={async() => {
              if(!recording){
                setRecording(true)
              let video = await cameraRef.recordAsync();
              console.log('video', video);
            } else {
                setRecording(false)
                cameraRef.stopRecording()
            }
          }}>
            <View style={{ 
               borderWidth: 2,
               borderRadius:25,
               borderColor: 'red',
               height: 50,
               width:50,
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center'}}
            >
              <View style={{
                 borderWidth: 2,
                 borderRadius:25,
                 borderColor: 'red',
                 height: 40,
                 width:40,
                 backgroundColor: 'red'}} >
              </View>
            </View>
          </TouchableOpacity> */}
          </View>
        </View>
      </Camera>
    </View>
  );
}
