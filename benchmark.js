// @ts-check

import crypto from 'node:crypto'

import hashObject from 'hash-object'
import stringify from 'json-stringify-deterministic'
import { stableHash } from 'stable-hash'
import { Bench } from 'tinybench'

import { stableHash as hash } from './lib/index.js'

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
 * Benchmarking `stable-hash-x` vs. `hash-object` vs.
 * `json-stringify-deterministic` vs. `stable-hash`
 *
 * The goal is to represent a real use-case. Because that:
 *
 * - Output is base64 URL safe
 * - Sha512 is used as algorithm
 */

/**
 * @param {object} obj
 * @returns {string} The hash
 */
const getHashOne = obj =>
  crypto.createHash('sha512').update(hash(obj)).digest('base64url')

/**
 * @param {object} obj - The object to hash
 * @returns {string} The hash
 */
const getHashTwo = obj =>
  hashObject(obj, {
    encoding: 'base64url',
    algorithm: 'sha512',
  })

/**
 * @param {object} obj
 * @returns {string} The hash
 */
const getHashThree = obj =>
  crypto.createHash('sha512').update(stringify(obj)).digest('base64url')

/**
 * @param {object} obj
 * @returns {string} The hash
 */
const getHashFour = obj =>
  crypto.createHash('sha512').update(stableHash(obj)).digest('base64url')

const bench = new Bench()

bench
  .add('stable-hash-x', () => getHashOne(payload))
  .add('hash-object', () => getHashTwo(payload))
  .add('json-stringify-deterministic', () => getHashThree(payload))
  .add('stable-hash', () => getHashFour(payload))

await bench.run()

console.table(bench.table())
