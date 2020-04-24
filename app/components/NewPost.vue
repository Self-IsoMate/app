<template>
	<Page xmlns:VideoPlayer="nativescript-videoplayer">
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="$navigateBack">
                    <Label :text="back" class="font-awesome" style="font-size:27;color:#fff;"/>
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label text="New Post" class="header-text" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <StackLayout ~mainContent>
                <!-- Actual page content goes here (in dock top) -->
			<StackLayout width="100%">

 <StackLayout>


        </StackLayout>
			    <StackLayout margin="15">

					<ScrollView>
						<StackLayout>
							<TextField v-model="post.title" hint="Title..." class="text-field" />

							<TextView v-model="post.body" hint="Your post..." height="100" class="outline-field text-field" />

							<StackLayout>
								<TextView v-model="searchCommunity" hint="Search communities..." />
								<ScrollView height="150" >
									<StackLayout>
										<CommunityItemPost v-for="a in availableCommunities" :key="a._id"
											:community="a" @tap="toggleCommunity" />
									</StackLayout>
								</ScrollView>
								  
							</StackLayout>

							<GridLayout rows="auto, auto, auto, auto" columns="*">
								<Button row="0" text="Upload image" @tap="selectImage" />
								<Image row="1" :src='selectedImage' class="image" fill="aspectFill" />
								<Button row="2" text="Upload video" @tap="selectVideo" />
								<VideoPlayer row="3" ref="player"
									controls="true" loop="true" autoplay="true" height="200"
									:src='selectedVideo'/>
							</GridLayout>
							<GridLayout rows="auto" columns="*, *">
								<Button col="1" text="Add Post" @tap="addPost" />
								<Button col="0" text="Discard" backgroundColor="red" color="white" @tap="$navigateBack"/>
							</GridLayout>
						</StackLayout>
					</ScrollView>

			    </StackLayout>

			</StackLayout>
		</StackLayout>
	</Page>
</template>

<script>
import BackendService from '../services/BackendService';
import CommunityItemPost from "./CommunityItemPost";
import * as imagepicker from "nativescript-imagepicker";
import  Video  from 'nativescript-videoplayer';


