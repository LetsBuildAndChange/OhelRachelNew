import {ScrollView, Text, View, Image} from "react-native";
import {images} from "@/constants/images";
import React from "react";

export default function IndexContent() {
    return (
     <View className={"flex-1 bg-primary"}>
      <ScrollView>
      <Text className={"text-5xl font-bold mt-20 mb-3 text-center w-full"} style={{ color: '#000000' }}>Welcome!</Text>
          <Image
              source={images.newlogo}
              style={{
                  width: 132, // equivalent to w-48
                  height: 102, // equivalent to h-40
                  marginTop: 15, // equivalent to mt-20
                  marginBottom: 20, // equivalent to mb-5
                  marginLeft: 'auto',
                  marginRight: 'auto',
              }}
              resizeMode="contain"
              fadeDuration={0}
              progressiveRenderingEnabled={true}
          />
          <Text className="text-lg text-center px-6 mb-8" style={{color: '#000000'}}>
              Welcome to Ohel Rachel! We're delighted to have you here. Explore our events, lectures, and ways to
              contribute to our thriving community.
          </Text>

      </ScrollView>
    </View>
  );
}