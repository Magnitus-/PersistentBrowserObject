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
        return localStorage !== undefined;
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
        return sessionStorage !== undefined;
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
        return JSON.parse(decodeURIComponent(document.cookie.substring(Beginning + Key.length, Ending)));
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