export default {
	components: {
		CommunityItemPost
	},
	data() {
		return {
			post: {
				title: '',
				body: '',
				media: '',
				userId: '',
				communities: []
			},
			availableCommunities: [],
			allAvailableCommunities: [],
			service: new BackendService(),
			searchCommunity: '',
			back:"",
			selectedImage: null,
			selectedVideo: null
		}
	},
	created() {
		if (this.currentUser) {
			this.service.getCommunities(this.currentUser.communities)
				.then((res) => {
					if (res && res.success) {
						this.allAvailableCommunities = res.communities;
						this.availableCommunities = Array.from(this.allAvailableCommunities);
					}

					if (res && !res.success) {
						alert({ title: "Error", message: "There was a problem retrieving your communities", okButtonText: "OK"  })
							.then((res) => {
								this.$navigateBack();
							});
					}
				})
				.catch((err) => {
					if (err) {
						alert({ title: "Error", message: "There was a problem retrieving your communities", okButtonText: "OK"  })
							.then((res) => {
								this.$navigateBack();
							});
					}
				});
		} else {
			alert({ title: "Error", message: "It looks like you're not signed in... Please try again later", okButtonText: "OK"  })
				.then((res) => {
					this.$navigateBack();
				})
		}
	},
	methods: {
		uploadPost(post) {
			post.userId = this.currentUser._id;
			post.communities = post.communities.map((c) => { 
				return c._id
			});
			
			this.service.addPost(post)
				.then((res) => {
					if (res && res.success) {
						alert({ title: "Added post", message: "Successfully added post!" })
							.then((res) => {
								this.$navigateBack();
							});
					}

					if (res && !res.success) {
						console.log(res.message);
						alert({ title: "Failed", message: "Failed to add post" })
							.then((res) => {
								this.$navigateBack();
							});
					}
				})
		},

		addPost (event) {
			if (this.selectedImage) {
				alert({ title: "Please wait", message: "Uploading your image & adding your post. Please wait." });

				console.log(this.selectedImage);
				var taskInfo = this.service.uploadPostImage(this.selectedImage);

				if (taskInfo) {

					console.log(taskInfo);
					console.log(taskInfo.task);

					var task = taskInfo.task;
					

					var link = taskInfo.link;

					task.on("error", (err) => {
						if (err) {
							console.log(err);
							alert({ title: "Error", message: err });
						}
					});

					task.on("complete", (e) => {
						if (e) {
							console.log("got response");
							console.log(e);
							this.post.media = link;
							this.uploadPost(this.post);
						}
					})
				}

			} else if (this.selectedVideo) {
				alert({ title: "Please wait", message: "Uploading your video & adding your post. Please wait." });

				console.log(this.selectedVideo);
				var taskInfo = this.service.uploadPostVideo(this.selectedVideo);// for video

				if (taskInfo) {

					console.log(taskInfo);
					console.log(taskInfo.task);

					var task = taskInfo.task;
					

					var link = taskInfo.link;

					task.on("error", (err) => {
						if (err) {
							console.log(err);
							alert({ title: "Error", message: err });
						}
					});

					task.on("complete", (e) => {
						if (e) {
							console.log("got response");
							console.log(e);
							this.post.media = link;
							this.uploadPost(this.post);
						}
					})
				}

			}else {
				this.uploadPost(this.post);
			}
		},
		toggleCommunity (param) {
			var commie = param.item;
			if (this.isSelected(commie)) {
				this.post.communities = this.post.communities.filter((c) => c._id != commie._id );
			} else {
				this.post.communities.push(commie);
			}

			console.log(this.post.communities);
		},
		filterCommunities (event) {
			this.availableCommunities = this.allAvailableCommunities.filter((commie) => {
				return commie.name.toUpperCase().startsWith(this.searchCommunity.toUpperCase());
			});
		},
		isSelected (community) {
			return this.post.communities.find((c) => c._id == community._id) != null;
		},
		selectImage(event) {
            let context = imagepicker.create({ mode: "single", mediaType: 1 });

            context
                .authorize()
                .then(() => {
                    return context.present()
                })
                .then((selection) => {
                    if (selection) {
						console.log("selection");
						console.log(selection);
                        let image = selection[0];
                        image.options.width = 300;
                        image.options.height = 300;
						this.selectedImage = image;
						console.log("this.selectedImage");
						console.log(this.selectedImage);
						
                        return;
                    } else {
                        console.log("no image selected");
                    }
                })
                .catch((err) => {
                    console.table(err); //table <- for errors
                })
		},
		selectVideo(event) {
            let context = imagepicker.create({ mode: "single", mediaType: 2 });

            context
                .authorize()
                .then(() => {
                    return context.present()
                })
                .then((selection) => {
                    if (selection) {
						console.log("selection");
						console.log(selection);
                        let video = selection[0];
						video.options.width = 300;
                        video.options.height = 300;
						this.selectedVideo = video._android ?? video._ios; //URI for video
						console.log("this.selectedVideo");
						console.log(this.selectedVideo);
						console.log("this.selectVideo");
						console.log(this.selectVideo);
						
                        return;
                    } else {
                        console.log("no video selected");
                    }
                })
                .catch((err) => {
                    console.table(err); //table <- for errors
                })
		}
	},
	computed: {
		currentUser () {
			return this.$store.state.user;
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

.outline-field {
	border-color: #dedede;
	border-width: 1;
}

.text-field {
	margin: 10;
}

.selected {
	background-color: green;
}

.image {
	border-color: #dedede;
	border-width: 1;
	height: 100;
	margin: 10;
}

</style>