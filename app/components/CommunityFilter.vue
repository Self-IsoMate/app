<template>
	<Page>
        <ActionBar title="" class="action-bar header">
            <GridLayout columns="*, auto" height="38" 
                class="actionBarContainer">
                <StackLayout col="0" @tap="confirmChanges">
                    <Label text="O" style="font-size:27;color:#fff;" />
                </StackLayout>
                <StackLayout col="1" orientation="horizontal" alignItems="right" marginRight="10">
                    <Label text="Filter by Communities" />
                </StackLayout>
            </GridLayout>
        </ActionBar>
        <StackLayout margin="15">

            <SearchBar v-model="filterValue" :text="filterValue" @textChange="filter" />

            <ScrollView>
                <WrapLayout orientation="horizontal">
                    <Button v-for="(c, index) in filteredCommunities" :key="index" :text="c.name" @tap="toggleCommunityFilter(c)"
                            :class="{ 'selected': communitySelected(c) }" />
                </WrapLayout>
            </ScrollView>

        </StackLayout>
	</Page>
</template>
<script>
import Community from "./Community";

export default {
    name: "CommunityFilter",
    props: {
        allCommunities: Array,
        preSelectedCommunities: Array
    },
    data () {
        return {
            filteredCommunities: [],
            filterValue: '',
            selectedCommunities: []
        }
    },
	methods: {
        filter (event) {
            console.log(this.filterValue);
            this.filteredCommunities = this.$props.allCommunities.filter((c) => c.name.toUpperCase().startsWith(this.filterValue.toUpperCase()));
        },
        toggleCommunityFilter (community) {
            if (this.communitySelected(community)) {
                this.selectedCommunities = this.selectedCommunities.filter(c => c._id != community._id);
            } else {
                this.selectedCommunities.push(community);
            }
        },
        communitySelected (community) {
            return this.selectedCommunities.some(c => c._id == community._id);
        },
        confirmChanges () {
            if (this.selectedCommunities.length > 0) {
                this.$navigateTo(Community, { props: { communities: this.selectedCommunities } });
            } else {
                this.$navigateTo(Community);
            }
        }
    },
    created () {
        this.filteredCommunities = [... this.$props.allCommunities];
        if (this.$props.preSelectedCommunities) {
            this.selectedCommunities = [ ...this.$props.preSelectedCommunities ];
        }
        console.log(this.selectedCommunities);
    }
}
</script>
<style scoped>
.selected {
    background-color: green;
}
</style>