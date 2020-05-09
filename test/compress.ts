#!/usr/bin/env ts-node
import fs from 'fs'
import path from 'path'
import { jsonToString } from '@beenotung/tslib/json'
import { startTimer } from '@beenotung/tslib/node'
import { compress, decompress } from './compress/core'

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
  let file = path.join('data', 'json', name + '.json')
  timer.next('save ' + file)
  let text = JSON.stringify(data)
  // let text = JSON.stringify(data, null, 2)
  fs.writeFileSync(file, text)
}

import { readJsonFileSync } from '@beenotung/tslib/fs'

let input = readJsonFileSync('data.json')
// let sample = 50000
// sample = 3
// sample = 100
// input = Object.fromEntries(Object.entries(input).splice(0, sample))

// import { sample } from './compress/test'
// let input = sample()

// let input = JSON.parse(fs.readFileSync('sample.txt').toString());

save('input', input)

timer.next('prepare json string')
let inputStr = JSON.stringify(input)
let inputStrSorted: string // =  toString(input)

function compare(name: string, input: any, reverse: any) {
  if (!inputStrSorted) {
    inputStrSorted = toString(input)
  }
  let reverseStrSorted = toString(reverse)
  if (inputStrSorted === reverseStrSorted) {
    return
  }
  fs.writeFileSync('input.txt', JSON.stringify(input, null, 2))
  fs.writeFileSync('reverse.txt', JSON.stringify(reverse, null, 2))
  throw new Error('compress/decompress mismatch: ' + name)
}

function test(name: string, c: (o: any) => any, d: (c: any) => any) {
  timer.next(name + '[compress]')
  let output = c(input)
  save(name, output)
  timer.next(name + '[decompress]')
  let reverse = d(output)
  // save('reverse', reverse)
  timer.next(name + '[compare]')
  let reverseStr = JSON.stringify(reverse)
  if (reverseStr === inputStr) {
    return
  }
  console.log('\n  not exact match')
  // compare(name, input, reverse)
}

let cjson = require('compressed-json')
test('compressed-json',
  o => cjson.compress(o),
  c => cjson.decompress(c),
)

// too slow
// let jsonpack = require('jsonpack')
// test('jsonpack',
//   o => jsonpack.pack(o),
//   c => jsonpack.unpack(c),
// )

test('new-impl',
  o => compress(o),
  c => decompress(c),
)

timer.end()

console.log('done.')
