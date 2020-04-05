<template>
	<Page>
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
					<ScrollView dock="top" height="90%"  >
						<StackLayout>
							<CategoryThumb v-for="category in subcategories" :key="category._id" :category="category" @tap="handleTap" />
						</StackLayout>
					</ScrollView>

                    <StackLayout dock="bottom" height="10%" style="border-color:#E8E8E8;border-width:1;background:#fff;">
                        <StackLayout orientation="horizontal">
                            <StackLayout class="navItem" @tap="homeTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" :color="mainColor"
                                    android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="competitionTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text=" " android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="communityTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" :color="profileColor"
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
	</Page>
</template>

<script>
import CategoryThumb from "./CategoryThumb";

export default {
	name: "CategoryThumb",
	components: {
		CategoryThumb
	},
	props: {
		subcategories: {}
	},
	methods: {
		handleTap(event) {
			console.log(`tapped subcategory ${event.category.name}`);
		}
	}
}
</script>

<style scoped>

</style>