import {openURL, uid} from "quasar";
//import Vue from 'vue';
import {AxiosInstance} from "axios";

//[ptc]
//declare module 'vue/types/vue' {
  export interface TmpVue {
    $alert: any,
    $array: any[],
    $date: any,
    $helper: any,
    $cache: any,
    $lodash: any,
    $remember: any,
    $tour: any,
    $hook: any,
    $notification: any,
    $clone: <T>(dataToClone: T) => T,
    $crud: any,
    $openUrl: typeof openURL,
    $eventBus: any,
    $filter: any,
    $uid: typeof uid,
    $tr: any,
    $axios: AxiosInstance,
    $auth: any
  }
//}
