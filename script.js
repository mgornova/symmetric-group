function factorial(n) {
  return (n!=1) ? n*factorial(n-1) : 1;
}

function minMore (s/*массив*/, a/*элем, с кот. сравниваем*/) { // наименьший элемент массива, больший некоторого заданного значения
    var res = s[0];
    var len = s.length;
    for (var k=1; k<len; k++)
        if ( (s[k]<res) && (s[k]>a) )
            res = s[k];
    return (res>a) ? res : 0;
}

function isSort (s /*массив*/) { // отсортирован ли массив по убыванию?
    var len = s.length;
    var buf = [];
    for (var k=0; k<len; k++)
        buf[k] = s[k];
    buf.sort();
    buf.reverse();
    return (buf.toString() === s.toString()) ? true : false;
}

function lexicographic(s /*массив*/) { // следующая перестановка в лексикографическом порядке
    var res = []; 
    var len = s.length;
    var i = 0; // индекс наименьшего элемента, после которого остальные упорядочены по убыванию
    
    while (!( (s[i]<s[i+1]) && (isSort(s.slice(i+1))) ) )
        i++;
    
    if (i == len) // s - самый большой элемент, возвращаем пустой массив
        return res;
    
    var j = i+1; // индекс наименьшего элемента из всех, которые правее i-го и больше его
    while ( (s[j]<s[i]) || (s[j] !== minMore(s.slice(i+1), s[i])) )
        j++;

    // копируем s, чтобы не портить его. В js массивы приравниваются по ссылке
    for (var k=0; k<len; k++)
        res[k] = s[k];
    
    // меняем местами i-ый и j-ый элементы
    var temp = res[i];
    res[i] = res[j];
    res[j] = temp;

    // упорядочиваем по возрастанию подмассив, начинающийся с i-го элемента
    var buf = res.slice(i+1);
    buf.sort();
    for (var k=1; k<(len-i); k++)
        res[i+k] = buf[k-1];
    
    return res;
}

function Inverse (s /*массив*/) { // обратная к s подстановка
    var res = [];
    var len = s.length;
    
    // копируем s, чтобы не портить его. В js массивы приравниваются по ссылке
    for (var k=0; k<len; k++)
        res[k] = s[k];
    
    for (var i=0; i<len; i++)
        for (var j=0; j<len; j++) {
            if(s[j] == i + 1) {
               res[i] = j + 1;
           }
        }
    // console.log(res);
    return res;            
}

var Hash = Object(); // глобальный объект вида { "[2,1,3]":Sn[2] } для быстрого поиска элемента в группе

function Init(n) {
    var len = factorial(n);
    
    var Sn = new Array() //  массив из элементов группы Sn
    for (var i=0; i<len; i++)
        Sn[i] = {
            s : [],   // перестановка
            key : 0,  // 0: элемент пока не лежит ни в одном классе эквивалентности, 1: лежит
            s_1 : 0   // обратная к s перестановка
        };
    
    for(var i=0; i<n; i++) // тождественная перестановка
        Sn[0].s[i] = i+1;
    window.Hash[Sn[0].s.toString()] = Sn[0];
    
    for (var i=1; i<len; i++) {
        Sn[i].s = lexicographic(Sn[i-1].s);   //console.log('Sn['+i+']', Sn[i].s) 
        Sn[i].s_1 = Inverse(Sn[i].s);
        window.Hash[Sn[i].s.toString()] = Sn[i];  //console.log('Hash['+Sn[i].s.toString()+']', Hash[Sn[i].toString()])
    }

    return Sn;
}

function find(s/*массив*/) { // ищем перестановку s в группе Sn
    return Hash[s.toString()]; // вернёт какой-то Sn[index]
}

/*******************************************************************************/

function Mult () { // s1*s2*...*sn
    var res = [];
    var len = arguments[0].length;
    var factor = arguments.length;
    
    // копируем последний элемент
    for (var k=0; k<len; k++)
        res[k] = arguments[factor-1][k];
    
    for (var i=0; i<len; i++)
        for(var j=factor-2; j>=0; j--)
            res[i] = arguments[j][res[i]-1];
    // console.log(res);
    return res;
}


function Spec (n /*порядок Sn*/) {
    var fact = factorial(n),
        Sn = Init(n),
        R = []; // массив чисел Райдемайстера
    
    for (var i=1; i<fact; i++) { // перебор по автоморфизмам
        var y = Sn[i].s, // задаёт автоморфизм. Тождественный не берём, т.к. R(id)=p(n) числу разложений n на слагаемые
            y_1 = Sn[i].s_1;
        R[i] = 0;
    //console.log('******** Классы экв-ти для автоморфизма ', y);    
        for (var j=0; j<fact; j++) { // перебор по f элементам группы
            var f = Sn[j].s;
            
            if (Sn[j].key != 0) // элемент уже в каком-то классе
                continue;
            else {    //console.log('** F = ', f);
                for (var k=1; k<fact; k++) { // перебор по x элементам группы
                    var x = Sn[k].s,
                        x_1 = Sn[k].s_1,
                        g =  find(Mult(y, x, y_1, f, x_1)); // объект из Sn
                    
                    g.key = 1;       //console.log('** ', g.s);              
                } // перебор по x элементам группы
                R[i]++; //console.log('*************');
            } 
        } // перебор по f элементам группы
        
        for (var k=0; k<fact; k++) // обратно занулить все ключи
            Sn[k].key = 0;
    console.log('***', R[i]);    
    } // перебор по автоморфизмам
    //console.log('*******************************************');
    return R;
}
    
    