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
                    <SearchBar hint="Search" v-model="searchPhrase" @textChange="filter()" />
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
    import CategoryThumb from "./CategoryThumb";
    import BackendService from "../services/BackendService";
    import Category from "./Category";
//
    import { timer } from 'vue-timers'

    export default {
        name: "Home",
        data() {
            return {
                drawerToggle: false,
                allCategories: [],
                categories: [],
                drawer1: "",
                drawer2: "",
                service: new BackendService(),
                searchPhrase: ""
            };
        },
        components: {
            CategoryThumb
        },
//
        timers: {
            log: { time: 10000, autostart: false, repeat: false }
        },
        mounted () {
            var service = new BackendService();

            service.getCategories()
                .then((res) => {
                    if (res) {
                        console.log("this is the response");
                        console.log(res.categories);
                        this.allCategories = res.categories;
                        this.categories = Array.from(this.allCategories);
                    }
                })
                .catch((err) => {
                    if (err) {
                        console.log(err);
                    }
                })
//
            this.$timer.start('log')

        },
        methods: {
            filter() {
                this.categories = this.allCategories.filter((h)=>{
                   return h.name.toUpperCase().startsWith(this.searchPhrase.toUpperCase());
                });
            },
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
                this.service.getSubcategories(event.category)
                    .then((res) => {
                        this.$navigateTo(Category, {
                            props: {
                                subcategories: res.subcategories
                            }
                        })
                    });
            }
        }
    };
</script>

<style scoped>

</style>