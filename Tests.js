/*
Copyright (c) 2014 Eric Vallee <eric_vallee2003@yahoo.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

QUnit.test("Dependencies", function( assert ) {
    assert.ok(JSON, "Confirming the presence of the JSON property on the global object");
    assert.ok(localStorage, "Confirming the presence of the localStorage property on the global object");
});

QUnit.test("NameSpace", function( assert ) {
    assert.ok(jQuery.PersistentBrowserObject, "Confirmed PersistentBrowserObject exists in jQuery namespace.");
});

QUnit.test("Proper Basic Storage", function( assert ) {
    localStorage.clear();
    var Test = new jQuery.PersistentBrowserObject('Test');
    assert.ok(typeof Test.Get('Should Not Exist') == 'undefined', "Confirming properties that should not exist are undefined.");
    assert.ok(!Test.HasMemoryCache(), "Confirming that cache is not enabled by default.");
    Test.Set('One',1);
    assert.ok(Test.Get('One') && Test.Get('One') == 1, "Confirming basic usage for getter works.");
    Test.Set({'One': -1, 'Two': -2, 'Three': -3});
    assert.ok(Test.Get('One') && Test.Get('One') == -1 && Test.Get('Two') && Test.Get('Two') == -2 && Test.Get('Three') && Test.Get('Three') == -3, "Confirming getter works after object argument setter and value overwrite.");
    Test.Delete('Two');
    assert.ok(typeof Test.Get('Two') == 'undefined', 'Confirming deleter works.');
    var Complicated = [{'str': ['allo','\\\'\"\/\b\f\n\r\t\u9999']},1];
    Test.Set('Complicated',Complicated);
    var ComplicatedGet = Test.Get('Complicated');
    //This is essentially a test of the browser's JSON encoder/parser, but for completeness...
    assert.ok(ComplicatedGet&&ComplicatedGet[0]&&ComplicatedGet[0]['str']&&ComplicatedGet[0]['str'][1]&&ComplicatedGet[0]['str'][1]==Complicated[0]['str'][1], "Confirming storage of complex objects works");
});

QUnit.test("Multiple Instances Without Caching", function( assert ) {
    localStorage.clear();
    var Test = new jQuery.PersistentBrowserObject('Test');
    var TestSynonim = new jQuery.PersistentBrowserObject('Test');
    Test.Set('One',1);
    assert.ok(TestSynonim.Get('One') == 1, "Propagation of changes across existing instances works.");
    var TestSynonimSynonim = new jQuery.PersistentBrowserObject('Test');
    assert.ok(TestSynonimSynonim.Get('One') == 1, "Propagation of changes to new instances works.");
    var Test2 = new jQuery.PersistentBrowserObject('Test2');
    assert.ok(!Test2.Get('One'), "Confirming new objects can't get the properties of other names.");
    Test2.Set('One', 2);
    assert.ok(Test.Get('One')==1, "Confirming objects can't pollute existing objects with a different name with setter.");
    Test2.Delete('One');
    assert.ok(Test.Get('One'), "Confirming objects can't pollute existing objects with a different name with deleter.");
});

QUnit.test("Caching", function( assert ) {
    localStorage.clear();
    var Test = new jQuery.PersistentBrowserObject('Test', true);
    assert.ok(Test.HasMemoryCache(), "Confirming that cache is enabled.");
    Test.Set('One',1);
    Test.Set({'Two': 2, 'Three': 3});
    assert.ok(Test.Get('One')&&Test.Get('One')==1, "Confirming simple setter and getter work with cache.");
    assert.ok(Test.Get('Two')&&Test.Get('Two')==2&&Test.Get('Three')&&Test.Get('Three')==3, "Confirming object setter works with cache.");
    var TestSynonim = new jQuery.PersistentBrowserObject('Test', true);
    assert.ok(TestSynonim.Get('Two')&&TestSynonim.Get('Two')==2&&TestSynonim.Get('Three')&&TestSynonim.Get('Three')==3, "Confirming changes are still committed to persistent store when cache is enabled.");
    localStorage.clear();
    assert.ok(Test.Get('Two')&&Test.Get('Two')==2&&Test.Get('Three')&&Test.Get('Three')==3, "Confirming beyond doubt that getter is fetched from memory with cache.");
});
