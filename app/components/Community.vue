<template>
    <Page class="page">

        <ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer">
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
                        class="font-awesome" @tap="createNewPost" />
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened()" @drawerClosed="onDrawerClosed()">
            
            <SideBar ~drawerContent />

            <StackLayout ~mainContent>
                <DockLayout>
                    <!-- Actual page content goes here (in dock top) -->

                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <ListView for="item in posts" :key="index" height="100%"
                            backgroundColor="#E8E8E8" separatorColor="transparent"
                            id="listView">
                            <v-template>

                            <StackLayout paddingTop="5" backgroundColor="#E8E8E8">
                                    <StackLayout class="post-container">
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

                    <NavBar dock="bottom" height="10%" selectedtab="community" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>

    </Page>
</template>

<script>
import NewPost from "./NewPost";

export default {
    name: "Community",
    data() {
        return {
            drawerToggle: false,
            drawer1: "",
            drawer2: "",
            posts: [{
                    authorImg: "https://www.istudy.org.uk/wp-content/uploads/2017/08/PP18-DIPLOMA-IN-PROFESSIONAL-CHEF.jpg",
                    autorName: "ratatouilefan123",
                    color: "#747474",
                    date: "Today at 13:45",
                    title: "Just cooked my favourite food! yum",
                    postImg: "~/assets/pizza.jpg",
                    likes: "30",
                    comments: "14",
                    reposts: "8",
                    categories: "#food #cooking"
                },
                {
                    authorImg: "~/assets/profile1.jpg",
                    autorName: "cdog",
                    color: "#E15050",
                    date: "Today at 16:21",
                    title: "Oh look at the thyme 🕒",
                    postImg: "~/assets/plant.jpg",
                    likes: "150",
                    comments: "21",
                    reposts: "11",
                    categories: "#gardening #herbs"
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
        createNewPost() {
            this.$navigateTo(NewPost);
        }
    }
}
</script>
<style scoped>

.post-container {
    background-color: white;
}

</style>