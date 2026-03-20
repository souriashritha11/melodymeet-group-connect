import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, ScrollView, TextInput, StatusBar as RNStatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring, FadeInUp, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const avatars = [
  require('../assets/images/avatar_1_1774008260316.png'),
  require('../assets/images/avatar_2_1774008276195.png'),
  require('../assets/images/avatar_3_1774008295403.png'),
  require('../assets/images/avatar_4_1774008315611.png'),
  require('../assets/images/avatar_5_1774008347990.png'),
];
const myAvatar = require('../assets/images/avatar_1_1774008260316.png');
const albumCover = require('../assets/images/album_cover_1774008465104.png');

export default function App() {
  const [inSession, setInSession] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle={inSession ? 'light-content' : 'dark-content'} />
      {inSession ? (
        <ActiveSessionScreen onEnd={() => setInSession(false)} insets={insets} />
      ) : (
        <CreateRoomScreen onStart={() => setInSession(true)} insets={insets} />
      )}
    </View>
  );
}

function CreateRoomScreen({ onStart, insets }: any) {
  const blobRotation = useSharedValue(0);

  useEffect(() => {
    blobRotation.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedBlobStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${blobRotation.value}deg` }, { scale: 1.2 }]
  }));

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#C193FF', '#7CE5A1', '#88B2FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFillObject, { height: height * 0.6 }]}
      />
      {/* Decorative Blob */}
      <Animated.View style={[styles.blob, { backgroundColor: '#FFED6D', top: 150, right: -50, width: 250, height: 250, borderRadius: 120 }, animatedBlobStyle]} />
      
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.header, { paddingTop: insets.top + 10 }]}>
         <Pressable style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
         </Pressable>
         <Text style={styles.headerTitle}>Create Room</Text>
         <Pressable style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
         </Pressable>
      </Animated.View>

      <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.heroCenter}>
         <View style={styles.groupIconContainer}>
            <Ionicons name="people-outline" size={50} color="#000" />
            <View style={styles.pencilBadge}>
                <Feather name="edit-2" size={14} color="#000" />
            </View>
         </View>
         <View style={styles.inputContainer}>
            <TextInput placeholder="Group name" style={styles.input} placeholderTextColor="#888" />
            <Feather name="edit-2" size={16} color="#888" />
         </View>
         <Text style={styles.subtext}>Provide a group subject <Text style={{fontWeight: 'bold', color: '#555'}}>and optional group</Text></Text>
         <Text style={styles.subtext}>icon</Text>
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View entering={FadeInUp.delay(300).springify().damping(18)} style={styles.bottomSheet}>
         <View style={styles.sheetHeader}>
             <Text style={styles.sheetTitle}>Participants</Text>
             <View style={styles.badge}><Text style={styles.badgeText}>6</Text></View>
         </View>

         <Text style={styles.sectionLabel}>Group Admin</Text>
         <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.adminRow}>
             <View style={[styles.avatarWrapper, styles.adminRing]}>
                <Image source={myAvatar} style={styles.avatarImg} />
             </View>
             <View>
                 <Text style={styles.adminName}>Designer</Text>
                 <Text style={styles.adminRole}>Group Admin</Text>
             </View>
         </Animated.View>

         <Text style={styles.sectionLabel}>Invited Members</Text>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersList}>
             <Animated.View entering={FadeInDown.delay(500).springify()}>
                <Pressable style={[styles.memberItem, styles.addBtn, { marginRight: 15 }]}>
                    <Feather name="plus" size={24} color="#000" />
                </Pressable>
             </Animated.View>
            {avatars.map((av, i) => (
                <Animated.View entering={FadeInDown.delay(600 + (i * 100)).springify()} key={i} style={styles.memberItem}>
                   <View style={[styles.avatarWrapper, styles.memberRing]}>
                      <Image source={av} style={styles.avatarImg} />
                   </View>
                   <Pressable style={styles.removeBadge}><Feather name="x" size={12} color="#000" /></Pressable>
                </Animated.View>
            ))}
         </ScrollView>

         <Animated.View entering={FadeInUp.delay(800).springify()}>
             <Pressable style={styles.createBtn} onPress={onStart}>
                 <Text style={styles.createBtnText}>Create Room</Text>
                 <Feather name="arrow-right" size={20} color="#000" />
             </Pressable>
         </Animated.View>
      </Animated.View>

      {/* Bottom Nav */}
      <Animated.View entering={FadeInUp.delay(400).springify()} style={[styles.bottomNav, { paddingBottom: insets.bottom || 20 }]}>
         <Ionicons name="home-outline" size={28} color="#000" />
         <Ionicons name="color-filter-outline" size={28} color="#000" />
         <Ionicons name="globe-outline" size={28} color="#000" />
         <Ionicons name="link-outline" size={28} color="#000" />
         <Ionicons name="person-outline" size={28} color="#000" />
      </Animated.View>
    </View>
  );
}

function ActiveSessionScreen({ onEnd, insets }: any) {
    const rotation = useSharedValue(0);
    const pulse = useSharedValue(1);
    const float1 = useSharedValue(0);
    const float2 = useSharedValue(0);
    const float3 = useSharedValue(0);
    const chatHeight = useSharedValue(0);

    const [isPlaying, setIsPlaying] = useState(true);
    const [micOn, setMicOn] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 10000, easing: Easing.linear }),
            -1,
            false
        );
        pulse.value = withRepeat(
            withTiming(1.05, { duration: 800, easing: Easing.ease }),
            -1,
            true
        );
        // Floating animations
        float1.value = withRepeat(withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
        float2.value = withRepeat(withTiming(15, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true);
        float3.value = withRepeat(withTiming(-15, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        chatHeight.value = withSpring(chatOpen ? 250 : 0, { damping: 15, stiffness: 100 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatOpen]);

    const animatedRecord = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }]
    }));

    const animatedPulse = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }]
    }));

    const animatedChat = useAnimatedStyle(() => ({
        height: chatHeight.value,
        opacity: chatHeight.value > 10 ? 1 : 0
    }));

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <View style={styles.sessionContainer}>
            <LinearGradient
                colors={['#0F2027', '#203A43', '#2C5364']}
                style={StyleSheet.absoluteFillObject}
            />
            {/* Animated bg glows */}
            <View style={[styles.glowBlob, { backgroundColor: '#E100FF', top: -50, left: -50 }]} />
            <View style={[styles.glowBlob, { backgroundColor: '#7F00FF', bottom: 200, right: -100 }]} />

            <View style={[styles.sessionHeader, { paddingTop: insets.top + 20 }]}>
                <View><Ionicons name="chevron-down" size={28} color="#FFF" /></View>
                <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>
                <View><Ionicons name="ellipsis-vertical" size={24} color="#FFF" /></View>
            </View>

            {/* Central Stage - Vinyl & Avatars */}
            <View style={styles.stage}>
                {avatars.map((av, i) => {
                    const angle = (i * (360 / avatars.length)) * (Math.PI / 180);
                    const r = 130;
                    const top = height * 0.25 + r * Math.sin(angle);
                    const left = width / 2 - 25 + r * Math.cos(angle);
                    
                    const floatStyle = useAnimatedStyle(() => {
                        const offsets = [float1.value, float2.value, float3.value, float1.value, float2.value];
                        return { transform: [{ translateY: offsets[i % 5] }] };
                    });

                    return (
                        <Animated.View key={i} style={[styles.floatingAvatar, { top, left }, (i === 0 || i === 2) ? animatedPulse : {}, floatStyle]}>
                            <Image source={av} style={styles.floatingImg} />
                            {(i === 0 || i === 2) && <View style={styles.speakingIndicator} />}
                            {(i === 1) && cameraOn && (
                                <View style={styles.miniCameraBadge}>
                                    <Ionicons name="videocam" size={10} color="#FFF" />
                                </View>
                            )}
                        </Animated.View>
                    );
                })}

                <Animated.View style={[styles.recordPlayer, animatedRecord]}>
                    <View style={styles.recordGrooves} />
                    <Image source={albumCover} style={styles.albumArt} />
                    <View style={styles.recordCenterPin} />
                </Animated.View>
            </View>

            {/* Chat Overlay */}
            <Animated.View style={[styles.chatOverlay, animatedChat, { bottom: insets.bottom + 240 }]}>
                <BlurView intensity={90} tint="dark" style={styles.chatContainer}>
                    <ScrollView contentContainerStyle={{ padding: 15 }} showsVerticalScrollIndicator={false}>
                        <Text style={styles.chatMessage}><Text style={styles.chatUser}>Designer: </Text>Let's kick this off! 🚀</Text>
                        <Text style={styles.chatMessage}><Text style={styles.chatUser}>Member 1: </Text>Loving the vibe here.</Text>
                        <Text style={styles.chatMessage}><Text style={styles.chatUser}>Member 2: </Text>Turn it up!! 🎧</Text>
                    </ScrollView>
                    <View style={styles.chatInputRow}>
                        <TextInput style={styles.chatInput} placeholder="Type a message..." placeholderTextColor="#CCC" />
                        <Pressable style={styles.sendBtn}><Ionicons name="send" size={16} color="#FFF" /></Pressable>
                    </View>
                </BlurView>
            </Animated.View>

            <BlurView intensity={80} tint="dark" style={[styles.controlsOverlay, { paddingBottom: insets.bottom + 20 }]}>
                {/* Music Controls */}
                <View style={styles.musicControls}>
                    <Pressable><Ionicons name="play-skip-back" size={32} color="#FFF" /></Pressable>
                    <Pressable onPress={togglePlay} style={styles.playPauseBtn}>
                        <Ionicons name={isPlaying ? "pause" : "play-outline"} size={36} color="#FFF" />
                    </Pressable>
                    <Pressable><Ionicons name="play-skip-forward" size={32} color="#FFF" /></Pressable>
                </View>

                {/* Session Actions */}
                <View style={styles.actionRow}>
                    <Pressable onPress={() => setMicOn(!micOn)} style={[styles.actionBtn, micOn && styles.actionBtnActive]}>
                        <Ionicons name={micOn ? "mic" : "mic-off"} size={24} color={micOn ? "#000" : "#FFF"} />
                    </Pressable>
                    <Pressable onPress={() => setCameraOn(!cameraOn)} style={[styles.actionBtn, cameraOn && styles.actionBtnActive]}>
                        <Ionicons name={cameraOn ? "videocam" : "videocam-off"} size={24} color={cameraOn ? "#000" : "#FFF"} />
                    </Pressable>
                    <Pressable onPress={() => setChatOpen(!chatOpen)} style={[styles.actionBtn, chatOpen && styles.actionBtnActive]}>
                        <Ionicons name={chatOpen ? "chatbubble" : "chatbubble-outline"} size={24} color={chatOpen ? "#000" : "#FFF"} />
                    </Pressable>
                    <Pressable style={styles.actionBtn}>
                        <Ionicons name="share-outline" size={24} color="#FFF" />
                    </Pressable>
                </View>

                <Pressable style={styles.endBtn} onPress={onEnd}>
                    <Ionicons name="call" size={20} color="#FFF" />
                    <Text style={styles.endBtnText}>End Session</Text>
                </Pressable>
            </BlurView>

        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  screen: { flex: 1 },
  blob: { position: 'absolute', opacity: 0.8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  iconBtn: { padding: 5, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20 },
  heroCenter: { alignItems: 'center', marginTop: 40 },
  groupIconContainer: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', position: 'relative'},
  pencilBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: 20 },
  input: { fontSize: 16, marginRight: 10 },
  subtext: { fontSize: 12, color: '#555', marginTop: 5 },
  bottomSheet: { flex: 1, backgroundColor: '#FFF', marginTop: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, elevation: 10 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 24, fontWeight: '700' },
  badge: { backgroundColor: '#A4C6FF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15, marginLeft: 10 },
  badgeText: { fontSize: 16, fontWeight: '600', color: '#0047A5' },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginVertical: 10, alignSelf:'flex-start' },
  adminRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, alignSelf:'flex-start' },
  avatarWrapper: { borderRadius: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  adminRing: { width: 60, height: 60, borderWidth: 2, borderColor: '#A4C6FF', padding: 2 },
  memberRing: { width: 66, height: 66, borderWidth: 1, borderColor: '#A4C6FF', padding: 2 },
  avatarImg: { width: '100%', height: '100%', borderRadius: 30 },
  adminName: { fontSize: 16, fontWeight: '600' },
  adminRole: { fontSize: 12, color: '#555' },
  membersList: { flexDirection: 'row', marginVertical: 10 },
  memberItem: { marginRight: 15, position: 'relative' },
  removeBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FFF', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  addBtn: { width: 66, height: 66, borderRadius: 33, borderWidth: 1, borderColor: '#A4C6FF', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  createBtn: { backgroundColor: '#BDD8FF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: 30, marginTop: 30 },
  createBtnText: { fontSize: 18, fontWeight: '500', marginRight: 10 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF', paddingTop: 15, borderTopWidth: 1, borderColor: '#EEE' },
  
  sessionContainer: { flex: 1, backgroundColor: '#000' },
  glowBlob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.3 },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', zIndex: 10 },
  liveBadge: { backgroundColor: '#FF3B30', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  liveText: { color: '#FFF', fontWeight: 'bold' },
  stage: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  recordPlayer: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', elevation: 20 },
  recordGrooves: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: '#333' },
  albumArt: { width: 70, height: 70, borderRadius: 35 },
  recordCenterPin: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#000' },
  floatingAvatar: { position: 'absolute', width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#FFF', zIndex: 5 },
  floatingImg: { width: '100%', height: '100%', borderRadius: 25 },
  speakingIndicator: { position: 'absolute', bottom: -5, right: -5, width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#34C759', borderWidth: 2, borderColor: '#000' },
  controlsOverlay: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 20, paddingTop: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  musicControls: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 20 },
  playPauseBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  actionBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  actionBtnActive: { backgroundColor: '#FFF' },
  endBtn: { backgroundColor: '#FF3B30', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 30 },
  endBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  chatOverlay: { position: 'absolute', left: 20, right: 20, zIndex: 50, borderRadius: 20, overflow: 'hidden' },
  chatContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  chatMessage: { color: '#FFF', fontSize: 14, marginBottom: 8 },
  chatUser: { fontWeight: 'bold', color: '#BDD8FF' },
  chatInputRow: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  chatInput: { flex: 1, color: '#FFF', paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, marginRight: 10 },
  sendBtn: { padding: 10, backgroundColor: '#7F00FF', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  miniCameraBadge: { position: 'absolute', bottom: -5, left: -5, width: 18, height: 18, borderRadius: 9, backgroundColor: '#FF3B30', borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center', zIndex: 10 }
});
