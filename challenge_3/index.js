const callCounts = {
    sec: 0,
    add: 0,
    mpy: 0,
    pwr: 0
};

let printTree = false;

const sec = a => {
    callCounts.sec++;
    const res = 1 + a;
    printTree && Out.log(`sec(${a}) = ${res}`);
    return res;
};

const add = (a, b, indent = 1) => {
    callCounts.add++;
    const res = (b === 0) ? a : sec(add(a, b - 1, indent + 1));
    printTree && Out.log(`${new Array(indent).fill(' ').join('')}add(${a}, ${b}) = ${res}`);
    return res;
};

const mpy = (a, b, indent = 1) => {
    callCounts.mpy++;
    const res = (b === 1) ? a : add(a, mpy(a, b - 1, indent + 1), indent + 1);
    printTree && Out.log(`${new Array(indent).fill(' ').join('')}mpy(${a}, ${b}) = ${res}`);
    return res;
};

const pwr = (a, b, indent = 0) => {
    callCounts.pwr++;
    const res = (b === 1) ? a : (b === 0) ? 1 : mpy(a, pwr(a, b - 1, indent + 1), indent + 1);
    printTree && Out.log(`${new Array(indent).fill(' ').join('')}pwr(${a}, ${b}) = ${res}`);
    return res;
};


const startCounting = () => {
    const a = +document.getElementById('a').value;
    const b = +document.getElementById('b').value;

    if (!a && a !== 0 || !b && b !== 0) {
        Out.log('Не указаны аргументы функции');
        return;
    }

    Out.clear();
    if (b > 20) {
        Out.log('Дерево будет нечетабельным, не выведу его');
    } else {
        Out.log('Дерево вызовов:');
        printTree = true;
    }

    try {
        const result = pwr(a, b);

        Out.log('-----------------------------------------');
        Out.log('Результат pwr(' + a + ',' + b + '): ' + result);
        Out.log('Количество вызовов sec: ' + callCounts.sec);
        Out.log('Количество вызовов add: ' + callCounts.add);
        Out.log('Количество вызовов mpy: ' + callCounts.mpy);
    } catch (e) {
        Out.log('Ошибка: ', e);
        Out.log('Количество вызовов sec: ' + callCounts.sec);
        Out.log('Количество вызовов add: ' + callCounts.add);
        Out.log('Количество вызовов mpy: ' + callCounts.mpy);
    } finally {
        callCounts.sec = 0;
        callCounts.add = 0;
        callCounts.mpy = 0;
        callCounts.pwr = 0;
        printTree = false;
    }
}

const btn = document.getElementById('start_counting');
btn.addEventListener('click', startCounting);


const calcBoundaries = () => {
    Out.clear();

    let i = 1;
    while(i < 10) {
        let j = 0;

        while(true) {
            try {
                pwr(i, j);
            } catch (e) {
                Out.log('Предельное значение (' + i + '^' + (j - 1) + ') = ' + pwr(i, j - 1));
                Out.log(`Предельная степень для ${i}: ${j}\n`);

                i++;
                break;
            }
            j++;
        }
    }
}

const btnBoundaries = document.getElementById('calc_boundaries');
btnBoundaries.addEventListener('click', calcBoundaries);
