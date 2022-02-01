import ttt from "./ttt";

test("TTT App", function () {

    ttt.setTrainingCharacters('');
    expect(ttt.getCharSet()).toEqual('');

    ttt.setTrainingCharacters();
    expect(ttt.getCharSet()).toEqual('');

    ttt.setTrainingCharacters('ab');
    expect(ttt.getCharSet()).toEqual('aaabbabb');

    expect(ttt.getOriginalCharSetLength()).toEqual(8);

    ttt.setTrainingCharacters('');
    expect(ttt.getCharSet()).toEqual('');

    ttt.setTrainingCharacters('abc');
    expect(ttt.getCharSet()).toEqual('aaabacbabbbccacbcc');

    let baseSet = ttt.getTrainingCharacters();
    expect(baseSet).toEqual('abc');

    ttt.eliminateFirstLetter('a');
    expect(ttt.getCharSet()).toEqual('aabacbabbbccacbcc');

    ttt.eliminateFirstLetter('b');
    expect(ttt.getCharSet()).toEqual('aabacbabbbccacbcc');

    ttt.eliminateFirstLetter('x');
    expect(ttt.getCharSet()).toEqual('aabacbabbbccacbcc');

    ttt.eliminateFirstLetter('a');
    expect(ttt.getCharSet()).toEqual('abacbabbbccacbcc');

    expect(ttt.getOriginalCharSetLength()).toEqual(18);

    ttt.eliminateFirstLetter(3);
    expect(ttt.getCharSet()).toEqual('abacbabbbccacbcc');

    ttt.eliminateFirstLetter();
    expect(ttt.getCharSet()).toEqual('abacbabbbccacbcc');

    let f = ttt.getFirstLetter();
    expect(f).toEqual('a');

    ttt.eliminateFirstLetter('a');
    expect(ttt.getCharSet()).toEqual('bacbabbbccacbcc');

    let f2 = ttt.getFirstLetter();
    expect(f2).toEqual('b');


    ttt.setTrainingCharacters(' a');
    expect(ttt.getCharSet()).toEqual('   aa aa');

    ttt.eliminateFirstLetter(' ');
    ttt.eliminateFirstLetter(' ');
    ttt.eliminateFirstLetter(' ');
    ttt.eliminateFirstLetter('a');
    ttt.eliminateFirstLetter('a');
    expect(ttt.getCharSet()).toEqual(' aa');

    ttt.setTrainingCharacters('abc');
    expect(ttt.getCharSet()).toEqual('aaabacbabbbccacbcc');

    expect(ttt.getOriginalCharSetLength()).toEqual(18);

    ttt.eliminateFirstLetter('a');
    ttt.eliminateFirstLetter('a');
    ttt.eliminateFirstLetter('a');
    ttt.eliminateFirstLetter('b');
    ttt.eliminateFirstLetter('a');
    ttt.eliminateFirstLetter('c');
    expect(ttt.getCharSet()).toEqual('babbbccacbcc');

    expect(ttt.getEliminationPercentage()).toEqual((18 - 12) / 18 * 100);

    // Test for 50% chars return punishment
    // ttt.eliminateFirstLetter('c', true);
    // expect(ttt.getCharSet()).toEqual('bacbabbbccacbcc');
    // ttt.eliminateFirstLetter('z', true);
    // expect(ttt.getCharSet()).toEqual('aabacbabbbccacbcc');

    // Test for default 10 chars return punishment
    ttt.eliminateFirstLetter('c', true);
    expect(ttt.getCharSet()).toEqual('aabacbabbbccacbcc');
    ttt.eliminateFirstLetter('a', true);
    expect(ttt.getCharSet()).toEqual('abacbabbbccacbcc');
    expect(ttt.getEliminationPercentage()).toEqual((18 - 16) / 18 * 100);

    ttt.setTrainingCharacters('abc', 1);
    expect(ttt.getCharSet()).toEqual('aabacaabbbcbacbccc');

    ttt.setTrainingCharacters('ab', 1);
    expect(ttt.getCharSet()).toEqual('aabaabbb');

    ttt.setTrainingCharacters('abcde', 2);
    expect(ttt.getCharSet()).toEqual('aabecddcebabbaceddecacbbcadeedadbccbdaeeaebdccdbea');

    //aa ab ac ad ae
    //ba bb bc bd be
    //ca cb cc cd ce
    //da db dc dd de
    //ea eb ec ed ee

    //0aa 1be 2cd 3dc 4eb 5ab 6ba 7ce 8dd 9ec 10ac 
    //11bb 12ca 13de 14ed 15ad 16bc 17cb 18da 
    //19ee 20ae 21bd 22cc 23db 24ea


    // 0  1  2  3  4

    // 0  5 10 15 20 //0 
    // 6 11 16 21  1 //1
    //12 17 22  2  7 //2
    //18             //3
    //24

});