<script lang="ts">
    import { defineComponent } from 'vue';
    import cache from '@imagina/qsite/_plugins/cache'

    const KEY = 'api.version'

    export default defineComponent({
        async mounted() {
            const version = await cache.get.item(KEY)
            if (this.$route.query.version === version) {
                this.$router.go(-1);
            }
        },
        methods: {
            update() {
                cache.set(KEY, this.$route.query.version)
                this.$store.dispatch('qsiteApp/REFRESH_PAGE');
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
                {{ $tr('isite.cms.messages.updateAvailable') }}
            </h2>
            <p 
                class="
                    tw-text-base
                    tw-font-medium
                "
            >
                {{ $tr('isite.cms.messages.refreshAppVersion') }}
            </p>
            <div class="tw-flex tw-justify-center tw-w-full">
                <q-btn
                    @click="update"
                    class="tw-mt-5 tw-m-auto tw-rounded-lg"
                    color="primary"
                >
                    <q-icon name="fa-regular fa-rocket-launch" size="16px"/>
                    <span class="tw-ml-1.5">{{ $tr('isite.cms.messages.updateNow') }}</span>
                </q-btn>
            </div>
        </div>
    </div>
</template>