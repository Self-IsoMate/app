<template>
  <Page>
    <ActionBar>
      <Label text="Welcome!"></Label>
    </ActionBar>

    <ListView for="item in items" @itemTap="onItemTap">
      <v-template>
        <StackLayout orientation="horizontal">
          <Label :text="item.name" textWrap="false"></Label>
        </StackLayout>
      </v-template>
    </ListView>
  </Page>
</template>

<script>
import ItemDetails from "./ItemDetails";

export default {
    data: () => {
        return {
            items: [
                {
                    name: "Music",
                    description: "Description for Item 1"
                },
                {
                    name: "DIY",
                    description: "Description for Item 2"
                },
                {
                    name: "Cooking",
                    description: "Description for Item 3"
                },
                {
                    name: "Sports",
                    description: "Description for Item 4"
                },
                {
                    name: "Languages",
                    description: "Description for Item 5"
                },
                {
                    name: "Baking",
                    description: "Description for Item 6"
                },
                {
                    name: "Art",
                    description: "Description for Item 7"
                },
                {
                    name: "Hydroponics",
                    description: "Description for Item 8"
                },
            ]};
    },
    methods: {
        onItemTap (args) {
            const view = args.view;
            const page = view.page;
            const tappedItem = view.bindingContext;

            this.$navigateTo(ItemDetails, {
                props: { 
                    context: tappedItem,
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 200,
                        curve: "ease"
                    }}});
        }
    }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles

</style>