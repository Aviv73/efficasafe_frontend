import Vue from 'vue'
import vueMoment from 'vue-moment'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)

Vue.use(vueMoment)

Vue.filter('ref-txt', (val) => {
  const doiIdx = val.indexOf('doi')
  if (doiIdx !== -1) {
    return val.substring(0, doiIdx).trim()
  }
  const PmidIdx = val.indexOf('PMID')
  if (PmidIdx !== -1) {
    return val.substring(0, PmidIdx).trim()
  }
  return val
})

Vue.filter('capitalize', (val) => {
  return val.charAt(0).toUpperCase() + val.slice(1)
})

Vue.filter('remove-ending-dot', (val) => {
  const lastChar = val.charAt(val.length - 1)
  if (lastChar !== '.') return val
  return val.substring(0, val.length - 1)
})

Vue.filter('display-snake-case', (val) => {
  return val.replace(/_/g, ' ')
})

Vue.filter('timeFilter', (val, format) => {
  if (!isValidDate(val)) return 'Invalid Date'
  return format ? dayjs(val).format(format) : dayjs(val).toString()
})

function isValidDate(time) {
  try {
    if (!time) return false
    const dateItem = dayjs(time)
    if (!dateItem.isValid()) return false
    return true
  } catch (err) {
    return false
  }
}
