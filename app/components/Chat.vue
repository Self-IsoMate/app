<template>
  <Page class="page">
    <ActionBar title class="action-bar header">
      <StackLayout
        orientation="horizontal"
        height="38"
        alignItems="left"
        class="actionBarContainer"
      >
        <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer()">
          <Label
            :text="drawerToggle ? drawer2: drawer1"
            style="font-size:27;color:#fff;"
            class="font-awesome"
          />
        </StackLayout>
        <StackLayout class="HMid" alignItems="left">
          <TextField
            placeholderColor="white"
            id="searchField"
            editable="true"
            hint="      Search"
            returnKeyType="search"
            ios:height="30"
            ios:marginTop="3"
            android:paddingBottom="5"
            class="searchField font-awesome"
            color="#fff"
          />
        </StackLayout>
        <StackLayout class="HRight"></StackLayout>
      </StackLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened()" @drawerClosed="onDrawerClosed()">
      <StackLayout ~drawerContent backgroundColor="#eee">
        <StackLayout height="2%"></StackLayout>
        <StackLayout class>
          <StackLayout class="prof" @tap="profileTap()">
            <Label
              text="  Profile"
              paddingLeft="15%"
              color="black"
              class="drawerItemText font-awesome"
              margin="15"
            />
          </StackLayout>
          <StackLayout class="notif" @tap="notificationTap()">
            <Label
              text="  Notifications"
              paddingLeft="15%"
              color="black"
              class="drawerItemText font-awesome"
              margin="15"
            />
          </StackLayout>
          <StackLayout class="settings" @tap="settingsTap()">
            <Label
              text="  Settings"
              paddingLeft="15%"
              color="black"
              class="drawerItemText font-awesome"
              margin="15"
            />
          </StackLayout>
          <StackLayout class="help" @tap="helpTap()">
            <Label
              text="  Help"
              paddingLeft="15%"
              color="black"
              class="drawerItemText font-awesome"
              margin="15"
            />
          </StackLayout>
          <StackLayout class="logout" @tap="logOut()">
            <Label
              text="  Log out"
              paddingLeft="15%"
              color="black"
              class="drawerItemText font-awesome"
              margin="15"
            />
          </StackLayout>
        </StackLayout>
      </StackLayout>

      <StackLayout ~mainContent>
        <DockLayout>
////////////////////////////////////////////////
          <StackLayout dock="top" height="90%" width="100%" style>
            ///////////
            <div>
              <Chat
                :participants="participants"
                :myself="myself"
                :messages="messages"
                :onType="onType"
                :onMessageSubmit="onMessageSubmit"
                :chatTitle="chatTitle"
                :placeholder="placeholder"
                :colors="colors"
                :borderStyle="borderStyle"
                :hideCloseButton="hideCloseButton"
                :closeButtonIconSize="closeButtonIconSize"
                :submitIconSize="submitIconSize"
              />
            </div>
            /////////
            <ListView
              for="item in conversations"
              :key="index"
              height="100%"
              separatorColor="transparent"
              id="listView"
            >
              <v-template>
                <StackLayout
                  orientation="horizontal"
                  style="border-bottom-width:1;border-bottom-color:#E4E4E4;"
                  padding="10"
                >
                  <StackLayout width="20%">
                    <Image :src="item.convFriendImg" stretch="aspectFill" class="conImg" />
                  </StackLayout>
                  <StackLayout marginLeft="10" paddingTop="3" width="50%">
                    <Label :text="item.convFriendName" :class="'convFriendName ' + item.read" />
                    <Label :text="item.convText" :class="'convTextOut ' + item.read" />
                  </StackLayout>
                  <StackLayout marginLeft="10" paddingTop="3" width="60%">
                    <Label :text="item.convDate" :class="'convDateOut ' + item.read" />
                    <Label
                      text=""
                      :visibility="item.seenVisibility"
                      style="font-size:17;text-align:center;margin-top:12;color:#1aa3ff;"
                      class="font-awesome"
                    />
                  </StackLayout>
                </StackLayout>
              </v-template>
            </ListView>
          </StackLayout>
