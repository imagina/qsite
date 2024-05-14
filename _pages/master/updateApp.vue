<template>
    <div class="tw-flex tw-justify-center tw-items-center tw-bg-gray-100 tw-h-screen">
      <div class="tw-max-w-xl tw-bg-white tw-p-6 tw-mx-5 tw-rounded-xl tw-shadow-lg">
        <div class="text-center">
          <q-icon name="fa-regular fa-rocket-launch" size="xl" color="secondary" />
          <div class="tw-text-2xl tw-font-bold tw-my-5 text-blue">
            {{ $tr('isite.cms.messages.updateAvailable') }}
          </div>
        </div>
        <p class="tw-text-base tw-font-medium">
          {{ $tr('isite.cms.messages.refreshAppVersion') }}
        </p>
        <div class="tw-flex tw-justify-center tw-w-full">
          <q-btn unelevated @click="update" color="primary"
              :loading="isLoading" :disable="isLoading"
                 class="tw-mt-5 tw-m-auto tw-rounded-lg">
            <span>
              {{ $tr('isite.cms.messages.updateNow') }}
              <span v-if="countdown > 0"> ({{ countdown }})</span>
            </span>
            <template v-slot:loading>
              <i class="fa-solid fa-spinner-third fa-spin"></i>
            </template>
          </q-btn>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import Vue, { onBeforeMount, ref, getCurrentInstance } from 'vue';
  import cache from '@imagina/qsite/_plugins/cache'

  export default {
    setup() {
        const countdown = ref(15);
        const isLoading = ref(false);
        const proxy = (getCurrentInstance() as any).proxy;
        let interval;
        
        onBeforeMount(async () => {
            //Redirect after update
            if (proxy.$route.query.updated) {
                proxy.$router.push({
                    name: proxy.$route.query.fromVueRoute || 'app.home'
                }) 
            } else {
                // Start countdown to auto-update
                if (interval) clearInterval(interval);
                interval = setInterval(async () => {
                    countdown.value--;
                    if (countdown.value === 0) await update();
                }, 1000);
            }
        });
        
        const update = async () => {
            clearInterval(interval);
            if (proxy.$route.query.version) await cache.set('api.version', proxy.$route.query.version);
            proxy.$router.push({ query: { ...proxy.$route.query, updated: '1' } });
            isLoading.value = true
            await Promise.allSettled([
                await proxy.$store.dispatch('qsiteApp/REFRESH_PAGE'),
                await proxy.$store.dispatch('qsiteApp/CLEAR_CACHE_STORAGE'),
                await proxy.$store.dispatch('qsiteApp/DELETE_SW'),
            ])
            isLoading.value = false
            window.location.reload();
        };

        return {
            update,
            isLoading,
            countdown
        }
    }
  }
  </script>
  