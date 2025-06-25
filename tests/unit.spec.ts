/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-magic-numbers */

import { runInNewContext } from 'node:vm'

import { hash } from 'stable-hash-x'

describe(`Booleans`, () => {
  test(`Simple check`, () => {
    expect(hash(true)).toEqual(hash(true))
    expect(hash(false)).not.toEqual(hash(true))
    expect(hash(false)).toEqual(hash(false))
  })
})

describe(`Strings`, () => {
  test(`Empty strings are equal`, () => {
    expect(hash('')).toEqual(hash(''))
  })
  test(`Empty string is not equal to other falsy values`, () => {
    const emptyString = hash('')
    expect(emptyString).not.toEqual(
      // @ts-expect-error -- intended
      hash(),
    )
    expect(emptyString).not.toEqual(hash(0))
    expect(emptyString).not.toEqual(hash(null))
    expect(emptyString).not.toEqual(hash(false))
  })
  test(`One space is not equal to many spaces`, () => {
    expect(hash(' ')).not.toEqual(hash('  '))
    expect(hash(' ')).not.toEqual(hash('           '))
  })
  test(`Basic/Common characters `, () => {
    expect(
      hash(
        'Check out useSWR (npm i swr) for easy, robust data fetching in React.',
      ),
    ).toEqual(
      hash(
        'Check out useSWR (npm i swr) for easy, robust data fetching in React.',
      ),
    )

    expect(hash('  af jFJI   F89fj32fajsdjfaszf0_F0j2fa0')).toEqual(
      hash('  af jFJI   F89fj32fajsdjfaszf0_F0j2fa0'),
    )

    expect(hash('23ja8!@#xc,m,/?@1mfjaDFJIPMal921m')).not.toEqual(
      '23ja8!@#xc,m,/?@1m',
    )
  })

  test(`Unconventional characters`, () => {
    expect(hash('u̝̚s̞ͨe͚̦͋ͣr̲̞͋͋ ͕̩̹͌ͯ͆ì̺̜̬̏̽ṇ̞̪͍̎͊̉͆p̼̭͎̆̐̄ͬͅȗ̬͙̗͍̟ͩ̒̃̚t͍͓̻̝̝́̾̄̐̔ś̗̹͇͉̙̟̔ͪ͑͛̐ ̥̞͚͖̪͖̎̾̈͑̆̾c̪̘̬͍̤͚͊̆͑̋̓̔a̙̠̻̬̙ͩ͒ͧ͂̄̊ͅn̞͚̠̩̬ͭ͌͑͑̍ ͍̟̲͍̼ͩ̉͒ͬ̚b̦̞̭̹ͪͦ̍ͦȅ̘̟͇͖̿̉̚ ̯̻̠ͩͥͣw̯̮͙ͫ̾̅i̦͈͛̅l̖̘ͯ͗d͔̈́')).toEqual(
      hash('u̝̚s̞ͨe͚̦͋ͣr̲̞͋͋ ͕̩̹͌ͯ͆ì̺̜̬̏̽ṇ̞̪͍̎͊̉͆p̼̭͎̆̐̄ͬͅȗ̬͙̗͍̟ͩ̒̃̚t͍͓̻̝̝́̾̄̐̔ś̗̹͇͉̙̟̔ͪ͑͛̐ ̥̞͚͖̪͖̎̾̈͑̆̾c̪̘̬͍̤͚͊̆͑̋̓̔a̙̠̻̬̙ͩ͒ͧ͂̄̊ͅn̞͚̠̩̬ͭ͌͑͑̍ ͍̟̲͍̼ͩ̉͒ͬ̚b̦̞̭̹ͪͦ̍ͦȅ̘̟͇͖̿̉̚ ̯̻̠ͩͥͣw̯̮͙ͫ̾̅i̦͈͛̅l̖̘ͯ͗d͔̈́'),
    )

    expect(hash('u̝̚s̞ͨe͚̦͋ͣr̲̞͋͋ ͕̩̹͌ͯ͆ì̺̜̬̏̽ṇ̞̪͍̎͊̉͆p̼̭͎̆̐̄ͬͅȗ̬͙̗͍̟ͩ̒̃̚t͍͓̻̝̝́̾̄̐̔ś̗̹͇͉̙̟̔ͪ͑͛̐ ̥̞͚͖̪͖̎̾̈͑̆̾c̪̘̬͍̤͚͊̆͑̋̓̔a̙̠̻̬̙ͩ͒ͧ͂̄̊ͅn̞͚̠̩̬ͭ͌͑͑̍ ͍̟̲͍̼ͩ̉͒ͬ̚b̦̞̭̹ͪͦ̍ͦȅ̘̟͇͖̿̉̚ ̯̻̠ͩͥͣw̯̮͙ͫ̾̅i̦͈͛̅l̖̘ͯ͗d͔̈́')).not.toEqual(
      hash('u̝̚s̞ͨe͚̦͋ͣr̲̞͋͋ ͕̩̹͌ͯ͆ì̺̜̬̏̽ṇ̞̪͍̎͊̉͆p̼̭͎̆̐̄ͬͅȗ̬͙̗͍̟ͩ̒̃̚t͍͓̻̝̝́̾̄̐̔ś̗̹͇͉̙̟̔ͪ͑͛̐ ̥̞͚͖̪͖̎̾̈͑̆̾c̪̘̬͍̤͚͊̆͑̋̓̔a̙̠̻̬̙ͩ͒ͧ͂̄̊ͅn̞͚̠̩̬ͭ͌͑͑̍ ͍̟̲͍̼ͩ̉͒ͬ̚b̦̞̭̹ͪͦ̍ͦȅ̘̟͇͖̿̉̚'),
    )
  })
})

