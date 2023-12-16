<template>
  <div class="step-register">
    <message
      ref="modalWizard"
      @message="goOff"
    />
    <div class="auth-user tw-mx-auto" v-if="isActive">
      <div class="step-title">
        {{ $tr('isite.cms.sessionFound')}}!
      </div>
      <div v-show="userAuth.userData.fullName">
        <div class="selected-label">{{ $tr('isite.cms.label.user') }}</div>
        <div class="selected-box">
          {{userAuth.userData.fullName}}
        </div>
      </div>
      <div class="selected-label">{{ $tr('isite.cms.label.email') }}</div>
      <div class="selected-box">
        {{userAuth.userData.email}}
      </div>
      <hr class="tw-my-5">
      <div class="text-center q-gutter-md">
        <q-btn  rounded outline
                class="tw-text-center "
                no-caps
                color="primary"
                size="md"
                @click="createUser()">
                {{ $tr('isite.cms.label.createNewAccount') }}
        </q-btn>
        <q-btn  rounded unelevated
                class="tw-text-center "
                no-caps
                color="primary"
                size="md"
                @click="showModal(2)">
          {{ $tr('isite.cms.label.continueUser') }}
        </q-btn>
      </div>
    </div>
    <div class="auth-register tw-flex tw-mx-auto tw-flex-col" v-else>
      <!--Auth Type-->
      <div class="auth-register-internal">
        <!--Register-->
        <register-form @logged="checkAfterLogin()" class="full-width"
                       rolesToRegister="iprofile::rolesToRegisterInWizard"/>
      </div>
      <!--Auth social-->
      <div class="auth-register-social h-auto" v-if="withAuthSocial">
        <q-separator class="tw-mb-6"/>
        <!--Actions-->
        <div class="row justify-center q-gutter-sm">
          <google-auth @logged="checkAfterLogin"/>
          <facebook-auth @logged="checkAfterLogin"/>
        </div>
      </div>
    </div>

    <div v-if="stepContent" class="step-sidebar ">
      <div class="step-register-text">
        <div class="tw-text-xl lg:tw-text-3xl xl:tw-text-4xl tw-px-8 tw-text-center tw-pb-6 tw-font-bold">
          {{ stepContent.title }}
        </div>
        <div class="register-description tw-text-md xl:tw-text-lg tw-px-6 tw-pb-4 tw-text-justify"
             v-html="stepContent.description">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import storeStepWizard from './store/index.ts';
import {STEP_NAME_REGISTER} from './model/constant.js';
import registerForm from '@imagina/quser/_components/auth/register'
import facebookAuth from '@imagina/quser/_components/socialAuth/facebook'
import googleAuth from '@imagina/quser/_components/socialAuth/google'
import microsoftAuth from '@imagina/quser/_components/socialAuth/microsoft'
import axios from "axios"
import moment from "moment";
import momenttz from 'moment-timezone';
import message from '@imagina/qsite/_components/organizations/wizard/modals/message'

export default {
  components: {
    registerForm,
    facebookAuth,
    googleAuth,
    microsoftAuth,
    message
  },
  props: {
    info: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      stepContent: '',
      userAuth: this.$store.state.quserAuth,
      isActive: false,
      activeRegister: false,
      choice: '',
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.getStepInfo();
      this.authActive();
    })
  },
  computed: {
    //Validate if load social auth
    withAuthSocial() {
      let hasSetting = parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUsersWithSocialNetworks'))
      return hasSetting/* && (config('app.mode') == 'ipanel'))*/ ? true : false
    },
    microsoftClient() {
      return this.$store.getters['qsiteApp/getSettingValueByName']('isite::microsoftClientId')
    },
  },
  methods: {
    checkAfterLogin() {
      //preguntar por setting para validar timeZone
      this.checkTimeZone()
      //else
      //this.redirectAfterLogin()
      this.showModal(1);
    },
    checkTimeZone() {
      //Modal persistent...
      //si no tiene timezone abre modal - Seleccione timezone - requestAsync put actualizando timeZone
      // check si guardo timezone...
      axios.defaults.params.setting.timezone = moment.tz.guess()
      // redirectAfterLogin
    },
    //Redirect after user be logged
    redirectAfterLogin() {
      try {
        const user = this.$store.getters["quserAuth/user"];
        if (user.email) {
          this.$emit("update", {active: true, info: {email: user.email}});
        }
      } catch (error) {
        console.log('error en user');
      }
    },
    getStepInfo() {
      this.stepContent = this.info.find((item) => item.systemName === STEP_NAME_REGISTER);
    },
    async continueUser() {
      try {
        if (this.userAuth.userData.email) {
          this.$emit("update", {active: true, info: {email: this.userAuth.userData.email}});
        }
      } catch (error) {
        console.log('error en user');
      }
    },
    createUser() {
      this.activeRegister = !this.activeRegister;
      this.authActive();
    },
    authActive() {
      if (this.userAuth.authenticated && this.userAuth.organizations.length==0) {
        if(this.activeRegister) {
          this.isActive = false
        }else {
          this.isActive = true
        }
      }
    },
    async showModal(type) {
      this.choice = type;
      await this.$refs.modalWizard.showModalWizard();
    },
    goOff() {
      if(this.choice == 1 ){
        this.redirectAfterLogin();
      }
      if(this.choice == 2 ){
        this.continueUser();
      }
    },
  }
}
</script>
<style>
.step-register .step-register-text {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.step-register .box {
  @apply tw-shadow-none;
}

.step-register .box-title {
  color: var(--q-color-blue-grey-9);
}

.step-register .auth-register {
  max-width: 300px;
}
.step-register .auth-user {
  max-width: 500px;
}

.step-register .auth-register .q-stepper__content {
  width: auto !important;
  min-height: auto !important;
  display: contents;
}

#formContent + .text-center.full-width {
  display: none;
}

.step-register .q-stepper__content.q-panel-parent {
  padding: 0 !important;
}

.step-register .register-description ul {
  @apply tw-ml-3 tw-mt-3;
}

.step-register .register-description ul li {
  @apply tw-flex tw-mb-2;
}

.step-register .register-description ul li:before {
  content: '\e5ca';
  margin-right: 10px;
  font-size: 24px;
  font-family: "Material Icons";
  color: var(--q-color-primary);
}

.step-register {
  /*@apply tw-flex tw-min-h-screen tw-flex-col tw-justify-center;
  margin-top: -95px;*/
}
#wizardOrganization .page-wizard > .q-stepper--horizontal > .q-stepper__content {
  padding-top: 10rem !important;
}
</style>
