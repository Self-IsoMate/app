<template>
	<Page>
        <ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="chatTap">
                    <Label text="✓" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label text="Filter" style="font-size:20;color:#fff;" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>
        <StackLayout margin="15">

            <SearchBar hint="Community name..." v-model="filterValue" :text="filterValue" @textChange="filter" />

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