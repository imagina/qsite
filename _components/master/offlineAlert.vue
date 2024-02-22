<template>
    <div id="offline-alert">
        <div class="bg-blue-grey-10 offline-alert" @click="eventBus.emit('toggleMasterDrawer', 'offline')">
            <q-icon size="16px" name="fa-light fa-wifi-slash" class="q-mr-sm" /> {{ $tr('isite.cms.message.appOffline') }}
        </div>
    </div>
</template>

<script>
import { eventBus } from 'src/plugins/utils'

export default {
    name: "offlineAlert",
    data: () => {
      return {
        eventBus
      }
    }
}
</script>

<style lang="scss">
#offline-alert {
  position: relative;
  min-height: 30px;

  .offline-alert {
    position: fixed;
    top: 0;
    padding: 5px;
    text-align: center;
    color: #FFFFFF;
    width: 100%;
    z-index: 1000;

    @media(min-width: 1024px) {
      top: 50px;
      border-radius: 10px 0 0 0;
    }
  }
}
</style>
