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

                </StackLayout>
            </StackLayout>
        </ActionBar>
        
        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
            
            <SideBar ~drawerContent />

            <StackLayout ~mainContent>
                <DockLayout>
                    <!-- Actual page content goes here (in dock top) -->

                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <ListView for="item in homePosts" key="index" height="100%"
                            backgroundColor="#E8E8E8" separatorColor="transparent"
                            id="listView">
                            <v-template>

                                <StackLayout paddingTop="5" backgroundColor="#E8E8E8">
                                    <StackLayout class="postContainer">
                                        <Image :src="item.postImg" marginTop="10" />
                                    </StackLayout>
                                </StackLayout>

                            </v-template>
                        </ListView>
                    </StackLayout>
                    
                    <NavBar dock="bottom" height="10%" selectedtab="competition" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>
        
    </Page>
</template>
<script>

export default {
    name: "Competitions",
    data() {
        return {
            drawerToggle: false,
            drawer1: "",
            drawer2: "",
            homePosts: [ {
                    title: "Gardening",
                    postImg: "~/assets/images/gardeningChallenge.png",
                },
                {
                    title: "Art",
                    postImg: "~/assets/images/musicChallenge.png",
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
        }
    }
}
</script>

<style scoped>

</style>