///////////////////////////////////////////////////////////
          <StackLayout
            dock="bottom"
            height="10%"
            style="border-color:#E4E4E4;border-width:1;background:#fff;"
          >
            <StackLayout orientation="horizontal">
              <StackLayout class="navItem" @tap="homeTap()">
                <Label
                  text
                  android:class="notificationAndroid"
                  ios:class="notification"
                  opacity="0"
                />
                <Label
                  text=""
                  android:style="font-size:23;margin-top:-15"
                  ios:style="font-size:29;margin-top:-15"
                  class="font-awesome"
                />
              </StackLayout>
              <StackLayout class="navItem" @tap="competitionTap()">
                <Label
                  text="0"
                  android:class="notificationAndroid"
                  ios:class="notification"
                  opacity="0"
                />
                <Label
                  text=" "
                  android:style="font-size:23;margin-top:-15"
                  ios:style="font-size:29;margin-top:-15"
                  class="font-awesome"
                />
              </StackLayout>
              <StackLayout class="navItem" @tap="communityTap()">
                <Label
                  text
                  android:class="notificationAndroid"
                  ios:class="notification"
                  opacity="0"
                />
                <Label
                  text=""
                  :color="profileColor"
                  android:style="font-size:25;margin-top:-15"
                  ios:style="font-size:30;margin-top:-15"
                  class="font-awesome"
                />
              </StackLayout>
              <StackLayout class="navItem" @tap="chatTap()">
                <Label
                  text
                  android:class="notificationAndroid"
                  ios:class="notification"
                  opacity="0"
                />
                <Label
                  text=""
                  :color="mainColor"
                  android:style="font-size:25;margin-top:-15"
                  ios:style="font-size:30;margin-top:-15"
                  class="font-awesome"
                />
              </StackLayout>
            </StackLayout>
          </StackLayout>
        </DockLayout>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
import Home from "./Home";
import Community from "./Community";
import Competitions from "./Competitions";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Settings from "./Settings";
import Help from "./Help";
/////
import { Chat } from "vue-quick-chat"; ///////

export default {
  ///////
  components: {
    Chat
  }, ////////////
  created() {},
  data() {
    return {
      //////////
      participants: [
        {
          name: "Arnaldo",
          id: 1
        },
        {
          name: "José",
          id: 2
        }
      ],
      myself: {
        name: "Matheus S.",
        id: 3
      },
      messages: [
        {
          content: "received messages",
          myself: false,
          participantId: 1,
          timestamp: {
            year: 2019,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123
          }
        },
        {
          content: "sent messages",
          myself: true,
          participantId: 3,
          timestamp: {
            year: 2019,
            month: 4,
            day: 5,
            hour: 19,
            minute: 10,
            second: 3,
            millisecond: 123
          }
        },
        {
          content: "other received messages",
          myself: false,
          participantId: 2,
          timestamp: {
            year: 2019,
            month: 5,
            day: 5,
            hour: 10,
            minute: 10,
            second: 3,
            millisecond: 123
          }
        }
      ],
      chatTitle: "My chat title",
      placeholder: "send your message",
      colors: {
        header: {
          bg: "#d30303",
          text: "#fff"
        },
        message: {
          myself: {
            bg: "#fff",
            text: "#bdb8b8"
          },
          others: {
            bg: "#fb4141",
            text: "#fff"
          }
        },
        submitIcon: "#b91010"
      },
      borderStyle: {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px"
      },
      hideCloseButton: false,
      submitIconSize: "20px",
      closeButtonIconSize: "20px",
      ///////////

      drawerToggle: false,
      drawer1: "",
      drawer2: "",
      mainColor: "#00ff92",
      conversations: [
        {
          convFriendImg: "~/assets/images/images.jpg",
          read: "notRead",
          convFriendName: "John",
          convText: "ok but why?",
          convDate: "19:01",
          seenVisibility: "collapse"
        },
        {
          convFriendImg: "~/assets/images/large.jpg",
          read: "read",
          convFriendName: "Christine",
          convText: "Okay",
          convDate: "18:43",
          seenVisibility: "collapse"
        },
        {
          convFriendImg: "~/assets/images/download_(1).jpg",
          read: "read",
          convFriendName: "Katty",
          convText: "You: Sorry I Can't",
          convDate: "18:21",
          seenVisibility: "visible"
        }
      ]
    };
  },

  methods: {
      //////
      onType: function (event){
      //here you can set any behavior
    },
    onMessageSubmit: function(message){
      //here you can set any behavior
    },
    ////////
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
    communityTap() {
      this.$navigateTo(Community, {
        animated: false,
        clearHistory: true
      });
    },
    chatTap() {},
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
    helpTap() {
      this.$navigateTo(Help, {
        animated: false,
        clearHistory: true
      });
    },
    logOut() {}, //put in here navigate to log-in screen
    showDetails() {}
  }
};
</script>
<style scoped>
</style>