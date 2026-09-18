import { pricing } from '@/data/site'

/**
 * Price formatting helpers.
 *
 * Every figure on this site is quoted in US dollars, per vehicle: the number
 * shown is the number charged. There is no second currency and no conversion
 * step — the values in `src/data/site.js` are the ones that appear on the
 * invoice, so a price never has to be "read as" something else.
 */

/** 57 -> "$57" */
export function money(value) {
  if (value === null || value === undefined || value === '') return ''
  return `${pricing.currencySymbol}${Number(value).toLocaleString('en-US')}`
}

/**
 * Like `money`, but a price we have not been given yet reads as "On request"
 * instead of vanishing — used on route tables where the row still matters.
 */
export function moneyOr(value, fallback = 'On request') {
  return money(value) || fallback
}
