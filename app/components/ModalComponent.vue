<template>
        <StackLayout>
                <Label text="What do you want to Remove?" class="setting-text emphasis" />
                <check-box text="Remove PROFILE" :checked="isCheckedAll" fillColor="red" @checkedChange="(isCheckedProfile)?(isCheckedProfile=false):isCheckedProfile=true" />
                <check-box text="Remove All POSTS" :checked="isCheckedAll" fillColor="red" @checkedChange="(isCheckedPosts)?(isCheckedPosts=false):isCheckedPosts=true" />
                <check-box text="Remove All CHAT MESSAGES" :checked="isCheckedAll" fillColor="red" @checkedChange="(isCheckedMessages)?(isCheckedMessages=false):isCheckedMessages=true" />
                <check-box text="Remove PROFILE, All CHAT MESSAGES and POSTS" :checked="(isCheckedProfile&&isCheckedPosts&&isCheckedMessages)" fillColor="red" @checkedChange="isCheckedAll==true?(isCheckedAll=false):(isCheckedAll=true)" />
                <Button text="Delete your account" backgroundColor="red" @tap="$modal.close([isCheckedProfile,isCheckedPosts,isCheckedMessages])" />

        </StackLayout>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import { CheckBox } from '@nstudio/nativescript-checkbox';
import { topmost } from 'tns-core-modules/ui/frame'
import ModalComponent from "./ModalComponent";
export default {
    data:() =>{
        return {
            isCheckedProfile:false,
            isCheckedPosts:false,
            isCheckedMessages:false,
            isCheckedAll:false


        };
    }
};
</script>

<style>
</style>
