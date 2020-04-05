<template>
    <Page class="page">

        <ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer()">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <TextField placeholderColor="white" id="searchField"
                        editable="true" hint="      Search" returnKeyType="search"
                        ios:height="30" ios:marginTop="3"
                        android:paddingBottom="5" class="searchField font-awesome"
                        color="#fff" />
                </StackLayout>
                <StackLayout class="HRight">
                    <Label text="+" style="font-size:40;color:#fff;" paddingLeft="15%"
                        class="font-awesome" />
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened()"
            @drawerClosed="onDrawerClosed()">
                      <StackLayout ~drawerContent backgroundColor="#eee">
                <StackLayout height="2%"></StackLayout>
                <StackLayout class="">
                    <StackLayout class = "prof" @tap="profileTap()">
                    <Label text="  Profile" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "notif" @tap="notificationTap()">
                    <Label text="  Notifications" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "settings" @tap="settingsTap()">
                    <Label text="  Settings" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "help" @tap="helpTap()">
                    <Label text="  Help" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "logout" @tap="logOut()">
                    <Label text="  Log out" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                </StackLayout>
            </StackLayout>

            <StackLayout ~mainContent>

                <DockLayout>

                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <ListView for="item in posts" :key="index" height="100%"
                            backgroundColor="#E8E8E8" separatorColor="transparent"
                            id="listView">
                            <v-template>

                            <StackLayout paddingTop="5" backgroundColor="#E8E8E8">
                                    <StackLayout class="postContainer">
                                        <StackLayout orientation="horizontal"
                                            padding="10">
                                            <Image :src="item.authorImg"
                                                stretch="aspectFill" class="postImageSmall" />
                                            <StackLayout>
                                                <Label :text="item.autorName"
                                                    class="postAuthotName" />
                                                <Label :text="item.date"
                                                    class="postDateSmall" />
                                                <Label :text="item.categories"
                                                    class="postDateSmall" />
                                            </StackLayout>
                                        </StackLayout>
                                        <Label marginLeft="10" marginRight="10"
                                            class="postTitle" :text="item.title" />
                                        <Image :src="item.postImg" marginTop="10" />
                                        <StackLayout orientation="horizontal"
                                            padding="10" marginLeft="10%">
                                            <Label text=" " style="font-size:18;margin-top:-1;"
                                                :color="item.color" class="font-awesome" />
                                            <Label :text="item.likes" style="font-size:12;color:#1aa3ff;" />
                                            <Label text=" " style="font-size:19;margin-left:23%;margin-top:-3;color:#747474;"
                                                class="font-awesome" />
                                            <Label :text="item.comments"
                                                style="font-size:12;color:#1aa3ff;" />
                                            <Label text=" " style="font-size:22;margin-left:23%;margin-top:-1;color:#747474;"
                                                class="font-awesome" />
                                            <Label :text="item.reposts" style="font-size:12;color:#1aa3ff;" />
                                        </StackLayout>
                                    </StackLayout>
                                </StackLayout>

                            </v-template>
                        </ListView>

                    </StackLayout>


                    <StackLayout dock="bottom" height="10%" style="border-color:#E4E4E4;border-width:1;background:#fff;">
                        <StackLayout orientation="horizontal">
                            <StackLayout class="navItem" @tap="homeTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="competitionTap()">
                                <Label text="0" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text=" " android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="communityTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" :color="mainColor"
                                    android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="chatTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                        </StackLayout>
                    </StackLayout>

                </DockLayout>

            </StackLayout>
        </RadSideDrawer>

    </page>
</template>

<script>
    import Home from "./Home";
    import Chat from "./Chat";
    import Competitions from "./Competitions"
    import Profile from "./Profile";
    import Notifications from "./Notifications";
    import Settings from "./Settings";
    import Help from "./Help";
    import LoginScreen from "./LoginMain";

     export default {
        created() {},
        data() {
            return {
                drawerToggle: false,
                drawer1: "",
                drawer2: "",
                mainColor: "#00ff92",
                posts: [{
                        authorImg: "~/assets/images/Sebastian.jpg",
                        autorName: "Sebastian",
                        color: "#747474",
                        date: "Today at 13:45",
                        title: "Thanks guys! Finally broken it out",
                        postImg: "~/assets/images/Violin.jpg",
                        likes: "30",
                        comments: "14",
                        reposts: "8",
                        categories: "#music #learningviolin"
                    },
                    {
                        authorImg: "~/assets/images/large.jpg",
                        autorName: "Cristine",
                        color: "#E15050",
                        date: "Today at 16:21",
                        title: "What a treat! Super rich 👌",
                        postImg: "~/assets/images/ChocolateTart.jpg",
                        likes: "150",
                        comments: "21",
                        reposts: "11",
                        categories: "#recipes #trysomethingnew"
                    }
                ]
            };
        },
         methods: {
            onDrawerClosed() {
                this.drawerToggle = false;
            },
            onDrawerOpened() {
                this.drawerToggle = true;
            },
            toggleDrawer() {
                this.$refs.drawer.nativeView.toggleDrawerState();
            },
            homeTap() {
                this.$navigateTo(Home, {
                    animated: false,
                    clearHistory: true
                });
            },
            communityTap() {},
            chatTap() {
                this.$navigateTo(Chat, {
                    animated: false,
                    clearHistory: true
                });
            },
            competitionTap() {
                this.$navigateTo(Competitions, {
                    animated: false,
                    clearHistory: true
                });
            },
            profileTap() {
                this.$navigateTo(Profile, {
                    animated: false,
                    clearHistory: true
                });
            },
            notificationTap() {
                this.$navigateTo(Notifications, {
                    animated: false,
                    clearHistory: true
                });
            },
            settingsTap() {
                this.$navigateTo(Settings, {
                    animated: false,
                    clearHistory: true
                });
            },
            helpTap(){
                this.$navigateTo(Help, {
                    animated: false,
                    clearHistory: true
                });
            },
            logOut(){
                this.$navigateTo(LoginScreen, {
                    animated: false,
                    clearHistory: true
                });
            }, //put in here navigate to log-in screen
            showDetails() {}
        }
    };
</script>
<style scoped>
</style>