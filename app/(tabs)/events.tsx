import { View, Text } from 'react-native';
import { ScrollView, SafeAreaView } from 'react-native';
import React from "react";

const minyanTimes = [
    { name: 'Shacharit', time: '7:30 AM' },
    { name: 'Mincha', time: '1:30 PM' },
    { name: 'Maariv', time: '8:45 PM'},
];

export default function MinyanTimes() {
    return (
        
        // <View>
        //     <Text>MinyanTimes</Text>
        // </View>
        // <ScrollView className="p-4">
        //     <Text className="text-2xl font-bold mt-10 text-center">Weekday Minyan Times</Text>
        //     {minyanTimes.map((minyan, idx) => (
        //         <View key={idx} className="flex-row items-center justify-between mb-4 p-4 rounded-2xl bg-white shadow">
        //             <View className="flex-row items-center space-x-3">
        //                 {/*{minyan.icon}*/}
        //                 <Text className="text-lg font-semibold">{minyan.name}</Text>
        //             </View>
        //             <Text className="text-lg">{minyan.time}</Text>
        //         </View>
        //     ))}
        //     </ScrollView>
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="pt-8">
                <Text className="text-2xl font-bold text-center mb-6">
                    Weekday Minyan Times
                </Text>

                {minyanTimes.map((minyan, idx) => (
                    <View
                        key={idx}
                        className="
              bg-white
              mx-4
              py-4 px-6
              mb-4
              rounded-full
              border border-gray-200
              shadow
              elevation-2
            "
                    >
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg font-semibold">{minyan.name}</Text>
                            <Text className="text-lg">{minyan.time}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
        // <SafeAreaView className="flex-1 bg-gray-100">
        //     <ScrollView className="pt-8">
        //         <Text className="text-2xl font-bold text-center mb-6">
        //             Weekday Minyan Times
        //         </Text>
        //
        //         {minyanTimes.map((minyan, idx) => (
        //             <View
        //                 key={idx}
        //                 className="
        //       bg-white
        //       mx-4
        //       py-4 px-6
        //       mb-4
        //       rounded-full
        //       shadow-lg
        //       elevation-3
        //     "
        //             >
        //                 <View className="flex-row justify-between items-center">
        //                     <Text className="text-lg font-semibold">
        //                         {minyan.name}
        //                     </Text>
        //                     <Text className="text-lg">{minyan.time}</Text>
        //                 </View>
        //             </View>
        //         ))}
        //     </ScrollView>
        // </SafeAreaView>

)
    ;
}