describe(`Numbers including BigInt`, () => {
  test(`SheNaNigans`, () => {
    expect(hash(Number.NaN)).toEqual(hash(Number.NaN))
    expect(hash(Number.NaN)).not.toEqual(hash(Number.NaN.toString()))
    expect(hash(1 + Number.NaN)).toEqual(hash(Number.NaN + 1))
    expect(hash('1' + Number.NaN)).not.toEqual(hash(Number.NaN + '1'))
  })
  test(`Integers`, () => {
    expect(hash(2 + 1)).toEqual(hash(2 + 1))
    expect(hash(-3)).not.toEqual(hash('-3'))
    expect(hash(123)).not.toEqual(hash(1123))
    expect(hash(400_000)).toEqual(hash(400_000))
  })
  test(`Floats`, () => {
    expect(hash(0.000_001)).toEqual(hash(0.000_001))
    expect(hash(-0.000_001)).not.toEqual(hash(0.000_001))
    expect(hash(9_999_999.999_999_9)).not.toEqual(hash(10_000_000))
  })

  test(`BigInts`, () => {
    expect(hash(BigInt(8))).toEqual(hash(BigInt(8)))
    //expect(hash( BigInt(8) )).not.toEqual(hash(8)); This fails but that may be intentional;
    expect(
      hash(
        BigInt(
          // eslint-disable-next-line no-loss-of-precision
          99_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999,
        ),
      ),
    ).not.toEqual(
      BigInt(
        // eslint-disable-next-line no-loss-of-precision
        77_777_777_777_777_777_777_777_777_777_777_777_777_777_777_777_777_777,
      ),
    )
  })
})

describe(`Arrays`, () => {
  test(`Empty arrays are equal`, () => {
    expect(hash([])).toEqual(hash([]))
  })
  test(`Simple arrays with primitives`, () => {
    expect(hash([1, 2, 3])).toEqual(hash([1, 2, 3]))
    expect(hash([1, 2])).not.toEqual(hash([1, 2, 3]))
    expect(hash(['1', 2, 3])).not.toEqual(hash([1, 2, 3]))
    expect(hash(['1', '2', '3'])).toEqual(hash(['1', '2', '3']))
    expect(hash([1, 3, 2])).not.toEqual(hash([1, 2, 3]))
    expect(hash([true, true, true])).not.toEqual(hash([0, 0, 0]))
    expect(hash([true, true, true])).toEqual(hash([true, true, true]))
  })
  test(`Pseudo arrays and empty values`, () => {
    const pseudo = {
      '0': 'A',
      '1': 'B',
      '2': 'C',
      length: 3,
      constructor: Array,
    }
    //expect(hash(pseudo)).not.toEqual(hash(["A","B","C"])) This fails (yes it's super contrived 🤪)
    expect(hash(pseudo)).toEqual(hash(pseudo))

    const arrayWithExtraStuff = [1, 2, 3] as number[] & {
      extra: string
      extraStuff: []
      evenMoreExtraStuff: { nested: string }
    }
    arrayWithExtraStuff.extra = 'Stuff'
    arrayWithExtraStuff.extraStuff = []
    arrayWithExtraStuff.evenMoreExtraStuff = { nested: 'extraStuff' }
    //expect(hash(arrayWithExtraStuff)).not.toEqual(hash([1, 2, 3]))  This fails (yep still kinda contrived 🙃)

    // const anotherArrayWithExtraStuff = Object.assign([1, 2, 3], {
    //   extra: 'Stuff',
    // })
    // expect(hash(anotherArrayWithExtraStuff)).not.toEqual(hash([1,2,3]))
    // Ok maybe I'm just getting silly 😂 but this fails. All joking aside, any robust way to
    // solve these would probably not be worth the hit to performance because these are very unusual cases

    const arrayWithEmptyIndices = [1, 2]
    arrayWithEmptyIndices[100] = 3
    expect(arrayWithEmptyIndices).not.toEqual([1, 2, 3])
  })
})

