<template>
	<Page>
        <StackLayout margin="15">

            <Label text="Filter" />

            <SearchBar @textChange="filter" v-model="searchFilter" />

            <ScrollView>
                <WrapLayout orientation="horizontal">
                    <Button v-for="(c, index) in filteredCommunities" :key="index" :text="c" />
                </WrapLayout>
            </ScrollView>

        </StackLayout>
	</Page>
</template>
<script>
export default {
    props: {
        allCommunities: Array,
    },
    data () {
        return {
            searchFilter: '',
            filteredCommunities: []
        }
    },
	methods: {
        filter () {
            console.log(searchFilter);
        }
    },
    created () {
        this.filteredCommunities = { ... allCommunities };
    }
}
</script>
<style scoped>

</style>