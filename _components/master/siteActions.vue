<template>
  <div id="siteActionscomponent">
    <div :class="`row q-gutter-${gutter}`">
      <!--Actions-->
      <template v-for="(btn, keyAction) in actions.buttons">
        <q-btn
          v-if="btn?.vIf != undefined ? btn.vIf : true"
          :key="keyAction"
          v-bind="{...defaultButtonProps, ...btn.props}"
          @click="btn.action != undefined ? btn.action() : null"
        >
          <q-menu v-if="btn.menu" fit>
            <div class="q-py-sm q-px-md">
              <div class="text-subtitle1 text-primary">{{ btn.label }}</div>
              <!--Separator-->
              <q-separator class="q-my-sm" />
              <!-- Description -->
              <div class="text-caption text-blue-grey">{{ $tr('isite.cms.message.descriptionHelpCenter') }}.</div>
              <!--Actions-->
              <q-list separator class="no-shadow" style="min-width: 260px">
                <q-item v-for="(act, keyAction) in btn.menu.actions" :key="keyAction" clickable v-ripple
                        v-close-popup @click.native="act.action != undefined ? act.action() : null">
                  <q-item-section class="text-blue-grey">
                    <div>
                      <q-icon :name="act.icon" class="q-mr-sm" color="primary" size="xs" />
                      {{ act.label }}
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="fa-light fa-chevron-right" size="12px" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-menu>
          <!-- Tooltip -->
          <q-tooltip>{{ btn.label }}</q-tooltip>
          <!-- Badge -->
          <q-badge
            v-if="btn.badgeLabel || btn.badge"
            :color="btn.badgeColor || 'orange'"
            rounded floating
          >
            {{ btn.badgeLabel }}
          </q-badge>
        </q-btn>
      </template>
      <!--Auth section-->
      <q-btn v-if="quserState.authenticated && (configMode == 'iadmin')" id="profileButton" rounded no-caps
             padding="2px 8px" color="white" unelevated>
        <div id="profileImage" class="img-as-bg" v-if="profileImage.smallThumb"
             :style="`background-image: url('${profileImage.smallThumb}')`"></div>
        <div class="q-ml-xs q-mr-sm text-blue-grey">{{ quserState.userData.firstName }}</div>
        <q-icon name="fas fa-chevron-down" size="14px" color="blue-grey" />
        <!--Menu-->
        <q-menu
          anchor="bottom right"
          self="top right"
          :offset="[0, 18]"
          class="
            tw-rounded-2xl
            tw-shadow-none
            tw-top-3
            tw-border-2
            tw-border-gray-100
            tw-py-5
          "
        >
          <div
            class="tw-mb-5 tw-mx-5"
            :class="{ 'tw-text-center': profileImage.mediumThumb }"
          >
            <q-avatar v-if="profileImage.mediumThumb" size="84px" class="tw-mb-2.5">
              <img :src="profileImage.mediumThumb">
            </q-avatar>
            <div class="tw-font-bold tw-text-base">
              {{ quserState.userData.fullName }}
            </div>
            <div class="ellipsis text-caption tw-text-gray-500">
              {{ quserState.userData.roles.map(role => role.name).join(', ') }}
            </div>
          </div>
          <div class="column">
            <template v-for="(btn, keyAction) in actions.menu">
              <q-btn
                :key="keyAction"
                class="tw-px-5"
                v-bind="{...defaultButtonProps, ...btn.props}"
                v-if="btn?.vIf != undefined ? btn.vIf : true"
                v-close-popup
                @click="btn.action != undefined ? btn.action() : null"
              />
            </template>
          </div>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
<script>
import { eventBus } from 'src/plugins/utils';