describe(`POJOs`, () => {
  test(`Empty objects are equal`, () => {
    expect(hash({})).toEqual(hash({}))
  })
  test(`Empty object not equal to empty array`, () => {
    expect(hash({})).not.toEqual(hash([]))
  })
  test(`Objects with simple k:v pairs where v is a primitive`, () => {
    expect(hash({ hi: 'hello' })).toEqual(hash({ hi: 'hello' }))
    expect(hash({ hi: 'hello' })).not.toEqual(hash({ bye: 'goodbye' }))

    const pretendRecord = {
      name: 'Muffin Man',
      street: 'Drury Ln',
      crimesCommitted: 13,
      description: '⚠ USE EXTREME CAUTION WHEN APPROACHING ⚠',
      currentlyUnderInvestigation: true,
    }
    expect(hash(pretendRecord)).toEqual(
      hash({
        name: 'Muffin Man',
        street: 'Drury Ln',
        crimesCommitted: 13,
        description: '⚠ USE EXTREME CAUTION WHEN APPROACHING ⚠',
        currentlyUnderInvestigation: true,
      }),
    )

    expect(hash(pretendRecord)).not.toEqual(
      hash({
        name: 'Muffin Man',
        street: 'Drury Ln',
        crimesCommitted: 14,
        description: '⚠ USE EXTREME CAUTION WHEN APPROACHING ⚠',
        currentlyUnderInvestigation: true,
      }),
    )

    expect(hash(pretendRecord)).not.toEqual(
      hash({
        name: 'Muffin Man',
        street: 'Drury Ln',
        crimesCommitted: 13,
        currentlyUnderInvestigation: true,
      }),
    )
  })
  test(`Stringified json not equal to itself in parsed form`, () => {
    expect(hash({ use: 'SWR' })).not.toEqual(
      hash(JSON.stringify({ use: 'SWR' })),
    )
  })
  test(`Order doesn't matter in non-array object`, () => {
    expect(hash({ first: '1', second: '2', third: '3' })).toEqual(
      hash({ second: '2', third: '3', first: '1' }),
    )
  })
  test(`Objects with nested data structures`, () => {
    expect(hash({ a: { b: { c: {} } } })).toEqual(hash({ a: { b: { c: {} } } }))
    expect(hash({ a: { b: { c: {} } } })).not.toEqual(
      hash({ a: { b: { z: {} } } }),
    )
    expect(hash({ a: { b: { c: {} } } })).not.toEqual(
      hash({ a: { b: { c: { d: {} } } } }),
    )

    expect(
      hash({
        a: [1, 2, 3],
        b: {
          c: [4, 5, 6],
          d: [{ e: 7 }, { g: 8 }],
        },
      }),
    ).toEqual(
      hash({
        a: [1, 2, 3],
        b: {
          c: [4, 5, 6],
          d: [{ e: 7 }, { g: 8 }],
        },
      }),
    )

    expect(
      hash({
        a: [1, 2, 3],
        b: {
          c: [4, 5, 6],
          d: [{ e: 7 }, { g: 8 }],
        },
      }),
    ).not.toEqual(
      hash({
        a: [1, 2, 3],
        b: {
          c: [4, 5, 6],
          d: [{ e: 'f' }, { g: 'h' }],
        },
      }),
    )
  })
})

