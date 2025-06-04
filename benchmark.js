// @ts-check

import crypto from 'node:crypto'

import { encodeUrl } from 'ab64'
import { flattie } from 'flattie'
import hashObject from 'hash-object'
import stringify from 'json-stringify-deterministic'
import { bench, run, summary } from 'mitata'

import { hash } from 'stable-hash-x'

// this is an example of payload
const payload = {
  url: 'https://example.com/',
  query: {
    screenshot: true,
    ttl: 86_400_000,
    staleTtl: false,
    prerender: 'auto',
    meta: true,
    data: false,
    video: false,
    audio: false,
    pdf: false,
    insights: false,
    iframe: false,
    ping: true,
    headers: {
      'upgrade-insecure-requests': '1',
      dnt: '1',
      accept: '*/*',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en',
    },
  },
}

/**
 * Benchmarking `stable-hash-x` vs. `hash-object` vs. `json-stringify-deterministic`
 *
 * The goal is to represent a real use-case. Because that:
 *
 * - Ensure the input is flatten
 * - Output is base64 URL safe
 * - Sha512 is used as algorithm
 */

/**
 * @param {unknown} obj
 * @returns {string} The hash
 */
const getHashOne = obj =>
  encodeUrl(
    crypto
      .createHash('sha512')
      .update(hash(flattie(obj)))
      .digest('base64'),
  )

/**
 * @param {unknown} obj - The object to hash
 * @returns {string} The hash
 */
const getHashTwo = obj =>
  encodeUrl(
    hashObject(flattie(obj), {
      encoding: 'base64',
      algorithm: 'sha512',
    }),
  )

/**
 * @param {unknown} obj
 * @returns {string} The hash
 */
const getHashThree = obj =>
  encodeUrl(
    crypto
      .createHash('sha512')
      .update(stringify(flattie(obj)))
      .digest('base64'),
  )

summary(() => {
  bench('stable-hash-x', () => getHashOne(payload)).baseline()

  bench('hash-object', () => getHashTwo(payload))

  bench('json-stringify-deterministic', () => getHashThree(payload))
})

await run()
