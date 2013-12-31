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
    
    while (!( (s[i]<s[i+1]) && (s[i+1] === Math.max.apply(Math, s.slice(i+1))) ) )
        i++;
//  console.log('s['+i+']', s[i]);
    if (i == len) // s - самый большой элемент, возвращаем пустой массив
        return res;
    
    var j = i+1; // индекс наименьшего элемента из всех, которые правее i-го и больше его
    while ( (s[j]<s[i]) || (s[j] !== minMore(s.slice(i+1), s[i])) )
        j++;
//  console.log('s['+j+']', s[j]);
    // копируем s, чтобы не портить его. В js массивы приравниваются по ссылке
    for (var k=0; k<len; k++)
        res[k] = s[k];
    
    // меняем местами i-ый и j-ый элементы
    var temp = res[i];
    res[i] = res[j];
    res[j] = temp;
//  console.log('res before: ', res);
    // упорядочиваем по возрастанию подмассив, начинающийся с i-го элемента
    var buf = res.slice(i+1);
    buf.sort();
    for (var k=1; k<(len-i); k++)
        res[i+k] = buf[k-1];
    
    return res;
}

function Init(n) {
    var len = factorial(n);
    var Sn = new Array()//  массив из элементов группы Sn
    for (var i=0; i<len; i++)
        Sn[i] = new Array();
    for(var i=0; i<n; i++) // тождественная перестановка
        Sn[0][i] = i+1;
    
    
    for (var i=1; i<len; i++) {
        Sn[i] = lexicographic(Sn[i-1]); console.log('Sn['+i+']', Sn[i]) }
}