describe(`The Func-y Bunch featuring The Referential Squad`, () => {
  test(`Functions`, () => {
    expect(hash(() => {})).not.toEqual(hash(() => {}))

    function emptyFunc() {}
    function anotherEmptyFunc() {}
    expect(hash(emptyFunc)).toEqual(hash(emptyFunc))
    expect(hash(emptyFunc)).not.toEqual(hash(anotherEmptyFunc))

    function sum(a: number, b: number) {
      return a + b
    }
    function alsoSum(a: number, b: number) {
      return a + b
    }
    expect(hash(sum)).toEqual(hash(sum))
    expect(hash(sum)).not.toEqual(hash(alsoSum))

    const functionHolder = { sum }
    expect(hash(functionHolder.sum)).toEqual(hash(functionHolder.sum))
    expect(hash(functionHolder.sum)).toEqual(hash(sum))
    expect(hash(functionHolder)).toEqual(hash(functionHolder))
  })

  test(`Dates`, () => {
    const now = new Date()
    expect(hash(now)).toEqual(hash(now))

    const actualDateObject = new Date('2022-06-25T01:55:27.743Z')
    const dateString = '2022-06-25T01:55:27.743Z'
    expect(hash(actualDateObject)).not.toEqual(hash(dateString))
    expect(hash(now)).not.toEqual(hash(actualDateObject))
  })

  test(`Regex`, () => {
    expect(hash(/hello/)).toEqual(hash(/hello/))
    expect(hash(/hello/)).not.toEqual(hash('hello'))
    expect(hash(/hello/i)).not.toEqual(hash(/HELLO/i))
  })

  test(`Symbols`, () => {
    const test = Symbol('test')
    expect(hash(test)).not.toEqual(hash('test'))
    expect(hash(test)).not.toEqual(hash(Symbol()))
    expect(test).not.toEqual(hash(test))
    expect(hash(test)).toEqual(hash(test))
  })

  test(`Proxies`, () => {
    const originalObject = { key: 'value' }
    const noOpProxy = new Proxy(originalObject, {})
    expect(hash(noOpProxy)).toEqual(hash(originalObject))
    expect(hash(noOpProxy)).toEqual(hash(noOpProxy))

    const anotherNoOpProxy = new Proxy(originalObject, {})
    expect(hash(anotherNoOpProxy)).toEqual(hash(noOpProxy))

    const rejectionProxy = new Proxy(originalObject, {
      get() {
        return 'nope'
      },
    })
    expect(hash(rejectionProxy)).not.toEqual(hash(originalObject))
    expect(hash(rejectionProxy)).toEqual(hash(rejectionProxy))
  })

  test(`Classes`, () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class Cat {}
    expect(hash(Cat)).toEqual(hash(Cat))

    const kitty = new Cat()
    const anotherKitty = new Cat()
    expect(hash(kitty)).toEqual(hash(kitty))
    expect(hash(kitty)).not.toEqual(hash(anotherKitty))
  })

  test(`Sets`, () => {
    const one = new Set([1, 1, 1, 1, 1, 1, 1, 1, 1])
    expect(hash(one)).toEqual(hash(one))
    expect(hash(one)).not.toEqual(hash([1]))

    const anothaOne = new Set([1, 1, 1, 1, 1, 1, 1, 1, 1])
    expect(hash(anothaOne)).toEqual(hash(anothaOne))
    expect(hash(one)).not.toEqual(hash(anothaOne))
  })

  test(`Buffers`, () => {
    const emptyBuffer = Buffer.alloc(10)
    const anotherEmptyBuffer = Buffer.alloc(10)
    expect(hash(emptyBuffer)).toEqual(hash(emptyBuffer))
    expect(hash(emptyBuffer)).not.toEqual(hash(anotherEmptyBuffer))

    const stringBuffer = Buffer.from(
      'Host with Vercel to deploy the future of modern, performant web apps that scale with ease.',
      'utf8',
    )
    const copy = Buffer.from(
      'Host with Vercel to deploy the future of modern, performant web apps that scale with ease.',
      'utf8',
    )
    expect(hash(stringBuffer)).toEqual(hash(stringBuffer))
    expect(hash(stringBuffer)).not.toEqual(hash(copy))
  })

  test(`Maps`, () => {
    const catMap = new Map<string, string>()
    const catMap2 = new Map<string, string>()
    catMap.set('meowLoudly', 'at 3am')
    catMap2.set('meowLoudly', 'at 3am')

    expect(hash(catMap)).toEqual(hash(catMap))
    expect(hash(catMap)).not.toEqual(hash(catMap2))
  })

  test('across realms', () => {
    const obj1 = {
      a: 1,
      b: new Date('2022-06-25T01:55:27.743Z'),
      c: /test/,
      f: Symbol('test'),
    }
    const obj2 = runInNewContext(`({
      a: 1,
      b: new Date('2022-06-25T01:55:27.743Z'),
      c: /test/,
      f: Symbol('test'),
    })`) as typeof obj1
    expect(obj1).not.toEqual(obj2)
    expect(hash(obj1)).toEqual(hash(obj2))
  })
})
