<template>
	<Page>
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="$navigateBack">
                    <Label text="<" style="font-size:27;color:#fff;"/>
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label text="Edit Profile" class="header-text" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <StackLayout ~mainContent>
                <!-- Actual page content goes here (in dock top) -->
			<StackLayout width="100%" margin="15">

				<Label text="Edit Username" />

				<GridLayout columns="auto" rows="auto">
					<Label text="" class="font-awesome"/>
					<Image :src="currentUser.profilePicture"
						stretch="aspectFill" class="profilePic"
						@tap="pickProfile">
					</Image>
				</GridLayout>

			</StackLayout>
		</StackLayout>
	</Page>
</template>
<script>
export default {
	methods: {
		pickProfile () {
                let context = imagepicker.create({ mode: "single", mediaType: 1 });

                context
                    .authorize()
                    .then(() => {
                        return context.present()
                    })
                    .then((selection) => {
                        if (selection) {
                            let image = selection[0];
                            image.options.width = 300;
                            image.options.height = 300;
                            this.currentUser.profilePicture = image;
                            this.uploadImage()
                                .then((res) => {
                                    if (res) {
                                        console.log("got response");
                                        this.currentUser.profilePicture = res;
                                    }
                                });
                        } else {
                            console.log("no image selected");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            },
            
            async uploadImage () {
                let backendService = new BackendService();
                console.log("uploading image");
                return await backendService.changeProfilePicture(this.currentUser).newLocation;
            }
	},
	data () {
		return {
			drawerToggle: false,
			drawer1: "", //the three dots vertically
			drawer2: "", //the three dots horizontally
		}
	},
	computed: {
		currentUser: function () { 
			return this.$store.state.user
		}
	}
	
}
</script>
<style scoped>
.header-text {
	font-size: 20;
	vertical-align: center;
	color: white;
	margin: 5 0 0 0
}


.profilePic{
	width:150;
	height:150;
	border-radius:100;
	margin:20;
	border-color: #4db8ff;
	border-width: 1;
}
</style>