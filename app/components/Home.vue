<template>
    <Page class="page">

        <HeaderBar @toggleDrawer="toggleDrawer" :drawerToggle="drawerToggle" />
        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened()" @drawerClosed="onDrawerClosed()">
            
            <SideBar ~drawerContent />
            <StackLayout ~mainContent>
                <DockLayout>
                    <!-- Actual page content goes here (in top) -->

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
    import HeaderBar from "./HeaderBar";

    export default {
        computed: {},
        watch: {},
        created() {
            this.homePosts = Array.from(this.allHomePosts);
        },
        data() {
            return {
                drawerToggle: false,
                drawer1: "",
                drawer2: "",
                mainColor: "#00ff92",
                searchPhrase: "",
                allHomePosts: [ {
                        title: "Try Something New",
                        postImg: "~/assets/images/TrySomethingNew.png",
                    },
                    {
                        title: "Art",
                        postImg: "~/assets/images/Art.png",
                    },
                    {
                        title: "Music",
                        postImg: "~/assets/images/music.png",
                    },
                ],
                homePosts:[],
            };
        },
        components: {
            CategoryThumb,
            SideBar,
            NavBar,
            HeaderBar
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