export default {
  beforeUnmount() {
    eventBus.off('header.badge.manage');
  },
  props: {
    gutter: { type: String, default: 'sm' },
    size: { type: String, default: 'small' },
    replaceActions: { type: Object, default: () => ({}) }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      configMode: config('app.mode'),
      badge: {
        chat: false,
        notification: false
      },
      defaultButtonProps: {
        round: true,
        dense: true,
        color: 'white',
        unelevated: true,
        class: 'btn-small',
        textColor: 'blue-grey',
        noCaps: true
      }
    };
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    //Quser state
    quserState() {
      return this.$store.state.quserAuth;
    },
    //Current Theme
    theme() {
      return parseInt(this.$getSetting('isite::iadminTheme'));
    },
    //Return params of subHeader
    params() {
      return this.$clone(this.$route.meta.subHeader || {});
    },
    showGoToSiteButton() {
      return this.$getSetting('isite::showGoToSiteButton') || false;
    },
    //Site Actions
    actions() {
      let goToSiteUrl = this.$store.state.qsiteApp.baseUrl;

      //define the organization url if there're someone selected
      if (this.quserState.organizationId) {
        let organizationSelected = this.quserState.organizations.find(organization => organization.id == this.quserState.organizationId);
        if (organizationSelected) goToSiteUrl = organizationSelected.url;
      }

      return {
        buttons: [
          //Offline
          {
            vIf: this.$getSetting('isite::offline'),
            name: 'offline',
            label: this.$tr('isite.cms.label.offline'),
            badgeColor: 'orange',
            badgeLabel: this.$store.state.qofflineMaster.pendingRequests,
            props: {
              icon: 'fa-light fa-cloud-slash',
              class: `btn-small`
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'offline')
          },
          //Go To Site
          {
            vIf: this.showGoToSiteButton,
            name: 'goToSite',
            label: this.$tr('isite.cms.configList.goToSite'),
            props: {
              label: this.$tr('isite.cms.showSite'),
              type: 'a',
              id: 'siteActionGoToSite',
              href: goToSiteUrl,
              target: '_blank',
              round: false,
              rounded: true,
              padding: 'xs md'
            }
          },
          //checking
          {
            name: 'checking',
            vIf: (config('app.mode') == 'ipanel') && this.$hasAccess('icheckin.shifts.create'),
            label: this.$tr('icheckin.cms.sidebar.checkin'),
            props: {
              icon: 'fas fa-stopwatch',
              round: true
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'checkin')
          },
          //Chat
          {
            name: 'chat',
            label: 'Chat',
            vIf: (config('app.mode') == 'iadmin') && this.$hasAccess('ichat.conversations.index'),
            badge: this.badge.chat,
            props: {
              icon: 'fa-light fa-message-lines',
              class: 'btn-small'
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'chat')
          },
          //Notifications
          {
            name: 'notifications',
            label: this.$trp('isite.cms.label.notification'),
            badge: this.badge.notification,
            props: {
              icon: 'fa-light fa-bell',
              class: 'btn-small'
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'notification')
          },
          //Help Center
          {
            name: 'helpCenter',
            label: this.$trp('isite.cms.label.helpCenter'),
            vIf: parseInt(this.$getSetting('isite::hcStatus') || '0'),
            props: {
              id: 'siteActionHelpCenter',
              icon: 'fal fa-question-circle'
            },
            menu: {
              actions: [
                {
                  icon: 'fa-light fa-question-circle',
                  label: 'FAQ',
                  action: () => eventBus.emit('toggleHelpSection', { sectionName: 'faq' })
                }
              ]
            }
          },
          // Clear Cache
          {
            name: 'clearCache',
            label: this.$tr('isite.cms.configList.clearCache'),
            props: {
              icon: 'fa-light fa-broom'
            },
            vIf: !this.isAppOffline,
            action: () => this.$router.push({
              name: 'app.update.app',
              query: { fromCache: 1 }
            })
          }
        ],
        menu: [
          //Profile
          {
            name: 'profile',
            props: {
              label: this.$tr('iprofile.cms.sidebar.panelProfile'),
              icon: 'fa-light fa-circle-user',
              round: false,
              square: true,
              align: 'left',
              id: 'profileButton'
            },
            action: () => (this.$route.name != 'user.profile.me') ? this.$router.push({ name: 'user.profile.me' }) : null
          },
          //Settings
          {
            name: 'settings',
            vIf: (config('app.mode') == 'iadmin'),
            props: {
              label: this.$trp('isite.cms.label.setting'),
              icon: 'fa-light fa-folder-gear',
              round: false,
              square: true,
              align: 'left'
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'config')
          },
          //logout
          {
            name: 'settings',
            vIf: (config('app.mode') == 'iadmin') && !this.isAppOffline,
            props: {
              label: this.$tr('isite.cms.configList.signOut'),
              icon: 'fa-light fa-right-from-bracket',
              round: false,
              square: true,
              textColor: 'red',
              align: 'left'
            },
            action: this.logout
          }
        ],
        ...(this.replaceActions || {})
      };
    },
    profileImage() {
      return this.$store.getters['quserAuth/profileImage'];
    }
  },
  methods: {
    init() {
      //Manage badges to button actions
      eventBus.on('header.badge.manage', (response) => {
        Object.keys(response).forEach(name => this.badge[name] = response[name]);
      });
    },
    logout() {
      this.$router.push({ name: 'auth.logout' });
    }
  }
};
</script>
<style lang="scss">
#siteActionscomponent
#profileImage {
  height: 25px;
  width: 25px;
  border-radius: 50%;
}
</style>
