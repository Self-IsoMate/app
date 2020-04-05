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

                    <ScrollView dock="top" scrollBarIndicatorVisible="true" height="90%" padding="0 10">
                        <WrapLayout>
                            <CategoryThumb v-for="category in categories" :key="category._id" :category="category" @tap="selectCategory" />
                        </WrapLayout>
                    </ScrollView>

                    <NavBar dock="bottom" height="10%" selectedtab="home" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>

    </page>
</template>
<script>
    import SideBar from "./SideBar";
    import NavBar from "./NavBar";
    import CategoryThumb from "./CategoryThumb";
    import BackendService from "../services/BackendService";
    import Category from "./Category";

    export default {
        computed: {},
        watch: {},
        created() {
            this.homePosts = Array.from(this.allHomePosts);
        },
        data() {
            return {
                drawerToggle: false,
                categories: [],
                drawer1: "",
                drawer2: ""
            };
        },
        components: {
            CategoryThumb,
            SideBar,
            NavBar
        },
        created () {
            let service = new BackendService();
            service.getCategories()
                .then((res) => {
                    if (res) {
                        console.log(res);
                        this.categories = res.categories;
                    }
                })
                .catch((err) => {
                    if (err) {
                        console.log(err);
                    }
                })
        },
        methods: {
            ///
            filter() {
                this.homePosts = this.allHomePosts.filter((h)=>{
                   return h.title.toUpperCase().startsWith(this.searchPhrase.toUpperCase());
                });
            },
            ///
            onDrawerClosed() {
                this.drawerToggle = false;
            },
            onDrawerOpened() {
                this.drawerToggle = true;
            },
            toggleDrawer() {
                this.$refs.drawer.nativeView.toggleDrawerState();
            }, //put in here navigate to log-in screen
            selectCategory(event) {
                console.log(event);
                this.$navigateTo(Category, {
                    animated: false,
                    clearHistory: true,
                    props: {
                        subcategories: event.category.subcategories
                    }
                })
            }
        }
    };
</script>

<style scoped>

</style>