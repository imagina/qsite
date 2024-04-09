import {openURL, uid} from "quasar";
import {AxiosInstance} from "axios";

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
