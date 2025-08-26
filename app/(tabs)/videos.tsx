import {View, Text, StyleSheet, ScrollView} from "react-native";
import React from "react";
import WebView from "react-native-webview";
import YouTubeEmbed from "@/Components/YoutubeEmbed";

const Videos = () => {
    return(
        <ScrollView className = "flex-1 bg-primary mt-4">
           <YouTubeEmbed/>
        </ScrollView>
    )
}
// const Videos = () => {
//     // ✅ Hardcoded options
//     const videoId = "wvQUJTf5mcw"; // ← Put your video ID here if you want a specific video
//     const channelId = null; // ← Replace with your channel ID
//
//
//     return (
//         // SHOWS EMBEDDED VIDEOS
//         <ScrollView contentContainerStyle={styles.container}>
//             {/* Specific YouTube video */}
//             <Text style={styles.header}>Video</Text>
//             <View style={styles.videoBox}>
//                 <WebView
//                     source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
//                     javaScriptEnabled
//                     allowsFullscreenVideo
//                     style={styles.webview}
//                 />
//             </View>
//
//             {/* YouTube Livestream */}
//             <Text style={styles.header}>Livestream</Text>
//             <View style={styles.videoBox}>
//                 <WebView
//                     source={{ uri: `https://www.youtube.com/embed/live_stream?channel=${channelId}` }}
//                     javaScriptEnabled
//                     allowsFullscreenVideo
//                     style={styles.webview}
//                 />
//             </View>
//         </ScrollView>
//     );
// };
    // SHOWS ENTIRE WEBSITE (first just one embedded video)
    // let embedUrl = null;

//     if (videoId) {
//         embedUrl = `https://www.youtube.com/embed/${videoId}`;
//     } else if (channelId) {
//         embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
//     }
//
//     if (!embedUrl) {
//         return (
//             <View style={styles.messageContainer}>
//                 <Text style={styles.messageText}>
//                     No videoId or channelId set.
//                 </Text>
//             </View>
//         );
//     }
//
//     return (
//         <View style={styles.container}>
//             <WebView
//                 source={{ uri: embedUrl }}
//                 javaScriptEnabled
//                 allowsFullscreenVideo
//                 style={{ flex: 1 }}
//             />
//         </View>
//     );
// };

export default Videos;
// Part of SHOWS EMBEDDED VIDEOS
const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    videoBox: {
        height: 200,
        marginBottom: 20,
    },
    webview: {
        flex: 1,
    },
});

// Part of SHOWS ENTIRE WEBSITE (first just one embedded video)
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     messageContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     messageText: {
//         fontSize: 16,
//         color: '#555',
//     },
// });

// GENERAL CODE FOR WEBVIEW FEATURE
// const Videos = () => {
//     return(
//         <View>
//             <WebView
//                 source={{ uri: "https://www.youtube.com/embed/wvQUJTf5mcw" }}
//                 javaScriptEnabled
//                 style={{ flex: 1 }}
//             />
//
//         </View>
//     )
// }

