// YouTubeEmbed.ios.tsx  ← iOS-only file (RN will auto-pick this on iOS)
import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function YouTubeEmbed() {
    const videoId = "wvQUJTf5mcw";

    // Helper: allow exact host or subdomain match
    const isAllowedHost = (host: string) => {
        const allow = [
            "youtube-nocookie.com",
            "youtube.com",
            "ytimg.com",
            "google.com",
            "gstatic.com",
            "googlevideo.com", // media CDN used by YouTube
        ];
        return allow.some((d) => host === d || host.endsWith("." + d));
    };

    const src = `https://www.youtube-nocookie.com/embed/${videoId}`
        + `?playsinline=1&modestbranding=1&rel=0&fs=0&iv_load_policy=3&enablejsapi=1&controls=1`;

    const html = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, width=device-width"/>
    <style>html,body{margin:0;background:#000;height:100%;overflow:hidden}</style>
  </head>
  <body>
    <iframe
      id="ytplayer"
      width="100%" height="100%"
      src="${src}"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen="false">
    </iframe>
  </body>
</html>`;

    return (
        <View style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" }}>
            <WebView
                style={{ flex: 1, backgroundColor: "#000" }}
                source={{ html }}
                // iOS-friendly flags:
                originWhitelist={["*"]}                 // allow about:blank → our HTML
                allowsInlineMediaPlayback                // required for inline playback on iOS
                mediaPlaybackRequiresUserAction={false}  // tap-to-play not required
                bounces={false}
                decelerationRate="normal"
                // Block navigation out of the embed:
                onShouldStartLoadWithRequest={(req) => {
                    if (req.url === "about:blank" || req.url.startsWith("data:")) return true;
                    try {
                        const { hostname } = new URL(req.url);
                        return isAllowedHost(hostname);
                    } catch {
                        return false;
                    }
                }}
            />
        </View>
    );
}
