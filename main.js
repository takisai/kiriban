/*
Copyright (c) 2020 takisai
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/
'use strict';

// dgebi :: String -> Maybe Element
const dgebi = id => document.getElementById(id);

// send :: () -> ()
const send = () => {
    const form = document.input; // form :: Object
    // numBegin :: Maybe NaturalNumber;  numEnd :: Maybe NaturalNumber
    const numBegin = parseInt(form.number_begin.value, 10);
    const numEnd = parseInt(form.number_end.value, 10);
    // digitBegin :: Maybe NaturalNumber;  digitEnd :: Maybe NaturalNumber
    const digitBegin = parseInt(form.digit_begin.value, 10);
    const digitEnd = parseInt(form.digit_end.value, 10);
    // baseBegin :: Maybe NaturalNumber;  baseEnd :: Maybe NaturalNumber
    const baseBegin = parseInt(form.base_begin.value, 10);
    const baseEnd = parseInt(form.base_end.value, 10);
    const isPure = form.is_pure1.checked; // isPure :: Bool
    // pure2 :: Maybe NaturalNumber
    const pure2 = parseInt(form.pure2.value, 10);
    const isRepdigit = form.is_repdigit.checked; // isRepdigit :: Bool
    const isSeqdigit = form.is_seqdigit.checked; // isSeqdigit :: Bool

    // inputLocate :: [String]
    const inputLocate = [
        'number_begin',
        'number_end',
        'digit_begin',
        'digit_end',
        'base_begin',
        'base_end',
        'pure2'
    ];
    if(inputLocate.some(x => dgebi(x).className === 'background-color_pink')) {
        alert('不正な入力です');
        return;
    }

    // inversePowFloor :: (Number, Number) -> Number
    const inversePowFloor = (x, y) => {
        const tmp = Math.round(x ** (1 / y)); // tmp :: NaturalNumber
        return tmp ** y <= x ? tmp : tmp - 1;
    };

    // searchBegin :: NaturalNumber -> NaturalNumber
    const searchBegin = n => {
        // fromDigit :: NaturalNumber
        const fromDigit = isNaN(digitEnd)
                ? 2
                : inversePowFloor(n, digitEnd) + 1;
        // fromBase :: NaturalNumber
        const fromBase = isNaN(baseBegin) ? 2 : baseBegin;
        return Math.max(fromDigit, fromBase);
    };
    // searchEnd :: NaturalNumber -> NaturalNumber
    const searchEnd = n => {
        // db :: NaturalNumber
        const db = isNaN(digitBegin) ? 2 : digitBegin - 1;
        // fromDigit :: NaturalNumber
        const fromDigit = inversePowFloor(n, db);
        // fromBase :: NaturalNumber
        const fromBase = isNaN(baseEnd) ? Math.floor(n ** 0.5) : baseEnd;
        return Math.min(fromDigit, fromBase);
    };

    // insert :: (NaturalNumber, [Object]) -> ()
    const insert = (num, object) => {
        if(object.length === 0) return;
        const element = document.createElement('li'); // element :: Element
        // formatted :: [String]
        const formatted = object.map(x => {
            const joined = x.item.map(t => `&lt;${t}&gt;`).join('');
            return `<li>= ${joined}<sub>(${x.base})</sub></li>`;
        });
        element.innerHTML = `${num}<ul>${formatted.join('')}</ul>`;
        dgebi('result').appendChild(element);
    };

    // check :: NaturalNumber -> ()
    const check = n => {
        const max = searchEnd(n); // max :: NaturalNumber
        const ret = []; // ret :: [String]
        for(let i = searchBegin(n); i <= max; i++) { // i :: NaturalNumber
            let t = n; // t :: NaturalNumber
            const digs = []; // digs :: [NaturalNumber]
            while(t > 0) {
                digs.unshift(t % i);
                t = Math.floor(t / i);
            }

            if(isPure) {
                if(digs[1] === 0 || (!isNaN(pure2) && pure2 <= digs.length)) {
                    let j; // j :: NaturalNumber
                    for(j = 2; j < digs.length; j++) {
                        if(digs[j] > 0) break;
                    }
                    if(j === digs.length) {
                        ret.push({base: i, item: digs});
                        continue;
                    }
                }
            }
            if(isRepdigit && digs.every(x => digs[0] === x)) {
                ret.push({base: i, item: digs});
                continue;
            }
            if(isSeqdigit && digs.every((x, i) => x === i + 1)) {
                ret.push({base: i, item: digs});
                continue;
            }
        }
        ret.sort((a, b) => a.base - b.base);
        insert(n, ret);
    };

    dgebi('result').innerHTML = '';
    // console.assert(!isNaN(numBegin) || !isNaN(numEnd));
    for(let i = numBegin; i <= numEnd; i++) { // i :: NaturalNumber
        check(i);
    }
};

// formCheck :: Bool -> Object -> ()
const formCheck = mode => event => {
    const value = document.input[event.target.name].value; // value :: String
    const regex = mode ? /^\d*$/ : /^\d+$/; // regex :: RegExp
    if(regex.test(value)) {
        dgebi(event.target.id).className = 'background-color_white';
    } else {
        dgebi(event.target.id).className = 'background-color_pink';
    }
}

dgebi('number_begin').addEventListener('input', formCheck(false));
dgebi('number_end').addEventListener('input', formCheck(false));
dgebi('digit_begin').addEventListener('input', formCheck(true));
dgebi('digit_end').addEventListener('input', formCheck(true));
dgebi('base_begin').addEventListener('input', formCheck(true));
dgebi('base_end').addEventListener('input', formCheck(true));
dgebi('pure2').addEventListener('input', formCheck(true));
