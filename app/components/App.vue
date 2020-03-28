<template lang="html">
    <BottomNavigation>
        <TabStrip>
            <TabStripItem class="navigation__item">
                <Label text="Home"></Label>
                <Image src.decode="font://&#xf015;" class="fas t-36"></Image>
            </TabStripItem>

            <TabStripItem class="navigation__item">
                <Label text="Challenges"></Label>
                <Image src.decode="font://&#xf1ea;" class="far t-36"></Image>
            </TabStripItem>

            <TabStripItem class="navigation__item">
                <Label text="Community"></Label>
                <Image src.decode="font://&#xf002;" class="fas t-36"></Image>
            </TabStripItem>

            <TabStripItem class="navigation__item">
                <Label text="Chat"></Label>
                <Image src.decode="font://&#xf002;" class="fas t-36"></Image>
            </TabStripItem>

        </TabStrip>

        <TabContentItem>
            <Frame>
                <Items />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <Browse />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <Search />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <LoginMain />
            </Frame>
        </TabContentItem>

    </BottomNavigation>
</template>

<script>
import Items from "./Items.vue";
import Browse from "./Browse.vue";
import Search from "./Search.vue";
import LoginMain from "./LoginMain.vue";

export default {
  components: {
    Items,
    Browse,
    Search,
    LoginMain
  }
};
</script>

<style lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles

</style>
