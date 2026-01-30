import { icons } from "@/constants/icons"; // Import the icons
import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

interface TabIconProps {
    focused: boolean;
    icon: any;
    text: string;
}

const TabIcon = ({focused, icon, text}: TabIconProps) => {
    // if(focused) {
    //     return (
    //         <>
    //             <ImageBackground
    //                              className="flex flex-row w-full flex-1 min-w-[100px] min-h-14 mt-4 justify-center
    //                               items-center rounded-full overflow-hidden ">
    //                 <Image source={icon}
    //                        tintColor="#151312" className="size-5"/>
    //                 <Text className="text-third text-base font-semibold ml-2">{text}</Text>
    //             </ImageBackground>
    //
    //         </>
    //     )
    // }
    return (
        // <View className={"flex-1 size-full justify-center items-center mt-4 rounded-full"}>
        <View 
            className="w-16 items-center justify-center py-1"
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel={text}
        >
        <Image
                source={icon}
                tintColor={focused ? "#151312" : "#A8B5DB"}
                className="w-5 h-5"
                resizeMode="contain"
            />
            <Text
                numberOfLines={1}                 // keep to one line instead of wrapping/clipping
                allowFontScaling={false}
                className={focused
                    ? "mt-1 text-[11px] font-semibold text-[#151312]"
                    : "mt-1 text-[11px] text-[#6A6F7D]"
                }
            >{text}</Text>
            {/*<Image source={icon} tintColor={'#A8B5DB'}*/}
            {/*       className="size-5"/>*/}
            {/*<Text className={"text-xs justify-center items-center"}>{text}</Text>*/}
        </View>
    )
}

export default function TabLayout() {
    return(
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: { paddingVertical: 6 },
            tabBarStyle: {
                height: 70,
                backgroundColor: '#ffffff',
                borderTopWidth: 0,
                paddingTop: 6,
                paddingBottom: 10,
                // justifyContent: 'center',
                // alignItems: 'center',
            }
        }}>
        <Tabs.Screen
                name = "index"
                options = {{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({focused})=> (
                        <TabIcon focused = {focused} icon = {icons.homeicon}  text = "Home" />
                    ),
                    tabBarAccessibilityLabel: "Home tab"


                }}


            />
            <Tabs.Screen
                name = "MinyanTimes"
                options = {{
                    title: "Minyan Times",
                    headerShown: false,
                    tabBarIcon: ({focused})=> (
                        <TabIcon focused = {focused} icon = {icons.torahbook}  text = "Minyan" />
                    ),
                    tabBarAccessibilityLabel: "Minyan Times tab"

                }}
            />
            <Tabs.Screen
                name="Events"
                options={{ href: null }} // Causes the "Events" to be hidden
                // options={{
                //     title: "Events",
                //     headerShown: false,
                //     tabBarIcon:({focused})=>(
                //         <TabIcon focused = {focused} icon = {icons.event}  text = "Events" />
                //     )
                // }
                // }
            />
            <Tabs.Screen
                name = "videos"
                options={{ href: null }} // Causes the "Videos" to be hidden
                // options = {{
                //     title: "Lectures",
                //     headerShown: false,
                //     tabBarIcon: ({focused})=> (
                //         <TabIcon focused = {focused} icon = {icons.openbook}  text = "Lectures" />
                //     )
                // }}
            />
            <Tabs.Screen
                name = "donation"
                options = {{
                    title: "Donate",
                    headerShown: false,
                    tabBarIcon: ({focused})=> (
                        <TabIcon focused = {focused} icon = {icons.charity}  text = "Donate" />
                    ),
                    tabBarAccessibilityLabel: "Donate tab"

                }}
            />
        </Tabs>
    )
}
