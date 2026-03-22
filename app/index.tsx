import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StatusBar as RNStatusBar,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInRight,
    ZoomIn,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
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

// Filter tabs
const FILTER_TABS = ['All Rooms', 'My Groups', 'Favourites', 'Nearby Rooms'];

// Room data
const ROOMS_DATA = [
    {
        id: '1',
        name: 'Chill Vibes Room',
        avatar: 'AM',
        genres: ['Lo-Fi', 'Jazz'],
        code: 'MM#1234',
        isLive: true,
        currentSong: 'Midnight Bloom - Hania Rani',
        currentMembers: 18,
        maxMembers: 30,
        isStarred: false,
    },
    {
        id: '2',
        name: 'Chill Vibes Room',
        avatar: 'AM',
        genres: ['Lo-Fi', 'Jazz'],
        code: 'MM#1234',
        isLive: false,
        currentSong: 'Midnight Bloom - Hania Rani',
        currentMembers: 0,
        maxMembers: 30,
        isStarred: true,
    },
    {
        id: '3',
        name: 'Chill Vibes Room',
        avatar: 'AM',
        genres: ['Lo-Fi', 'Jazz'],
        code: 'MM#1234',
        isLive: false,
        currentSong: 'Midnight Bloom - Hania Rani',
        currentMembers: 0,
        maxMembers: 30,
        isStarred: true,
    },
    {
        id: '4',
        name: 'Chill Vibes Room',
        avatar: 'AM',
        genres: ['Lo-Fi', 'Jazz'],
        code: 'MM#1234',
        isLive: false,
        currentSong: 'Midnight Bloom - Hania Rani',
        currentMembers: 0,
        maxMembers: 30,
        isStarred: true,
    },
];

type ScreenType = 'dashboard' | 'search' | 'create' | 'session' | 'notifications' | 'invite' | 'participants';

