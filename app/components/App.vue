<template lang="html">
    <BottomNavigation>
        <TabStrip>
            <TabStripItem class="navigation__item">
                <Label text="Home"></Label>
                <Image src.decode="font://&#xf015;" class="fas t-36"></Image>
            </TabStripItem>
            <TabStripItem class="navigation__item">
                <Label text="Challenges"></Label>
                <Image src.decode="font://&#xf091;" class="fas t-36"></Image>
            </TabStripItem>
            <TabStripItem class="navigation__item">
                <Label text="Community"></Label>
                <Image src.decode="font://&#xf0c0;" class="fas t-36"></Image>
            </TabStripItem>
            <TabStripItem class="navigation__item">
                <Label text="Chat"></Label>
                <Image src.decode="font://&#xf075;" class="fas t-36"></Image>
            </TabStripItem>
        </TabStrip>

        <TabContentItem>
            <Frame>
                <Home />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <Challenges />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <Community />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <Chat />
            </Frame>
        </TabContentItem>

    </BottomNavigation>
</template>

<script>
import Home from "./Home.vue";
import Challenges from "./Challenges.vue";
import Community from "./Community.vue";
import Chat from "./Chat.vue";

export default {
  components: {
    Home,
    Challenges,
    Community,
    Chat
  }
};
</script>

<style lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles

</style>
