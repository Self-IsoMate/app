<template>
        <StackLayout>
                <Label text="What do you want to Remove?" class="setting-text emphasis" />
                <check-box text="Remove PROFILE" :checked="isCheckedProfile" fillColor="red" @checkedChange="(isCheckedProfile)?isCheckedProfile=false:isCheckedProfile=true" />
                <check-box text="Remove All POSTS" :checked="isCheckedPosts" fillColor="red" @checkedChange="(isCheckedPosts)?isCheckedPosts=false:isCheckedPosts=true" />
                <check-box text="Remove All CHAT MESSAGES" :checked="isCheckedMessages" fillColor="red" @checkedChange="(isCheckedMessages)?isCheckedMessages=false:isCheckedMessages=true" />
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
            isCheckedMessages:false

        };
    }
};
</script>

<style>
</style>
