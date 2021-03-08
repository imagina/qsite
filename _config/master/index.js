import {findValue} from '@imagina/qsite/_plugins'

export default function (value = '', fallback = null) {
  let indexConfig = process.env.isExtension ?
    require('@imagina/qsite/_config/master/extension/index').default :
    require('@imagina/qsite/_config/master/application/index').default

  //Search Value
  let result = findValue(value, indexConfig()) || fallback

  //Response
  return result
}
