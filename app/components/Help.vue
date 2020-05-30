<template>
    <Page>
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="toggleDrawer">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label text="Help" class="category-header" />
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

					<StackLayout dock="top" height="90%" margin="0 10">
                        <StackLayout @tap="toggleContactUs()" class="option">
                            <Label :text="contactToggle ? 'Contact Us ' + expanded: 'Contact Us ' + collapsed"
                            style="font-size:27;color:#000000;" class="font-awesome" />
                        </StackLayout>
                        <StackLayout v-show="contactToggle">
                            <Label/>
                            <Label text="Get in touch via email:" style="font-size:20;" />
                            <Label text="info@self-isomate.online" @tap="openLink()" class="link" style="font-size:20;"/>
                        </StackLayout>
                        <StackLayout @tap="toggleFAQ()" class="option">
                            <Label :text="faqToggle ? 'FAQ ' + expanded: 'FAQ ' + collapsed"
                            style="font-size:27;color:#000000;" class="font-awesome" />
                        </StackLayout>
					</StackLayout>

                    <NavBar dock="bottom" height="10%" selectedtab="home" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>
	</Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";

    export default {
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Notifications");
        },
        computed: {
            message() {
                return "No Help";
            }
        },
        data() {
            return {
                drawerToggle: false,
                contactToggle: false,
                faqToggle: false,
                drawer1: "", //the three dots vertically
                drawer2: "", //the three dots horizontally
                collapsed: "", //right chevron
                expanded: "", //down chevron
                mainColor: "#00ff92",
                emailUs: "mailto:info@self-isomate.online"
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
            toggleContactUs() {
                this.contactToggle = !this.contactToggle;
            },
            toggleFAQ() {
                this.faqToggle = !this.faqToggle;
            },
            openEmail(){
                alert({ title: 'Send Email', message: 'Implement to open email app' })
            },
            openLink() {
                const utilsModule = require("tns-core-modules/utils/utils");
                utilsModule.openUrl(this.emailUs);
		    }
        }
    };
</script>

<style scoped>
.option{
	background-color: #c2c2bf;
    padding-top: 20;
    padding-bottom: 20;
    padding-left: 5;
	margin-top: 20;
}
.category-header {
	font-size: 20;
	vertical-align: center;
	color: white;
	margin: 5 0 0 0
}
.link{
	text-decoration: underline;
    color: cornflowerblue;
}

</style>