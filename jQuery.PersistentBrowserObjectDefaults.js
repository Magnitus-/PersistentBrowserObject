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

(function() {
    "use strict";
    var PersistentBrowserObject;
    if(window.jQuery===undefined)
    {
        PersistentBrowserObject = window.PersistentBrowserObject;
    }
    else
    {
        PersistentBrowserObject = jQuery.PersistentBrowserObject;
    }
    
    PersistentBrowserObject.Storage = {}
    
    PersistentBrowserObject.Storage['localStorage'] = {};
    PersistentBrowserObject.Storage['localStorage']['Store'] = function(Key, Value){
        localStorage[Key] = JSON.stringify(Value);
    };
    PersistentBrowserObject.Storage['localStorage']['Retrieve'] = function(Key){
        return JSON.parse(localStorage[Key]);
    };
    PersistentBrowserObject.Storage['localStorage']['Exists'] = function(Key){
        return localStorage[Key] !== undefined;
    };
    PersistentBrowserObject.Storage['localStorage']['Supported'] = function(){
        return window.localStorage !== undefined;
    };
    
    PersistentBrowserObject.Storage['sessionStorage'] = {};
    PersistentBrowserObject.Storage['sessionStorage']['Store'] = function(Key, Value){
        sessionStorage[Key] = JSON.stringify(Value);
    };
    PersistentBrowserObject.Storage['sessionStorage']['Retrieve'] = function(Key){
        return JSON.parse(sessionStorage[Key]);
    };
    PersistentBrowserObject.Storage['sessionStorage']['Exists'] = function(Key){
        return sessionStorage[Key] !== undefined;
    };
    PersistentBrowserObject.Storage['sessionStorage']['Supported'] = function(){
        return window.sessionStorage !== undefined;
    };
    
    var Memory = new Object();
    PersistentBrowserObject.Storage['Memory'] = {};
    PersistentBrowserObject.Storage['Memory']['Store'] = function(Key, Value){
        Memory[Key] = JSON.stringify(Value);
    };
    PersistentBrowserObject.Storage['Memory']['Retrieve'] = function(Key){
        return JSON.parse(Memory[Key]);
    };
    PersistentBrowserObject.Storage['Memory']['Exists'] = function(Key){
        return Memory[Key] !== undefined;
    };
    PersistentBrowserObject.Storage['Memory']['Supported'] = function(){
        return true;
    };
    PersistentBrowserObject.Storage['Memory']['Clear'] = function(){
        var Memory = new Object();
    };
    
    PersistentBrowserObject.Storage['Cookie'] = {};
    PersistentBrowserObject.Storage['Cookie']['Store'] = function(Key, Value){
        document.cookie = encodeURIComponent(Key) + "=" + encodeURIComponent(JSON.stringify(Value));
    };
    PersistentBrowserObject.Storage['Cookie']['Retrieve'] = function(Key){
        var BeginsWith = encodeURIComponent(Key) + "=";
        var EndsWith = ";";
        var Beginning = document.cookie.indexOf(BeginsWith);
        var Ending = document.cookie.indexOf(EndsWith, Beginning);
        if(Ending==-1)
        {
            Ending = document.cookie.length;
        }
        return JSON.parse(decodeURIComponent(document.cookie.substring(Beginning + BeginsWith.length, Ending)));
    };
    PersistentBrowserObject.Storage['Cookie']['Exists'] = function(Key){
        var BeginsWith = encodeURIComponent(Key) + "=";
        return document.cookie.indexOf(BeginsWith) > -1;
    };
    PersistentBrowserObject.Storage['Cookie']['Supported'] = function(){
        return document !== undefined && document.cookie !== undefined;
    };
    
    //Default is to use localStorage with no fallback
    PersistentBrowserObject.prototype.FallbackList[PersistentBrowserObject.prototype.FallbackList.length] = PersistentBrowserObject.Storage.localStorage;
})();