// ─── APP ENTRY ────────────────────────────────────────────────────────────────
export default function App() {
    const [screen, setScreen] = useState<ScreenType>('dashboard');
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <RNStatusBar barStyle={screen === 'session' ? 'light-content' : 'dark-content'} />
            {screen === 'dashboard' && (
                <DashboardScreen
                    onCreateRoom={() => setScreen('create')}
                    onJoinRoom={() => setScreen('session')}
                    onOpenNotifications={() => setScreen('notifications')}
                    onSearchTap={() => setScreen('search')}
                    insets={insets}
                />
            )}
            {screen === 'search' && (
                <SearchRoomsScreen
                    onBack={() => setScreen('dashboard')}
                    onJoinRoom={() => setScreen('session')}
                    insets={insets}
                />
            )}
            {screen === 'create' && (
                <CreateRoomScreen
                    onStart={() => setScreen('session')}
                    onBack={() => setScreen('dashboard')}
                    insets={insets}
                />
            )}
            {screen === 'session' && (
                <ActiveSessionScreen
                    onEnd={() => setScreen('dashboard')}
                    onInvite={() => setScreen('invite')}
                    onParticipants={() => setScreen('participants')}
                    insets={insets}
                />
            )}
            {screen === 'participants' && (
                <ParticipantsScreen
                    onBack={() => setScreen('session')}
                    insets={insets}
                />
            )}
            {screen === 'notifications' && (
                <NotificationsScreen
                    onBack={() => setScreen('dashboard')}
                    insets={insets}
                />
            )}
            {screen === 'invite' && (
                <InviteParticipantsScreen
                    onClose={() => setScreen('session')}
                    insets={insets}
                />
            )}

        </View>
    );
}
// ─── DASHBOARD SCREEN ─────────────────────────────────────────────────────────
function DashboardScreen({ onCreateRoom, onJoinRoom, onOpenNotifications, onSearchTap, insets }: any) {
    const [activeTab, setActiveTab] = useState(0);
    const [searchText, setSearchText] = useState('');
    const liveCount = ROOMS_DATA.filter(r => r.isLive).length;

    // Animated dot pulse for "Live"
    const livePulse = useSharedValue(1);
    useEffect(() => {
        livePulse.value = withRepeat(
            withSequence(
                withTiming(1.4, { duration: 600, easing: Easing.ease }),
                withTiming(1, { duration: 600, easing: Easing.ease })
            ),
            -1,
            false
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const livePulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: livePulse.value }],
        opacity: interpolate(livePulse.value, [1, 1.4], [1, 0.5]),
    }));

    return (
        <View style={[styles.screen, { backgroundColor: '#F5F5FA' }]}>
            {/* ── Header ── */}
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                style={[styles.dashHeader, { paddingTop: insets.top + 10 }]}
            >
                <Pressable style={styles.dashHeaderBtn}>
                    <Feather name="menu" size={24} color="#222" />
                </Pressable>
                <View style={styles.dashHeaderCenter}>
                    <Text style={styles.dashTitle}>Group Connect</Text>
                    <Text style={styles.dashSubtitle}>Shared listening space</Text>
                </View>
                <View style={styles.dashHeaderRight}>
                    <Pressable style={styles.dashHeaderBtn} onPress={onOpenNotifications}>
                        <Ionicons name="notifications-outline" size={24} color="#222" />
                    </Pressable>
                    <Pressable style={[styles.dashHeaderBtn, { marginLeft: 6 }]}>
                        <Ionicons name="ellipsis-vertical" size={22} color="#222" />
                    </Pressable>
                </View>
            </Animated.View>

            {/* ── Search Bar ── */}
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 10 }} />
                <Pressable onPress={onSearchTap} style={{ flex: 1, paddingVertical: 12 }}>
                    <Text style={{ fontSize: 15, color: '#AAA' }}>Search rooms...</Text>
                </Pressable>
                <Pressable>
                    <Ionicons name="mic-outline" size={22} color="#6C47FF" />
                </Pressable>
            </Animated.View>

            {/* ── Filter Tabs ── */}
            <Animated.View entering={FadeInDown.delay(250).springify()}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsScroll}
                    contentContainerStyle={styles.tabsContent}
                >
                    {FILTER_TABS.map((tab, idx) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(idx)}
                            style={[
                                styles.filterTab,
                                activeTab === idx && styles.filterTabActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterTabText,
                                    activeTab === idx && styles.filterTabTextActive,
                                ]}
                            >
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* ── Live Counter ── */}
            <Animated.View entering={FadeIn.delay(350)} style={styles.liveCounterRow}>
                <Animated.View style={[styles.liveDot, livePulseStyle]} />
                <Text style={[styles.liveCounterText, { fontWeight: '600', color: '#4CAF50' }]}>
                    Rooms you loved - quick rejoin when they go live
                </Text>
            </Animated.View>

            {/* ── Room Cards List ── */}
            <FlatList
                data={ROOMS_DATA}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.roomListContent}
                renderItem={({ item, index }) => (
                    <RoomCard room={item} index={index} onJoin={onJoinRoom} />
                )}
            />

            {/* ── Bottom Action Buttons ── */}
            <Animated.View
                entering={FadeInUp.delay(500).springify()}
                style={[styles.bottomActions, { paddingBottom: 10 }]}
            >
                <Pressable style={styles.joinRoomBtn} onPress={onJoinRoom}>
                    <View style={styles.joinRoomIcon}>
                        <Feather name="log-in" size={20} color="#6C47FF" />
                    </View>
                    <View>
                        <Text style={styles.joinRoomLabel}>JOIN ROOM</Text>
                        <Text style={styles.joinRoomSub}>CODE or QR</Text>
                    </View>
                </Pressable>
                <Pressable style={styles.createRoomBtn} onPress={onCreateRoom}>
                    <View style={styles.createRoomIcon}>
                        <Feather name="plus" size={20} color="#FFF" />
                    </View>
                    <View>
                        <Text style={styles.createRoomLabel}>CREATE ROOM</Text>
                        <Text style={styles.createRoomSub}>Start a new Room</Text>
                    </View>
                </Pressable>
            </Animated.View>

            {/* ── Bottom Navigation ── */}
            <Animated.View
                entering={FadeInUp.delay(400).springify()}
                style={[styles.bottomNav, { paddingBottom: insets.bottom || 16 }]}
            >
                <Pressable style={styles.navItem}>
                    <Ionicons name="home" size={26} color="#6C47FF" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="people-outline" size={26} color="#999" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="globe-outline" size={26} color="#999" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="link-outline" size={26} color="#999" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="person-outline" size={26} color="#999" />
                </Pressable>
            </Animated.View>

        </View>
    );
}
// ─── ROOM CARD COMPONENT ──────────────────────────────────────────────────────
function RoomCard({ room, index, onJoin }: any) {
    return (
        <Animated.View
            entering={SlideInRight.delay(300 + index * 120)
                .springify()
                .damping(18)}
        >
            <LinearGradient
                colors={['#8B5CF6', '#6C47FF', '#7C5CFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.roomCard}
            >
                {/* Top Row */}
                <View style={styles.roomTopRow}>
                    <View style={styles.roomAvatarCircle}>
                        <Text style={styles.roomAvatarText}>{room.avatar}</Text>
                    </View>
                    <View style={styles.roomInfo}>
                        <Text style={styles.roomName}>{room.name}</Text>
                        <View style={styles.roomTagsRow}>
                            <View style={styles.roomGenreDot} />
                            {room.genres.map((g: string, i: number) => (
                                <Text key={g} style={styles.roomGenreText}>
                                    {g}
                                    {i < room.genres.length - 1 ? ' • ' : ''}
                                </Text>
                            ))}
                            <Text style={styles.roomCode}> •{room.code}</Text>
                        </View>
                    </View>
                    {room.isLive ? (
                        <View style={styles.roomLiveBadge}>
                            <View style={styles.roomLiveDot} />
                            <Text style={styles.roomLiveText}>LIVE</Text>
                        </View>
                    ) : (room.isStarred && (
                        <Ionicons name="star" size={24} color="#FFD700" style={{ marginLeft: 'auto' }} />
                    ))}
                </View>

                {/* Song Row */}
                <View style={[styles.songRow, !room.isLive && { opacity: 0.2 }]}>
                    <View style={styles.eqBars}>
                        {[0, 1, 2, 3].map((b) => (
                            <AnimatedEQBar key={b} barIndex={b} />
                        ))}
                    </View>
                    <Text style={styles.songText} numberOfLines={1}>
                        {room.currentSong}
                    </Text>
                </View>

                {/* Bottom Row */}
                {room.isLive ? (
                    <View style={styles.roomBottomRow}>
                        <View style={styles.membersRow}>
                            <Ionicons name="headset-outline" size={16} color="#E0D4FF" />
                            <Text style={styles.membersText}>
                                {' '}
                                {room.currentMembers}/
                                <Text style={{ fontWeight: '700' }}>{room.maxMembers}</Text>{' '}
                                members
                            </Text>
                            {/* Small progress bar */}
                            <View style={styles.memberBar}>
                                <View
                                    style={[
                                        styles.memberBarFill,
                                        { width: `${(room.currentMembers / room.maxMembers) * 100}%` },
                                    ]}
                                />
                            </View>
                        </View>
                        <Pressable style={styles.joinBtn} onPress={onJoin}>
                            <Text style={styles.joinBtnText}>Join</Text>
                            <Feather name="arrow-right" size={16} color="#6C47FF" />
                        </Pressable>
                    </View>
                ) : (
                    <View style={[styles.roomBottomRow, { justifyContent: 'flex-start', gap: 10 }]}>
                        <Pressable style={styles.notifyBtn}>
                            <Text style={styles.notifyBtnText}>Notify on Live</Text>
                        </Pressable>
                        <Pressable style={styles.removeBtn}>
                            <Text style={styles.removeBtnText}>Remove</Text>
                        </Pressable>
                    </View>
                )}
            </LinearGradient>
        </Animated.View>
    );
}

// ─── ANIMATED EQ BAR ──────────────────────────────────────────────────────────
function AnimatedEQBar({ barIndex }: { barIndex: number }) {
    const h = useSharedValue(6);

    useEffect(() => {
        const delays = [0, 100, 200, 50];
        h.value = withDelay(
            delays[barIndex % 4],
            withRepeat(
                withSequence(
                    withTiming(16 + Math.random() * 8, { duration: 300 + barIndex * 50 }),
                    withTiming(4 + Math.random() * 4, { duration: 300 + barIndex * 50 })
                ),
                -1,
                true
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        height: h.value,
    }));

    return <Animated.View style={[styles.eqBar, animStyle]} />;
}


// ─── SEARCH ROOMS SCREEN ───────────────────────────────────────────────────────
function SearchRoomsScreen({ onBack, onJoinRoom, insets }: any) {
    const defaultChips = ['Lo-fi', 'Ambient', 'Instrumental', 'Morning', 'Jazz'];
    return (
        <View style={[styles.screen, { backgroundColor: '#F5F5FA' }]}>
            <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.notifHeader, { paddingTop: insets.top + 10, paddingBottom: 10 }]}>
                <Pressable style={styles.notifBackBtn} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.notifTitle}>Search Rooms</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(150).springify()} style={[styles.searchContainer, { marginTop: 0 }]}>
                <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 10 }} />
                <TextInput style={styles.searchInput} placeholder="Search rooms..." placeholderTextColor="#AAA" autoFocus />
                <Pressable>
                    <Ionicons name="mic-outline" size={22} color="#6C47FF" />
                </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).springify()}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 15 }}>
                    <Pressable style={[styles.filterTab, { paddingHorizontal: 10, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' }]}>
                        <Ionicons name="options-outline" size={18} color="#444" />
                    </Pressable>
                    {defaultChips.map(chip => (
                        <Pressable key={chip} style={[styles.filterTab, { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' }]}>
                            <Text style={styles.filterTabText}>{chip}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </Animated.View>

            <FlatList
                data={ROOMS_DATA.filter(r => r.isLive)}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.roomListContent}
                renderItem={({ item, index }) => <RoomCard room={item} index={index} onJoin={onJoinRoom} />}
            />
            
            <Animated.View entering={FadeInUp.delay(300).springify()} style={[styles.bottomNav, { paddingBottom: insets.bottom || 16 }]}>
                <Pressable style={styles.navItem}>
                    <Ionicons name="home" size={26} color="#6C47FF" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="people-outline" size={26} color="#999" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="globe-outline" size={26} color="#999" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="link-outline" size={26} color="#999" />
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Ionicons name="person-outline" size={26} color="#999" />
                </Pressable>
            </Animated.View>
        </View>
    );
}

// ─── PARTICIPANTS SCREEN ─────────────────────────────────────────────────────
function ParticipantsScreen({ onBack, insets }: any) {
    const PARTICIPANTS = [
        { id: '1', name: 'ARIJIT', uid: 'MM-1234', isHost: true },
        { id: '2', name: 'ARIJIT', uid: 'MM-1234', isHost: false },
        { id: '3', name: 'ARIJIT', uid: 'MM-1234', isHost: false },
        { id: '4', name: 'ARIJIT', uid: 'MM-1234', isHost: false },
        { id: '5', name: 'ARIJIT', uid: 'MM-1234', isHost: false },
        { id: '6', name: 'ARIJIT', uid: 'MM-1234', isHost: false },
    ];

    const host = PARTICIPANTS.filter((p) => p.isHost);
    const guests = PARTICIPANTS.filter((p) => !p.isHost);

    return (
        <View style={[styles.screen, { backgroundColor: '#FFF' }]}>
            <View style={[styles.participantsHeader, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={onBack} style={styles.participantsBackBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.participantsTitle}>Participants</Text>
                <Pressable style={styles.participantsShareBtn}>
                    <Ionicons name="arrow-up-circle-outline" size={26} color="#6C47FF" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.participantsContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.participantsSectionTitle}>HOST</Text>
                <View style={styles.participantsCard}>
                    {host.map((item) => (
                        <View key={item.id} style={styles.participantRow}>
                            <View style={styles.participantAvatar}>
                                <Text style={styles.participantAvatarText}>US</Text>
                            </View>
                            <View style={styles.participantInfo}>
                                <Text style={styles.participantName}>{item.name}</Text>
                                <Text style={styles.participantUid}>{item.uid}</Text>
                            </View>
                            <View style={styles.participantHostBadge}>
                                <Text style={styles.participantHostBadgeText}>Host</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.participantsSectionTitle}>GUESTS</Text>
                <View style={[styles.participantsCard, { marginBottom: 120 }]}>
                    {guests.map((item, index) => (
                        <View key={item.id} style={[styles.participantRow, index < guests.length - 1 && styles.participantUserBorder]}>
                            <View style={styles.participantAvatar}>
                                <Text style={styles.participantAvatarText}>US</Text>
                            </View>
                            <View style={styles.participantInfo}>
                                <Text style={styles.participantName}>{item.name}</Text>
                                <Text style={styles.participantUid}>{item.uid}</Text>
                            </View>
                            <Pressable style={styles.participantMoreBtn}>
                                <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
                            </Pressable>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.participantsBottom, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.participantsInviteBtn}>
                    <Ionicons name="arrow-up-circle-outline" size={20} color="#6C47FF" style={{marginRight: 8}} />
                    <Text style={styles.participantsInviteText}>Invite More</Text>
                </Pressable>
            </View>
        </View>
    );
}

// ─── CREATE ROOM SCREEN (existing, updated) ──────────────────────────────────
function CreateRoomScreen({ onStart, onBack, insets }: any) {
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
        transform: [{ rotate: `${blobRotation.value}deg` }, { scale: 1.2 }],
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
            <Animated.View
                style={[
                    styles.blob,
                    {
                        backgroundColor: '#FFED6D',
                        top: 150,
                        right: -50,
                        width: 250,
                        height: 250,
                        borderRadius: 120,
                    },
                    animatedBlobStyle,
                ]}
            />

            {/* Header */}
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                style={[styles.header, { paddingTop: insets.top + 10 }]}
            >
                <Pressable style={styles.iconBtn} onPress={onBack}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Create Room</Text>
                <Pressable style={styles.iconBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#000" />
                </Pressable>
            </Animated.View>

            <Animated.View
                entering={ZoomIn.delay(200).springify()}
                style={styles.heroCenter}
            >
                <View style={styles.groupIconContainer}>
                    <Ionicons name="people-outline" size={50} color="#000" />
                    <View style={styles.pencilBadge}>
                        <Feather name="edit-2" size={14} color="#000" />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Group name"
                        style={styles.input}
                        placeholderTextColor="#888"
                    />
                    <Feather name="edit-2" size={16} color="#888" />
                </View>
                <Text style={styles.subtext}>
                    Provide a group subject{' '}
                    <Text style={{ fontWeight: 'bold', color: '#555' }}>
                        and optional group
                    </Text>
                </Text>
                <Text style={styles.subtext}>icon</Text>
            </Animated.View>

            {/* Bottom Sheet */}
            <Animated.View
                entering={FadeInUp.delay(300).springify().damping(18)}
                style={styles.bottomSheet}
            >
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Participants</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>6</Text>
                    </View>
                </View>

                <Text style={styles.sectionLabel}>Group Admin</Text>
                <Animated.View
                    entering={FadeInDown.delay(400).springify()}
                    style={styles.adminRow}
                >
                    <View style={[styles.avatarWrapper, styles.adminRing]}>
                        <Image source={myAvatar} style={styles.avatarImg} />
                    </View>
                    <View>
                        <Text style={styles.adminName}>Designer</Text>
                        <Text style={styles.adminRole}>Group Admin</Text>
                    </View>
                </Animated.View>

                <Text style={styles.sectionLabel}>Invited Members</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.membersList}
                >
                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <Pressable
                            style={[styles.memberItem, styles.addBtn, { marginRight: 15 }]}
                        >
                            <Feather name="plus" size={24} color="#000" />
                        </Pressable>
                    </Animated.View>
                    {avatars.map((av, i) => (
                        <Animated.View
                            entering={FadeInDown.delay(600 + i * 100).springify()}
                            key={i}
                            style={styles.memberItem}
                        >
                            <View style={[styles.avatarWrapper, styles.memberRing]}>
                                <Image source={av} style={styles.avatarImg} />
                            </View>
                            <Pressable style={styles.removeBadge}>
                                <Feather name="x" size={12} color="#000" />
                            </Pressable>
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
            <Animated.View
                entering={FadeInUp.delay(400).springify()}
                style={[styles.bottomNav, { paddingBottom: insets.bottom || 20 }]}
            >
                <Ionicons name="home-outline" size={28} color="#000" />
                <Ionicons name="color-filter-outline" size={28} color="#000" />
                <Ionicons name="globe-outline" size={28} color="#000" />
                <Ionicons name="link-outline" size={28} color="#000" />
                <Ionicons name="person-outline" size={28} color="#000" />
            </Animated.View>

        </View>
    );
}
// ─── ACTIVE SESSION SCREEN (existing) ─────────────────────────────────────────
function ActiveSessionScreen({ onEnd, onInvite, onParticipants, insets }: any) {
    const [showEndModal, setShowEndModal] = useState(false);
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
        float1.value = withRepeat(
            withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        float2.value = withRepeat(
            withTiming(15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        float3.value = withRepeat(
            withTiming(-15, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        chatHeight.value = withSpring(chatOpen ? 250 : 0, {
            damping: 15,
            stiffness: 100,
        
        });
    }, [chatOpen]);

    const animatedRecord = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const animatedPulse = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
    }));

    const animatedChat = useAnimatedStyle(() => ({
        height: chatHeight.value,
        opacity: chatHeight.value > 10 ? 1 : 0,
    }));

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <View style={styles.sessionContainer}>
            <LinearGradient
                colors={['#0F2027', '#203A43', '#2C5364']}
                style={StyleSheet.absoluteFillObject}
            />
            <View
                style={[
                    styles.glowBlob,
                    { backgroundColor: '#E100FF', top: -50, left: -50 },
                ]}
            />
            <View
                style={[
                    styles.glowBlob,
                    { backgroundColor: '#7F00FF', bottom: 200, right: -100 },
                ]}
            />

            <View style={[styles.sessionHeader, { paddingTop: insets.top + 20 }]}>
                <View>
                    <Ionicons name="chevron-down" size={28} color="#FFF" />
                </View>
                <View style={styles.sessionLiveBadge}>
                    <Text style={styles.sessionLiveText}>LIVE</Text>
                </View>
                <View>
                    <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
                </View>
            </View>

            <View style={styles.stage}>
                {avatars.map((av, i) => {
                    const angle = (i * (360 / avatars.length)) * (Math.PI / 180);
                    const r = 130;
                    const top = height * 0.25 + r * Math.sin(angle);
                    const left = width / 2 - 25 + r * Math.cos(angle);

                    const floatStyle = useAnimatedStyle(() => {
                        const offsets = [
                            float1.value,
                            float2.value,
                            float3.value,
                            float1.value,
                            float2.value,
                        ];
                        return { transform: [{ translateY: offsets[i % 5] }] };
                    
                    });
                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.floatingAvatar,
                                { top, left },
                                i === 0 || i === 2 ? animatedPulse : {},
                                floatStyle,
                            ]}
                        >
                            <Image source={av} style={styles.floatingImg} />
                            {(i === 0 || i === 2) && (
                                <View style={styles.speakingIndicator} />
                            )}
                            {i === 1 && cameraOn && (
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

            <Animated.View
                style={[
                    styles.chatOverlay,
                    animatedChat,
                    { bottom: insets.bottom + 240 },
                ]}
            >
                <BlurView intensity={90} tint="dark" style={styles.chatContainer}>
                    <ScrollView
                        contentContainerStyle={{ padding: 15 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.chatMessage}>
                            <Text style={styles.chatUser}>Designer: </Text>
                            Let's kick this off! 🚀
                        </Text>
                        <Text style={styles.chatMessage}>
                            <Text style={styles.chatUser}>Member 1: </Text>
                            Loving the vibe here.
                        </Text>
                        <Text style={styles.chatMessage}>
                            <Text style={styles.chatUser}>Member 2: </Text>
                            Turn it up!! 🎧
                        </Text>
                    </ScrollView>
                    <View style={styles.chatInputRow}>
                        <TextInput
                            style={styles.chatInput}
                            placeholder="Type a message..."
                            placeholderTextColor="#CCC"
                        />
                        <Pressable style={styles.sendBtn}>
                            <Ionicons name="send" size={16} color="#FFF" />
                        </Pressable>
                    </View>
                </BlurView>
            </Animated.View>

            <BlurView
                intensity={80}
                tint="dark"
                style={[
                    styles.controlsOverlay,
                    { paddingBottom: insets.bottom + 20 },
                ]}
            >
                <View style={styles.musicControls}>
                    <Pressable>
                        <Ionicons name="play-skip-back" size={32} color="#FFF" />
                    </Pressable>
                    <Pressable onPress={togglePlay} style={styles.playPauseBtn}>
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play-outline'}
                            size={36}
                            color="#FFF"
                        />
                    </Pressable>
                    <Pressable>
                        <Ionicons name="play-skip-forward" size={32} color="#FFF" />
                    </Pressable>
                </View>

                <View style={styles.actionRow}>
                    <Pressable
                        onPress={() => setMicOn(!micOn)}
                        style={[styles.actionBtn, micOn && styles.actionBtnActive]}
                    >
                        <Ionicons
                            name={micOn ? 'mic' : 'mic-off'}
                            size={24}
                            color={micOn ? '#000' : '#FFF'}
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => setCameraOn(!cameraOn)}
                        style={[styles.actionBtn, cameraOn && styles.actionBtnActive]}
                    >
                        <Ionicons
                            name={cameraOn ? 'videocam' : 'videocam-off'}
                            size={24}
                            color={cameraOn ? '#000' : '#FFF'}
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => setChatOpen(!chatOpen)}
                        style={[styles.actionBtn, chatOpen && styles.actionBtnActive]}
                    >
                        <Ionicons
                            name={chatOpen ? 'chatbubble' : 'chatbubble-outline'}
                            size={24}
                            color={chatOpen ? '#000' : '#FFF'}
                        />
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={onParticipants}>
                        <Ionicons name="people-outline" size={24} color="#FFF" />
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={onInvite}>
                        <Ionicons name="share-outline" size={24} color="#FFF" />
                    </Pressable>
                </View>

                <Pressable style={styles.endBtn} onPress={() => setShowEndModal(true)}>
                    <Ionicons name="call" size={20} color="#FFF" />
                    <Text style={styles.endBtnText}>End Session</Text>
                </Pressable>
            </BlurView>

            {showEndModal && (
                <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeInDown.duration(300)}
                    style={[StyleSheet.absoluteFillObject, { zIndex: 100 }]}
                >
                    <BlurView intensity={40} tint="dark" style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                        <Animated.View entering={ZoomIn.springify()} style={styles.endModalContainer}>
                            <View style={styles.endModalIconContainer}>
                                <Ionicons name="exit-outline" size={32} color="#6C47FF" />
                            </View>
                            <Text style={styles.endModalTitle}>End Session?</Text>
                            <Text style={styles.endModalDesc}>
                                Closing <Text style={{fontWeight: '700'}}>Midnight Lo-Fi Vol-3</Text> will disconnect all members immediately. This cannot be undone.
                            </Text>

                            <View style={styles.endModalStatsCard}>
                                <View style={styles.endModalStatRow}>
                                    <Text style={styles.endModalStatLabel}>Room</Text>
                                    <Text style={styles.endModalStatValue}>Midnight Lo-Fi Vol-3</Text>
                                </View>
                                <View style={styles.endModalStatRow}>
                                    <Text style={styles.endModalStatLabel}>Members active</Text>
                                    <Text style={styles.endModalStatValue}>6</Text>
                                </View>
                                <View style={[styles.endModalStatRow, { borderBottomWidth: 0, marginBottom: 0 }]}>
                                    <Text style={styles.endModalStatLabel}>Session duration</Text>
                                    <Text style={styles.endModalStatValue}>38 min</Text>
                                </View>
                            </View>

                            <Pressable style={styles.endEveryoneBtn} onPress={onEnd}>
                                <Text style={styles.endEveryoneBtnText}>End Session for Everyone</Text>
                            </Pressable>
                            <Pressable style={styles.leaveRoomBtn} onPress={onEnd}>
                                <Text style={styles.leaveRoomBtnText}>Leave Room(keep Active)</Text>
                            </Pressable>
                            <Pressable style={styles.cancelRoomBtn} onPress={() => setShowEndModal(false)}>
                                <Text style={styles.cancelRoomBtnText}>Cancel</Text>
                            </Pressable>
                        </Animated.View>
                    </BlurView>
                </Animated.View>
            )}
        </View>
    );
}
// ─── INVITE PARTICIPANTS SCREEN ───────────────────────────────────────────────
function InviteParticipantsScreen({ onClose, insets }: any) {
    const PARTICIPANTS = [
        { id: '1', name: 'ankit', uid: 'MM-1234', status: 'Invited' },
        { id: '2', name: 'amit', uid: 'MM-1234', status: 'Invite' },
        { id: '3', name: 'harsha', uid: 'MM-1234', status: 'Invite' },
        { id: '4', name: 'souri', uid: 'MM-1234', status: 'Invited' },
    ];

    return (
        <View style={[styles.screen, { backgroundColor: '#F9FAFB' }]}>
            {/* Top Header */}
            <View style={[styles.inviteHeader, { paddingTop: insets.top + 10 }]}>
                <Pressable style={styles.inviteCloseBtn} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#000" />
                </Pressable>
                <Text style={styles.inviteTitle}>Lo-fi Chill Session</Text>
                <View style={styles.inviteTimeBadge}>
                    <Text style={styles.inviteTimeText}>12:34</Text>
                </View>
            </View>

            {/* Music Card */}
            <View style={styles.inviteMusicCardContainer}>
                <Image source={albumCover} style={styles.inviteMusicBg} />
                <View style={styles.inviteMusicOverlay}>
                    <Text style={styles.inviteMusicTitle}>Midnight Lo-fi Vol.3</Text>
                    <Text style={styles.inviteMusicArtist}>Chillhop Music</Text>
                    
                    <View style={styles.inviteProgressContainer}>
                        <View style={styles.inviteProgressBar}>
                            <View style={[styles.inviteProgressFill, { width: '68%' }]} />
                            <View style={styles.inviteProgressThumb} />
                        </View>
                        <View style={styles.inviteProgressTimes}>
                            <Text style={styles.inviteProgressTime}>7:13</Text>
                            <Text style={styles.inviteProgressTime}>10:43</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bottom Sheet Details */}
            <View style={styles.inviteSheet}>
                <View style={styles.inviteDragIndicator} />
                
                <View style={styles.inviteSheetHeaderRow}>
                    <Text style={styles.inviteSheetTitle}>Invite Participants</Text>
                    <Pressable style={styles.inviteSheetCloseCircle} onPress={onClose}>
                        <Ionicons name="close" size={16} color="#6C47FF" />
                    </Pressable>
                </View>

                {/* Host Card */}
                <View style={styles.inviteHostCard}>
                    <View>
                        <Text style={styles.inviteHostName}>Evening Chill Vibes</Text>
                        <Text style={styles.inviteHostDesc}>1/10 joined</Text>
                    </View>
                    <View style={styles.inviteHostBadge}>
                        <Text style={styles.inviteHostBadgeText}>Host</Text>
                    </View>
                </View>

                {/* Search */}
                <Text style={styles.inviteSearchLabel}>Search by UID</Text>
                <View style={styles.inviteSearchBox}>
                    <TextInput 
                        placeholder="MM-1234" 
                        placeholderTextColor="#999" 
                        style={styles.inviteSearchInput} 
                    />
                </View>

                {/* Participants List */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View style={styles.inviteListContainer}>
                        {PARTICIPANTS.map((p, i) => (
                            <View key={p.id} style={[styles.inviteUserRow, i < PARTICIPANTS.length - 1 && styles.inviteUserBorder]}>
                                <View style={styles.inviteUserAvatar}>
                                    <Text style={styles.inviteUserAvatarText}>US</Text>
                                </View>
                                <View style={styles.inviteUserInfo}>
                                    <Text style={styles.inviteUserName}>{p.name.toUpperCase()}</Text>
                                    <Text style={styles.inviteUserUid}>{p.uid}</Text>
                                </View>
                                <Pressable 
                                    style={[
                                        styles.inviteActionBtn, 
                                        p.status === 'Invited' ? styles.inviteActionBtnActive : styles.inviteActionBtnInactive
                                    ]}
                                >
                                    <Text 
                                        style={[
                                            styles.inviteActionText,
                                            p.status === 'Invited' ? styles.inviteActionTextActive : styles.inviteActionTextInactive
                                        ]}
                                    >
                                        {p.status}
                                    </Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Copy Link Button */}
                <View style={[styles.inviteBottomBtnContainer, { paddingBottom: insets.bottom + 20 }]}>
                    <Pressable style={styles.inviteCopyBtn}>
                        <Ionicons name="link-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.inviteCopyText}>Copy Link</Text>
                    </Pressable>
                </View>
            </View>

        </View>
    );
}
// ─── NOTIFICATIONS SCREEN ─────────────────────────────────────────────────────
function NotificationsScreen({ onBack, insets }: any) {
    const NOTIFICATIONS = [
        {
            section: 'TODAY',
            data: [
                {
                    id: '1',
                    title: 'Lo-fi chill Session is live',
                    desc: 'Your favourite room hosted by MM-1234 just went live',
                    time: '2 min ago',
                    icon: 'musical-notes-outline',
                },
                {
                    id: '2',
                    title: 'MM-2026 joined your room',
                    desc: 'Late Night Jazz • Now 3 participants',
                    time: '18 min ago',
                    icon: 'person-outline',
                },
                {
                    id: '3',
                    title: 'Room invite received',
                    desc: 'MM-2026 invited you to Rock Classics Night',
                    time: '18 min ago',
                    icon: 'link-outline',
                },
            ],
        },
        {
            section: 'YESTERDAY',
            data: [
                {
                    id: '4',
                    title: 'Room auto-closed',
                    desc: 'Late Night Jazz closed due to inactivity',
                    time: '11:40 PM',
                    icon: 'information-circle-outline',
                },
                {
                    id: '5',
                    title: 'Security Alert',
                    desc: 'New device login detected on yo account',
                    time: '6:22 PM',
                    icon: 'lock-closed-outline',
                },
            ],
        },
    ];

    return (
        <View style={[styles.screen, { backgroundColor: '#FCFCFF' }]}>
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                style={[styles.notifHeader, { paddingTop: insets.top + 10 }]}
            >
                <Pressable style={styles.notifBackBtn} onPress={onBack}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.notifTitle}>Notifications</Text>
                <Pressable style={styles.notifClearBtn}>
                    <Text style={styles.notifClearText}>Clear All</Text>
                </Pressable>
            </Animated.View>

            <ScrollView contentContainerStyle={styles.notifScrollContent} showsVerticalScrollIndicator={false}>
                {NOTIFICATIONS.map((section, sIdx) => (
                    <Animated.View key={section.section} entering={FadeInUp.delay(200 + sIdx * 100).springify()}>
                        <Text style={styles.notifSectionTitle}>{section.section}</Text>
                        <View style={styles.notifCard}>
                            {section.data.map((item, iIdx) => (
                                <View
                                    key={item.id}
                                    style={[
                                        styles.notifItem,
                                        iIdx < section.data.length - 1 && styles.notifItemBorder,
                                    ]}
                                >
                                    <View style={styles.notifIconCircle}>
                                        <Ionicons name={item.icon as any} size={22} color="#6C47FF" />
                                    </View>
                                    <View style={styles.notifItemContent}>
                                        <Text style={styles.notifItemTitle}>{item.title}</Text>
                                        <Text style={styles.notifItemDesc}>{item.desc}</Text>
                                    </View>
                                    <Text style={styles.notifItemTime}>{item.time}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>

        </View>
    );
}
// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    screen: { flex: 1 },

    // ── Dashboard ──
    dashHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#FFF',
    },
    dashHeaderBtn: {
        padding: 6,
        borderRadius: 20,
    },
    dashHeaderCenter: { flex: 1, marginLeft: 12 },
    dashTitle: { fontSize: 22, fontWeight: '800', color: '#111', letterSpacing: -0.3 },
    dashSubtitle: { fontSize: 12, color: '#888', marginTop: 1 },
    dashHeaderRight: { flexDirection: 'row', alignItems: 'center' },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginTop: 6,
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#E8E8EE',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },

    // Filter Tabs
    tabsScroll: { maxHeight: 44, marginBottom: 4 },
    tabsContent: { paddingHorizontal: 20 },
    filterTab: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#F0F0F5',
    },
    filterTabActive: {
        backgroundColor: '#6C47FF',
    },
    filterTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    filterTabTextActive: {
        color: '#FFF',
    },

    // Live Counter
    liveCounterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 10,
        marginBottom: 6,
    },
    liveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#22C55E',
        marginRight: 8,
    },
    liveCounterText: {
        fontSize: 14,
        color: '#444',
    },

    // Room card list
    roomListContent: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        paddingTop: 6,
    },

    // Room Card
    roomCard: {
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,
        elevation: 6,
        shadowColor: '#6C47FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    roomTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomAvatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    roomAvatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    roomInfo: { flex: 1 },
    roomName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: -0.2,
    },
    roomTagsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
    roomGenreDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
        marginRight: 6,
    },
    roomGenreText: { fontSize: 12, color: '#E0D4FF' },
    roomCode: { fontSize: 12, color: '#C4B5FD' },
    roomLiveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    roomLiveDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#22C55E',
        marginRight: 6,
    },
    roomLiveText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: 0.5,
    },

    // Song row
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginTop: 14,
    },
    eqBars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 10,
        height: 20,
    },
    eqBar: {
        width: 3,
        borderRadius: 2,
        backgroundColor: '#FFF',
        marginHorizontal: 1.5,
        minHeight: 4,
    },
    songText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '500',
        flex: 1,
    },

    // Room bottom row
    roomBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
    },
    membersRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    membersText: { fontSize: 12, color: '#E0D4FF', marginLeft: 2 },
    memberBar: {
        width: 50,
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginLeft: 10,
        overflow: 'hidden',
    },
    memberBarFill: {
        height: 3,
        borderRadius: 2,
        backgroundColor: '#22C55E',
    },
    joinBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
    },
    joinBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6C47FF',
        marginRight: 4,
    },

    // Bottom Actions
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#F5F5FA',
        gap: 12,
    },
    joinRoomBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#E8E8EE',
    },
    joinRoomIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0EAFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    joinRoomLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#222',
        letterSpacing: 0.3,
    },
    joinRoomSub: {
        fontSize: 10,
        color: '#888',
        marginTop: 1,
    },
    createRoomBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6C47FF',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        elevation: 3,
        shadowColor: '#6C47FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    createRoomIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    createRoomLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 0.3,
    },
    createRoomSub: {
        fontSize: 10,
        color: '#D4C5FF',
        marginTop: 1,
    },

    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: '#ECECF0',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },

    // ── Create Room Screen ──
    blob: { position: 'absolute', opacity: 0.8 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: '600' },
    iconBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 20,
    },
    heroCenter: { alignItems: 'center', marginTop: 40 },
    groupIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'relative',
    },
    pencilBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 20,
    },
    input: { fontSize: 16, marginRight: 10 },
    subtext: { fontSize: 12, color: '#555', marginTop: 5 },
    bottomSheet: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        elevation: 10,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sheetTitle: { fontSize: 24, fontWeight: '700' },
    badge: {
        backgroundColor: '#A4C6FF',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
        marginLeft: 10,
    },
    badgeText: { fontSize: 16, fontWeight: '600', color: '#0047A5' },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginVertical: 10,
        alignSelf: 'flex-start',
    },
    adminRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    avatarWrapper: {
        borderRadius: 40,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminRing: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#A4C6FF',
        padding: 2,
    },
    memberRing: {
        width: 66,
        height: 66,
        borderWidth: 1,
        borderColor: '#A4C6FF',
        padding: 2,
    },
    avatarImg: { width: '100%', height: '100%', borderRadius: 30 },
    adminName: { fontSize: 16, fontWeight: '600' },
    adminRole: { fontSize: 12, color: '#555' },
    membersList: { flexDirection: 'row', marginVertical: 10 },
    memberItem: { marginRight: 15, position: 'relative' },
    removeBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FFF',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    addBtn: {
        width: 66,
        height: 66,
        borderRadius: 33,
        borderWidth: 1,
        borderColor: '#A4C6FF',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createBtn: {
        backgroundColor: '#BDD8FF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 30,
        marginTop: 30,
    },
    createBtnText: { fontSize: 18, fontWeight: '500', marginRight: 10 },

    // ── Active Session Screen ──
    sessionContainer: { flex: 1, backgroundColor: '#000' },
    glowBlob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.3,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        zIndex: 10,
    },
    sessionLiveBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    sessionLiveText: { color: '#FFF', fontWeight: 'bold' },
    stage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    recordPlayer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 20,
    },
    recordGrooves: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: '#333',
    },
    albumArt: { width: 70, height: 70, borderRadius: 35 },
    recordCenterPin: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
    floatingAvatar: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFF',
        zIndex: 5,
    },
    floatingImg: { width: '100%', height: '100%', borderRadius: 25 },
    speakingIndicator: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#34C759',
        borderWidth: 2,
        borderColor: '#000',
    },
    controlsOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    musicControls: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20,
    },
    playPauseBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    actionBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtnActive: { backgroundColor: '#FFF' },
    endBtn: {
        backgroundColor: '#FF3B30',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 30,
    },
    endBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    chatOverlay: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 50,
        borderRadius: 20,
        overflow: 'hidden',
    },
    chatContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    chatMessage: { color: '#FFF', fontSize: 14, marginBottom: 8 },
    chatUser: { fontWeight: 'bold', color: '#BDD8FF' },
    chatInputRow: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    chatInput: {
        flex: 1,
        color: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        marginRight: 10,
    },
    sendBtn: {
        padding: 10,
        backgroundColor: '#7F00FF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniCameraBadge: {
        position: 'absolute',
        bottom: -5,
        left: -5,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#FF3B30',
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    // ── Notifications Screen ──
    notifHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#FCFCFF',
    },
    notifBackBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F5',
    },
    notifTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        marginLeft: 16,
    },
    notifClearBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F7F4FF',
        borderWidth: 1,
        borderColor: '#E8DFFF',
    },
    notifClearText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6C47FF',
    },
    notifScrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        backgroundColor: '#FCFCFF',
    },
    notifSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginTop: 24,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    notifCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F5',
    },
    notifItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    notifItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5FA',
    },
    notifIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F7F4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#F0EAFF',
    },
    notifItemContent: {
        flex: 1,
        marginRight: 10,
        marginTop: 2,
    },
    notifItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    notifItemDesc: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    notifItemTime: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },

    // ── Invite Participants Screen ──
    inviteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#F9FAFB',
    },
    inviteCloseBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    inviteTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    inviteTimeBadge: {
        backgroundColor: '#BDD8FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    inviteTimeText: {
        color: '#0047A5',
        fontSize: 14,
        fontWeight: '600',
    },
    inviteMusicCardContainer: {
        marginHorizontal: 20,
        marginTop: 10,
        height: 120,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    inviteMusicBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    inviteMusicOverlay: {
        flex: 1,
        backgroundColor: 'rgba(50, 50, 100, 0.4)',
        padding: 16,
        justifyContent: 'flex-end',
    },
    inviteMusicTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    inviteMusicArtist: {
        color: '#E0D4FF',
        fontSize: 14,
        marginBottom: 8,
    },
    inviteProgressContainer: {
        marginTop: 4,
    },
    inviteProgressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        position: 'relative',
    },
    inviteProgressFill: {
        height: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 2,
    },
    inviteProgressThumb: {
        position: 'absolute',
        top: -4,
        left: '68%',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A90E2',
    },
    inviteProgressTimes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    inviteProgressTime: {
        color: '#FFF',
        fontSize: 12,
    },
    inviteSheet: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: -10, // overlap a bit
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 12,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    inviteDragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 16,
    },
    inviteSheetHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    inviteSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    inviteSheetCloseCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F3F0FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteHostCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F7F4FF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E8DFFF',
        marginBottom: 20,
    },
    inviteHostName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6C47FF',
        marginBottom: 4,
    },
    inviteHostDesc: {
        fontSize: 12,
        color: '#A78BFA',
    },
    inviteHostBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8DFFF',
    },
    inviteHostBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6C47FF',
    },
    inviteSearchLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    inviteSearchBox: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    inviteSearchInput: {
        fontSize: 15,
        color: '#000',
    },
    inviteListContainer: {
        backgroundColor: '#FCFCFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F5',
    },
    inviteUserRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    inviteUserBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F5',
    },
    inviteUserAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    inviteUserAvatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    inviteUserInfo: {
        flex: 1,
    },
    inviteUserName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    inviteUserUid: {
        fontSize: 13,
        color: '#888',
    },
    inviteActionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    inviteActionBtnInactive: {
        backgroundColor: '#F3F0FF',
    },
    inviteActionBtnActive: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    inviteActionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    inviteActionTextInactive: {
        color: '#6C47FF',
    },
    inviteActionTextActive: {
        color: '#10B981',
    },
    inviteBottomBtnContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    inviteCopyBtn: {
        flexDirection: 'row',
        backgroundColor: '#5D45D6',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 30,
    },
    inviteCopyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },

    // New additions
    offlineActionsRow: {
        flexDirection: 'row',
        marginTop: 14,
        gap: 10,
    },
    notifyBtn: {
        backgroundColor: '#D1C4E9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
    },
    notifyBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6C47FF',
    },
    removeBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
    },
    removeBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFF',
    },
    endModalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    endModalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    endModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 8,
    },
    endModalDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    endModalStatsCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    endModalStatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        marginBottom: 4,
    },
    endModalStatLabel: {
        fontSize: 13,
        color: '#666',
    },
    endModalStatValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
    },
    endEveryoneBtn: {
        width: '100%',
        backgroundColor: '#FF3B30',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 12,
    },
    endEveryoneBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    leaveRoomBtn: {
        width: '100%',
        backgroundColor: '#F3F0FF',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 12,
    },
    leaveRoomBtnText: {
        color: '#6C47FF',
        fontSize: 15,
        fontWeight: '600',
    },
    cancelRoomBtn: {
        width: '100%',
        backgroundColor: '#F7F7F7',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    cancelRoomBtnText: {
        color: '#111',
        fontSize: 15,
        fontWeight: '600',
    },
    participantsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    participantsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    participantsBackBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    participantsShareBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: '#F3F0FF',
    },
    participantsContent: {
        paddingHorizontal: 20,
    },
    participantsSectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
        marginTop: 20,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    participantsCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 1,
    },
    participantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    participantUserBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F5',
    },
    participantAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    participantAvatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111',
    },
    participantInfo: {
        flex: 1,
    },
    participantName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 2,
    },
    participantUid: {
        fontSize: 13,
        color: '#888',
    },
    participantHostBadge: {
        backgroundColor: '#F3F0FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    participantHostBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6C47FF',
    },
    participantMoreBtn: {
        padding: 8,
    },
    participantsBottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderColor: '#F0F0F5',
    },
    participantsInviteBtn: {
        flexDirection: 'row',
        backgroundColor: '#EAE6FF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 30,
    },
    participantsInviteText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6C47FF',
    },
});