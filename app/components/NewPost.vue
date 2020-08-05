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
								<TextView v-model="searchCommunity" hint="Search communities..." @textChange="filterCommunities" :isEnabled="!noData" />
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
import { Feedback, FeedbackType } from "nativescript-feedback";
import Validate from "../validation/Validate";
var validation = new Validate();
    

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
			feedback: new Feedback(),
			valid: true
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
						this.feedback.show({ title: 'Error', message: res.message, type: FeedbackType.Error })
							.then((res) => {
								this.$navigateBack();
							});
					}
				})
				.catch((err) => {
					if (err) {
						this.feedback.show({ title: 'Error', message: err.message, type: FeedbackType.Error })
							.then((res) => {
								this.$navigateBack();
							});
					}
				});
		} else {
			this.feedback.show({ title: 'Please log in', message: 'Please sign in before posting', type: FeedbackType.Error })			
				.then((res) => {
					this.$navigateBack();
				})
		}
	},

	methods: {
 		uploadPost(post) {
			post.userId = this.currentUser._id;
			post.communities = post.communities.map((c) => c._id );
			
			this.service.addPost(post)
				.then((res) => {
					if (res && res.success) {
						this.$store.state.lastPosted = Date.parse(res.post.datePosted);
						this.feedback.show({ title: 'Posted', message: 'Your post has been added', type: FeedbackType.Success })
							.then((res) => {
								this.$navigateBack();
							});
					}

					if (res && !res.success) {
						this.feedback.show({ title: 'Error', message: res.message, type: FeedbackType.Error })
							.then((res) => {
								this.$navigateBack();
							});
					}
				})
		},
		addPost () {
			if (this.selectedImage) {
				this.feedback.show({ title: "Please wait", message: "Uploading image", type: FeedbackType.Info });
				var taskInfo = this.service.uploadPostImage(this.selectedImage);
				if (taskInfo) {
					var task = taskInfo.task;
					var link = taskInfo.link;

					task.on("error", (err) => {
						if (err) {
							this.feedback.show({
								title: "Error",
								message: err.message,
								type: FeedbackType.Error
							})
						}
					});

					task.on("complete", (e) => {
						if (e) {
							this.post.media = link;
							this.uploadPost(this.post);
						}
					})
				}

			} else if (this.selectedVideo) {
				this.feedback.show({ title: "Please wait", message: "Uploading video", type: FeedbackType.Info });
				var taskInfo = this.service.uploadPostVideo(this.selectedVideo);
				if (taskInfo) {

					var task = taskInfo.task;
					
					var link = taskInfo.link;

					task.on("error", (err) => {
						if (err) {
							this.feedback.show({
								title: "Error",
								message: err.message,
								type: FeedbackType.Error
							})
						}
					});

					task.on("complete", (e) => {
						if (e) {
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
			
			this.valid = validation.validateTitlePost(this.post.title) && 
			validation.validateEmptyPost(this.post.body)&& 
			validation.spamDetection();
		 

			// checking if communities valid
			if (this.valid && this.post.communities.length < 1) {
				this.valid = false;
				this.feedback.show({
					title: "Community Required:",
					message: "Select a community to post to",
					type: FeedbackType.Warning
				});
			}

			// if all validation has passed, then proceed
			if (this.valid) {
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
                        let image = selection[0];
                        image.options.width = 300;
						image.options.height = 300;
						this.selectedImage = image;
                        return;
                    }
                })
                .catch((err) => {
					if (err) {
						this.feedback.show({ title: 'Error', message: err.message, type: FeedbackType.Error })
					}
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
                        let video = selection[0];
						video.options.width = 300;
						video.options.height = 300;
						this.selectedVideo = video._android ?? video._ios; 
						if (this.selectedVideo.slice(-3)!='mp4'){
							feedback.show({
								title: "Only MP4 format",
								message: "Only .mp4 videos supported",
								type: FeedbackType.Custom
							});
						}
                        return;
                    }
                })
                .catch((err) => {
					if (err) {
						this.feedback.show({ title: 'Error', message: err.message, type: FeedbackType.Error })
					}
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
		currentUser: function () {
			return this.$store.state.user;
		},
		noData: function () {
			return this.availableCommunities.length == 0 ||
				this.allAvailableCommunities.length == 0 ||
				this.availableCommunities.includes(undefined)||
				this.allAvailableCommunities.includes(undefined);
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