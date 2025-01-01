#!/usr/bin/env ts-node
// tslint:disable no-var-requires
import { jsonToString } from '@beenotung/tslib/json'
import { startTimer } from '@beenotung/tslib/timer'
import fs from 'fs'
import path from 'path'
import { compress, decompress } from '../src/core'

const timer = startTimer('load test data')

function toString(data: any) {
  let text = jsonToString(data)
  // console.log('== text ==')
  // console.log(text)
  // console.log('=====')
  // console.log({text})
  data = JSON.parse(text)
  text = JSON.stringify(data, null, 2)
  return text
}

function save(name: string, data: any) {
  const file = path.join('data', name + '.json')
  timer.next('save ' + file)
  const text = typeof data === 'string' ? data : JSON.stringify(data)
  // let text = JSON.stringify(data, null, 2)
  fs.writeFileSync(file, text)
}

import { readJsonFileSync } from '@beenotung/tslib/fs'

let input = readJsonFileSync('data.json')
let sample = 100000
sample = 50000
sample = 10000
sample = 2000
sample = 1000
sample = 100
sample = 10
input = Object.fromEntries(Object.entries(input).splice(0, sample))

// import { sample } from './compress/test'
// let input = sample()

// let input = JSON.parse(fs.readFileSync('sample.txt').toString());

timer.next('prepare json string')
const inputStr = JSON.stringify(input)
let inputStrSorted: string // =  toString(input)

// tslint:disable-next-line no-unused-declaration
function compare(name: string, input: any, reverse: any) {
  if (!inputStrSorted) {
    inputStrSorted = toString(input)
  }
  const reverseStrSorted = toString(reverse)
  if (inputStrSorted === reverseStrSorted) {
    return
  }
  fs.writeFileSync('input.txt', JSON.stringify(input, null, 2))
  fs.writeFileSync('reverse.txt', JSON.stringify(reverse, null, 2))
  throw new Error('compress/decompress mismatch: ' + name)
}

function test(name: string, c: (o: any) => any, d: (c: any) => any) {
  timer.next('--------')
  timer.next(name + '[compress]')
  const output = c(input)
  save(name, output)
  if (!'compress only') {
    return
  }
  timer.next(name + '[decompress]')
  const reverse = d(output)
  // save('reverse', reverse)
  // skip to avoid out-of-memory error for large sample
  if (!'skip compare') {
    return
  }
  timer.next(name + '[compare]')
  const reverseStr = JSON.stringify(reverse)
  if (reverseStr === inputStr) {
    return
  }
  console.log('\n  not exact match')
  // compare(name, input, reverse)
}

test(
  'JSON',
  o => JSON.stringify(o),
  c => JSON.parse(c),
)

const cjson = require('compressed-json')
test(
  'compressed-json',
  o => cjson.compress(o),
  c => cjson.decompress(c),
)

// too slow
const jsonpack = require('jsonpack')
test(
  'jsonpack',
  o => jsonpack.pack(o),
  c => jsonpack.unpack(c),
)

test(
  'compress-json',
  o => compress(o),
  c => decompress(c),
)

timer.end()

console.log('done.')
