<template>
	<Page xmlns:VideoPlayer="nativescript-videoplayer">
		<ActionBar title="" class="action-bar header">
			<GridLayout columns="auto, *, auto" height="38" 
                class="actionBarContainer">
                <StackLayout col="0" @tap="confirmDiscard" style="vertical-alignment:center;" >
                    <Label :text="back" class="font-awesome" style="font-size:27;color:#fff;" verticalAlignment="center"/>
                </StackLayout>
                <StackLayout col="1" orientation="horizontal" alignItems="center">
                    <Label text="New Post" class="header-text" verticalAlignment="center" style="margin: 0 15;" />
                </StackLayout>
				<StackLayout col="2" orientation="horizontal" alignItems="right" marginRight="10">
					<Label text="" class="header-text font-awesome" style="font-size:27;color:#fff;margin:5 15;" 
						verticalAlignment="center" @tap="validatePost" />
                </StackLayout>
            </GridLayout>
        </ActionBar>

        <StackLayout ~mainContent>
                <!-- Actual page content goes here (in dock top) -->
			<StackLayout width="100%">
			    <StackLayout margin="15">

					<ScrollView>
						<StackLayout>
							<TextField v-model="post.title" hint="Title..." class="text-field" @tap="titleRequired"/>

							<TextView v-model="post.body" hint="Your post..." height="100" class="outline-field text-field" />

							<StackLayout>
								<GridLayout v-if="!selectedImage" rows="auto" columns="*">
									<Button row="0" text="Upload image" @tap="selectImage" />
								</GridLayout>
								<GridLayout v-else rows="auto" columns="*, *">
									<Button col="1" text="Remove Image" backgroundColor="red" color="white" @tap="selectedImage= null"/>
									<Button row="0" text="Change image" @tap="selectImage" />
								</GridLayout>
								<GridLayout rows="auto" columns="*">
									<Image row="0" :src='selectedImage' class="image" id="imageFile" v-if="selectedImage" />
								</GridLayout>
							</StackLayout>

							<StackLayout>
								<GridLayout v-if="!selectedVideo" rows="auto" columns="*">
									<Button row="0" text="Upload video" @tap="selectVideo" />
								</GridLayout>
								<GridLayout v-else rows="auto" columns="*, *">
									<Button col="1" text="Remove Video" backgroundColor="red" color="white" @tap="selectedVideo= null"/>
									<Button row="0" text="Change Video" @tap="selectVideo" />
								</GridLayout>
								<GridLayout rows="auto" columns="*">
										<VideoPlayer row="1" ref="player" id="videoFile" v-if="selectedVideo"
									controls="true" loop="true" autoplay="true" height="200"
									:src='selectedVideo'/>
								</GridLayout>
							</StackLayout>

							<StackLayout>
								<TextView v-model="searchCommunity" hint="Search communities..." @textChange="filterCommunities" :isEnabled="arrayEnable" />
								<WrapLayout orientation="horizontal">
									<CommunityItemPost v-for="a in availableCommunities" :key="a._id"
										:community="a" @tap="toggleCommunity" />
								</WrapLayout>
									
							</StackLayout>

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
var FeedbackPlugin = require("nativescript-feedback");
var FeedbackType = require ("nativescript-feedback").FeedbackType;
var feedback = new FeedbackPlugin.Feedback();

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
			selectedVideo: null,
			arrayEnable: true
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
						feedback.show({
							title: "Error: There was a problem retrieving your communities",
							message: "We are sorry! Something went wrong, please try again in few minutes",
							type: FeedbackType.Error
						})
							.then((res) => {
								this.$navigateBack();
							});
					}
				})
				.catch((err) => {
					if (err) {
						feedback.show({
							title: "Error: There was a problem retrieving your communities",
							message: "We are sorry! Something went wrong, please try again in few minutes",
							type:
							FeedbackType.Error
						})
							.then((res) => {
								this.$navigateBack();
							});
					}
				});
		} else {
			      feedback.show({
                        title: "Error: Please sign in!",
                        message: "It looks like you're not signed in... Please try again later",
                        type:
                        FeedbackType.Error
                    })			
				.then((res) => {
					this.$navigateBack();
				})
		}

		this.arrayEnable = (this.availableCommunities.length>0||this.allAvailableCommunities.length>0)&&(!this.availableCommunities.includes(undefined)||!this.allAvailableCommunities.includes(undefined));
	        if(this.arrayEnable==false){
                    feedback.show({
						title: "Error: There was a problem retrieving data from the server",
						message: "We are sorry! Something went wrong, please try again in few minutes",
						type: FeedbackType.Warning
					});
			}
	},

	methods: {
        titleRequired (){
                    feedback.show({
                        title: "Title is required! ",
                        message: "Your post must have a title! ",
                        type: FeedbackType.Custom
                    });
        },
		uploadPost(post) {
			post.userId = this.currentUser._id;
			post.communities = post.communities.map((c) => { 
				return c._id
			});
			
			this.service.addPost(post)
				.then((res) => {
					if (res && res.success) {
						this.$store.state.lastPosted = Date.parse(res.post.datePosted);
						feedback.show({
							title: "Success: Added post",
							message: "Successfully added post!",
							type:
							FeedbackType.Success
						})
							.then((res) => {
								this.$navigateBack();
							});
					}

					if (res && !res.success) {
						console.log(res.message);
						feedback.show({
							title: "Failed: Failed to add post",
							message: "We are sorry! Something went wrong, please try again in few minutes",
							type:
							FeedbackType.Error
						})
							.then((res) => {
								this.$navigateBack();
							});
					}
				})
		},
		addPost () {
			if (this.selectedImage) {
				      feedback.show({
                        title: "Please wait",
                        message: "Uploading your image & adding your post. Please wait.",
                        type:
                        FeedbackType.Info
                    });

				var taskInfo = this.service.uploadPostImage(this.selectedImage);

				if (taskInfo) {

					//console.log(taskInfo);
					

					var task = taskInfo.task;
					
					//console.log(taskInfo.task);

					var link = taskInfo.link;

					//console.log(taskInfo.link);

					task.on("error", (err) => {
						if (err) {
							console.log(err);
						feedback.show({
							title: "Error",
							message: err,
							type:
							FeedbackType.Error
						})
						}
					});

					task.on("complete", (e) => {
						if (e) {
							//console.log("got response");
							//console.log(e);
							this.post.media = link;
							this.uploadPost(this.post);
						}
					})
				}

			} else if (this.selectedVideo) {
				      feedback.show({
                        title: "Please wait!",
                        message: "Uploading your video & adding your post. Please wait.",
                        type:
                        FeedbackType.Info
                    });

				var taskInfo = this.service.uploadPostVideo(this.selectedVideo);// for video

				if (taskInfo) {

					//console.log(taskInfo);
					

					var task = taskInfo.task;
					
					//console.log(taskInfo.task);

					var link = taskInfo.link;

					//console.log(taskInfo.link);

					task.on("error", (err) => {
						if (err) {
							console.log(err);
						feedback.show({
							title: "Error",
							message: err,
							type:
							FeedbackType.Error
						})
					}
					});

					task.on("complete", (e) => {
						if (e) {
							//console.log("got response");
							//console.log(e);
							this.post.media = link;
							this.uploadPost(this.post);
						}
					})
				}

			} else {
				this.uploadPost(this.post);
			}
		},
		validatePost (event) {
			var valid = true;
			// check content
			if(this.post.body=="" || this.post.title==""){
				valid = false;
				feedback.show({
                        title: "Please add title and content to your post",
                        message: "Your post need a title and a body",
                        type:
                        FeedbackType.Warning
                    });
			}

			// spam checking
			var today = new Date();
			if(this.$store.state.lastPosted) {
				var diffMs = (today - this.$store.state.lastPosted); 
				var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes*/
				if (diffMins < 4) {
					valid = false;
					feedback.show({
                        title: "Spam detected",
                        message: "Please wait before adding another post",
                        type:
                        FeedbackType.Warning
                    });
				}
			}

			// checking if communities valid
			if (valid && this.post.communities.length < 1) {
				valid = false;
				      feedback.show({
                        title: "Community required:",
                        message: "Please select a community first",
                        type:
                        FeedbackType.Warning
                    });
			}

			// if all validation has passed, then proceed
			if (valid) {
				this.addPost();
			} else {
				return;
			}
		},
		toggleCommunity (param) {
			var commie = param.item;
			if (this.isSelected(commie)) {
				this.post.communities = this.post.communities.filter((c) => c._id != commie._id );
			} else {
				this.post.communities.push(commie);
			}

			//console.log(this.post.communities);
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
			this.selectedVideo = null;
            let context = imagepicker.create({ mode: "single", mediaType: 1 });

            context
                .authorize()
                .then(() => {
                    return context.present()
                })
                .then((selection) => {
                    if (selection) {
						/*console.log("selection");
						console.log(selection);*/
                        let image = selection[0];
                        image.options.width = 300;
						image.options.height = 300;
						this.selectedImage = image;
						/*console.log("this.selectedImage");
						console.log(this.selectedImage);*/
						
                        return;
                    }
                })
                .catch((err) => {
                    console.table(err); //table <- for errors
                })
		},
		selectVideo(event) {
			this.selectedImage = null;

            let context = imagepicker.create({ mode: "single", mediaType: 2 });

            context
                .authorize()
                .then(() => {
                    return context.present()
                })
                .then((selection) => {
                    if (selection) {
						/*console.log("selection");
						console.log(selection);*/
                        let video = selection[0];
						video.options.width = 300;
						video.options.height = 300;
						//this.showImage = false
						//this.showVideo = true;
						this.selectedVideo = video._android ?? video._ios; //URI for video
						if(this.selectedVideo.slice(-3)!='mp4'){
							feedback.show({
								title: "Only MP4 format",
								message: "Only .mp4 videos supported",
								type:
								FeedbackType.Custom
								//FeedbackType.Success
								//FeedbackType.Warning
								//FeedbackType.Error
								//FeedbackType.Info
							});
						}
						/*console.log("this.selectedVideo");
						console.log(this.selectedVideo);
						console.log("this.selectVideo");
						console.log(this.selectVideo);*/
						
                        return;
                    }
                })
                .catch((err) => {
                    console.table(err); //table <- for errors
                })
		},
		confirmDiscard () {
			confirm({
				title: 'Are you sure?',
				message: 'Are you sure you want to discard your post?',
				okButtonText: 'Discard',
				cancelButtonText: 'Cancel'
			})
			.then(res => {
				if (res) {
					this.$navigateBack();
				}
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