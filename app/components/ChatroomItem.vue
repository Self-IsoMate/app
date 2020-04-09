<template>
    <StackLayout orientation="horizontal" style="border-bottom-width:1;border-bottom-color:#E4E4E4;"
                                    padding="10">
     <!--USER ID this.$store.state.user._id -->
        <StackLayout width="20%">
            <Image :src="chatroom.chatroomPicture"
            stretch="aspectFill" class="conImg" />
        </StackLayout>
        <StackLayout marginLeft="10" paddingTop="3" width="50%">
            <Label :text="chatroom.chatroomName" :class="'convFriendName '" />
        </StackLayout>
        <StackLayout marginLeft="10" paddingTop="3" width="60%">
        <Button :text="userHasChatroom ? '-' : '+' " style="font-size:27;color:#fff;"/>
        </StackLayout>
    </StackLayout>
</template>

<script>

export default {
    created(){
        if (!this.$store.state.user._id){
            console.log("go away")
        } else {
            this.userHasChatroom = this.$store.state.user.chatrooms.includes(this.$props.chatroom._id);
        }
    },
    props: ['chatroom'],
    data(){
        return{
            userHasChatroom: false,
        }
    }
}

</script>
<style scoped>

</style>