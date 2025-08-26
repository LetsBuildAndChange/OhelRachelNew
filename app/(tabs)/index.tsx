import {ScrollView, Text, View, Image} from "react-native";
import {images} from "@/constants/images";
import React from "react";

export default function IndexContent() {
    return (
     <View className={"flex-1 bg-primary"}>
      <ScrollView>
      <Text className={"text-3xl font-bold mt-20 mb-3 text-center w-full color-dark-200"}>
          Welcome to Ohel Rachel!</Text>
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
          <View className={"flex-row items-center justify-between mb-4 p-4 rounded-xl bg-fourth"}>
          <Text className="text-lg text-center">
              We are delighted to have you here! Explore our events, lectures, and ways to
              contribute to our thriving community.
          </Text>
          </View>
          <View className={"flex-row items-center justify-between mb-4 p-4 rounded-xl bg-fourth"}>
          <Text className="text-lg text-center">
              Upcoming Events:
              Join us for Kiddush after Shacharit 9:00 am Minyan!
              Stay tuned for the new building updates!
          </Text>
          </View>

      </ScrollView>
    </View>
  );
}