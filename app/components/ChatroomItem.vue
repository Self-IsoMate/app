<template>
    <StackLayout orientation="horizontal" style="border-bottom-width:1;border-bottom-color:#E4E4E4;"
                                    padding="10">
     <!--USER ID this.$store.state.user._id -->
        <StackLayout width="20%">
            <Image :src="chatroom.chatroomPicture"
            stretch="aspectFill" class="conImg" />
        </StackLayout>
        <StackLayout marginLeft="10" paddingTop="3" width="50%">
            <Label textWrap="true" :text="chatroom.chatroomName" :class="'convFriendName '" />
        </StackLayout>
        <StackLayout marginLeft="10" paddingTop="3" width="60%">
        <Button :text="userHasChatroom ? '-' : '+' " style="font-size:27;color:#fff;" @tap="onTap()" />
        </StackLayout>
    </StackLayout>
</template>

<script>
import BackendService from "../services/BackendService";

export default {
    created(){
        if (!this.$props.user._id){
            console.log("go away")
        } else {
            this.userHasChatroom = this.$props.user.chatrooms.includes(this.$props.chatroom._id);
        }
    },
    props: ['chatroom', 'user'],
    data(){
        return{
            userHasChatroom: false,
        }
    },
    methods: {
        onTap(){
            if (this.userHasChatroom){
                this.removeChatroom(this.$props.chatroom._id);
            } else {
                this.addChatroom(this.$props.chatroom._id);
            }
        },
        removeChatroom(){
            var backend = new BackendService();
            backend.removeChatroom(this.$props.user._id, this.$props.chatroom._id)
            .then((res) => {
                    if (res){
                        this.userHasChatroom = false;
                        this.$store.commit("setUser", { user: res.user });
                    } 
            })
            .catch((err) => {
                if (err) console.log(err);
            }) 
        },
        addChatroom(){
            var backend = new BackendService();
            backend.addChatroom(this.$props.user._id, this.$props.chatroom._id)
                .then((res) => {
                    if (res){
                        this.userHasChatroom = true;
                        this.$store.commit("setUser", { user: res.user });
                    } 
                })
            .catch((err) => {
                if (err) console.log(err);
        })
        }

    }
}

</script>
<style scoped>

</style>