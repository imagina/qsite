<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        methods: {
            update() {
                this.$store.dispatch('qsiteApp/REFRESH_PAGE');
                this.$router.go(-1);
            }
        }
    });
</script>

<template>
    <div 
        class="
            tw-flex
            tw-justify-center
            tw-items-center
            tw-bg-gray-100
            tw-h-screen
        "
    >
        <div 
            class="
                tw-w-fit
                tw-bg-white
                tw-p-6
                tw-mx-5
                tw-rounded-xl
                tw-shadow-lg
            "
        >
            <h2 
                class="
                    tw-text-2xl 
                    tw-font-bold tw-mb-5
                "
            >
                Update available
            </h2>
            <p 
                class="
                    tw-text-base
                    tw-font-medium
                "
            >
                We are creating new features, please hit the Update 
                button to get the last version!
            </p>
            <div class="tw-flex tw-justify-center tw-w-full">
                <q-btn
                    @click="update"
                    class="tw-mt-5 tw-m-auto tw-rounded-lg"
                    color="primary"
                >
                    <q-icon name="fa-regular fa-rocket-launch" size="16px"/>
                    <span class="tw-ml-1.5">Update now</span>
                </q-btn>
            </div>
        </div>
    </div>
</template>