// @ts-check

import crypto from 'node:crypto'

import { encodeUrl } from 'ab64'
import { flattie } from 'flattie'
import hashObject from 'hash-obj'
import stringify from 'json-stringify-deterministic'
import bench from 'nanobench'

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
 * Benchmarking `hash-obj` vs. `stable-hash`
 *
 * The goal is to represent a real use-case. Because that:
 *
 * - Ensure the input is flatten
 * - Output is base64 URL safe
 * - Sha512 is used as algorithm
 *
 * @param {object} obj - The object to hash
 * @returns {string} The hash
 */
const getHashOne = obj =>
  encodeUrl(
    hashObject(flattie(obj), {
      encoding: 'base64',
      algorithm: 'sha512',
    }),
  )

const getHashTwo = obj =>
  encodeUrl(
    crypto
      .createHash('sha512')
      .update(hash(flattie(obj)))
      .digest('base64'),
  )

const getHashThree = obj =>
  encodeUrl(
    crypto
      .createHash('sha512')
      .update(stringify(flattie(obj)))
      .digest('base64'),
  )

const count = 200_000

bench('`hash-obj` 200.000 times', function (b) {
  b.start()

  for (let i = 0; i < count; i++) {
    getHashOne(payload)
  }

  b.end()
})

bench('`stable-hash` 200.000 times', function (b) {
  b.start()

  for (let i = 0; i < count; i++) {
    getHashTwo(payload)
  }

  b.end()
})

bench('`json-stringify-deterministic` 200.000 times', function (b) {
  b.start()

  for (let i = 0; i < count; i++) {
    getHashThree(payload)
  }

  b.end()
})
