import {Text, View} from "react-native";
import {Tabs} from "expo-router";
import {ImageBackground} from "react-native";
import {Image} from "react-native";
import {icons} from "@/constants/icons"; // Import the icons
import {images} from "@/constants/images";
import React from "react";

interface TabIconProps {
    focused: boolean;
    icon: any;
    text: string;
}

const TabIcon = ({focused, icon, text}: TabIconProps) => {
    if(focused) {
        return (
            <>
                <ImageBackground source={images.highlight}
                                 className="flex flex-row w-full flex-1 min-w-[100px] min-h-14 mt-4 justify-center
                                  items-center rounded-full overflow-hidden ">
                    <Image source={icon}
                           tintColor="#151312" className="size-5"/>
                    <Text className="text-third text-base font-semibold ml-2">{text}</Text>
                </ImageBackground>

            </>
        )
    }
    return (
        <View className={"size-full justify-center items-center mt-4 rounded-full"}>
            <Image source={icon} tintColor={'#A8B5DB'}
                   className="size-5"/>
        </View>
    )
}

export default function TabLayout() {
    return(
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                height: 70,
                backgroundColor: '#ffffff',
                borderTopWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }
        }}>
        <Tabs.Screen
                name = "index"
                options = {{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({focused})=> (
                        <TabIcon focused = {focused} icon = {icons.home}  text = "Home" />
                    )
                    

                }}


            />
            <Tabs.Screen
                name = "events"
                options = {{
                    title: "Events",
                    headerShown: false,
                    tabBarIcon: ({focused})=> (
                        <TabIcon focused = {focused} icon = {icons.event}  text = "Events" />
                    )

                }}
            />
            <Tabs.Screen
                name = "videos"
                options = {{
                    title: "Lectures",
                    headerShown: false,
                    tabBarIcon: ({focused})=> (
                        <TabIcon focused = {focused} icon = {icons.openbook}  text = "Lectures" />
                    )
                }}
            />
            <Tabs.Screen
                name = "donation"
                options = {{
                    title: "Donate",
                    headerShown: false,
                    tabBarIcon: ({focused})=> (
                        <TabIcon focused = {focused} icon = {icons.charity}  text = "Donate" />
                    )

                }}
            />
        </Tabs>
    )
}
