<template>
	<Page>
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <AutoFocusView></AutoFocusView>
                    <SearchBar hint="Search" v-model="searchPhrase" @loaded="onSearchBarLoaded($event)" @textChange="filter()" />
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
                            <CategoryThumb v-for="category in filteredSubcategories" :key="category._id" :category="category" @tap="selectCategory" />
                        </WrapLayout>
                    </ScrollView>

                    <NavBar dock="bottom" height="10%" selectedtab="home" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>
	</Page>
</template>

<script>
import CategoryThumb from "./CategoryThumb";
import BackendService from "../services/BackendService"
import Category from "./Category";
import LeafCategory from "./LeafCategory";

export default {
	name: "Category",
	components: {
		CategoryThumb
	},
	props: {
		subcategories: Array
	},
	methods: {
        onSearchBarLoaded: function(event) {
            if (event.object.android) {
                setTimeout(() => {
                    event.object.dismissSoftInput();
                    event.object.android.clearFocus();
                }, 0);
            }
        },
        filter() {
            this.filteredSubcategories = this.$props.subcategories.filter((h)=>{
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
        },
		handleTap(event) {
			console.log(`tapped subcategory ${event.category.name}`);
        },
        selectCategory(event) {
            if (event.category.isLeaf) {
                this.$navigateTo(LeafCategory, {
                    props: {
                        category: event.category
                    }
                });
            } else {
                this.service.getSubcategories(event.category)
                    .then((res) => {
                        if (res) {
                            if (res.success) {
                                this.$navigateTo(Category, {
                                    props: {
                                        subcategories: res.subcategories
                                    }
                                })
                            } else {
                                alert({ title: `Couldn't navigate to ${event.category.name}`, message: res.message });
                            }
                        }
                    });
            }
        }
    },
    data () {
        return {
            drawerToggle: false,
            drawer1: "",
            drawer2: "",
            service: new BackendService(),
            searchPhrase: "",
            filteredSubcategories: []
        }
    },
    created () {
        this.filteredSubcategories = Array.from(this.$props.subcategories);
    }
}
</script>

<style scoped>

</style>