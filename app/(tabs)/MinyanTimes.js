import React, {useEffect, useState} from "react";
import {FlatList, Platform, ScrollView, Text, View} from 'react-native';
import {db} from "./Firebase";
import {collection, onSnapshot, addDoc} from "firebase/firestore"
import { LinearGradient } from "expo-linear-gradient";


const weekdayTimes = [
    {id:"local-1", name: 'Selichot#1', time: '5:00 AM' },
    {id:"local-2", name: 'Shacharit', time: '7:30 AM' },
    {id:"local-3", name: 'Shacharit', time: '7:30 AM' },
    {id:"local-4", name: "Selichot#2", time: "5:00 PM"},
    {id:"local-5", name: 'Mincha/Arvit', time: '5:45 PM' },
    // { name: 'Maariv', time: '8:45 PM'},
];

function MinyanTimes() {
    const [minyanTimes, setMinyanTimes] = useState([]);
    const [shabbatTimes, setshabbatTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [_loading, _setLoading] = useState(true);



        useEffect(() => {
            setLoading(true);
            const q = collection(db, "PrayerName");
            const unsub = onSnapshot(
                q,
                (snap) => {
                    const list = snap.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    // @ts-ignore
                    setMinyanTimes(list);
                    setLoading(false);
                },
                () => setLoading(false)
            );
            return unsub;
        }, []);
    useEffect(() => {
        _setLoading(true);
        const q = collection(db, "ShabbatTimes");
        const unsub = onSnapshot(
            q,
            (snap) => {
                const _list = snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // @ts-ignore
                setshabbatTimes(_list);
                _setLoading(false);

                console.log("[Shabbat snapshot]", _list);
            },
            (err) => {
                console.error("[Shabbat snapshot ERROR]", err);
                _setLoading(false);
            }
        );
        return unsub;
    }, []);

    // Add a new document in collection "cities"
   // const addData1 = asnyc () => {await setDoc(doc(db, "cities", "LA"), {
   //     name: "Los Angeles",
   //     state: "CA",
   //     country: "USA"
   // })}

// Add a new document with a generated id.

    console.log(minyanTimes);
    console.log(shabbatTimes);
    const cardShadow =
        Platform.OS === "ios"
            ? {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
            }
            : { elevation: 3 };

    /** @param {import('react-native').ListRenderItemInfo<any>} param0 */
    const renderItem = ({ item }) => (
        <View className="mx-4 rounded-full overflow-hidden" style={cardShadow}>
            <LinearGradient
                colors={["#E8D4C0", "#F0E5D8"]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
            >
                {/* The flex-row MUST be inside the gradient */}
                <View className="flex-row items-center justify-between p-4">
                    <Text className="text-base font-semibold text-neutral-800">
                        {item.PrayerName}
                    </Text>
                    <Text className="text-base text-neutral-800">{item.Time}</Text>
                </View>
            </LinearGradient>
        </View>
    );


    if (loading) return <Text>Loading…</Text>;
    if (_loading) return <Text>Loading…</Text>;

    return (

        <ScrollView
            className="bg-neutral-50"
            contentContainerClassName="py-8"
            showsVerticalScrollIndicator={false}
        >
            <FlatList
                ListHeaderComponent={
                    <Text className="text-center font-semibold text-neutral-800 mt-5 mb-4">Weekday Minyan Times</Text>
                }
                data={minyanTimes}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View className="h-3" />} // spacing between pills
                scrollEnabled={false}                // inside ScrollView
                removeClippedSubviews
                contentContainerClassName="mb-5"
            />
            <FlatList
                ListHeaderComponent={
                    <Text className="text-center font-semibold text-neutral-800 mb-4">Shabbat Minyan Times</Text>
                }
                data={shabbatTimes}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View className="h-3" />} // spacing between pills
                scrollEnabled={false}                // inside ScrollView
                removeClippedSubviews
                contentContainerClassName="mb-8"
            />

       </ScrollView>
    );
}
export default MinyanTimes;

    {/*// <ScrollView className="p-4 bg-gray-100">*/}
    {/*//     <Text className="text-2xl font-bold mt-3 text-center">Weekday Minyan Times</Text>*/}
    {/*//*/}
    {/*//     <View>*/}
    {/*//         {weekdayTimes.map((minyan, idx) => (*/}
    {/*//             <View key={idx}*!/*/}
    {/*//                   className="flex-row items-center justify-between mb-4 p-4 rounded-xl bg-light-200 shadow">*/}
    {/*//                 <View className="flex-row items-center space-x-3">*/}
    {/*//                     <Text className="text-lg font-semibold">{minyan.name}</Text>*/}
    {/*//                 </View>*/}
    {/*//                 <Text className="text-lg">{minyan.time}</Text>*/}
    {/*//*/}
    {/*//             </View>*/}
    {/*    //     ))}*/}
    {/*    // </View>*/}
    {/*// </ScrollView>*/}


    // <View>
    //     <Text>MinyanTimes</Text>
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
    // </View>
    // <SafeAreaView className="flex-1">
    //     <ScrollView className="pt-8 bg-blue-50">
    //         <Text className="text-2xl font-bold text-center mt-4 mb-6">
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
    //       border border-gray-200
    //       shadow
    //       elevation-2
    //     "
    //             >
    //                 <View className="flex-row justify-between items-center">
    //                     <Text className="text-lg font-semibold">{minyan.name}</Text>
    //                     <Text className="text-lg">{minyan.time}</Text>
    //                 </View>
    //             </View>
    //         ))}
    //     </ScrollView>
    // </SafeAreaView>



