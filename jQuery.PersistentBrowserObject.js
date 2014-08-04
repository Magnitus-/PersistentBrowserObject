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
    var SharedCache = {};   //Prototype or closure, that is the question :P. Closure won due to less typing and less complexity on external interface
    var Parser = JSON;
    function PersistentBrowserObject(Identifier, MemoryCache) 
    {
        if(!PersistentBrowserObject.prototype.GetInstance)
        {
            PersistentBrowserObject.prototype.GetCacheType = function(){
                return this.CacheType;
            };
            
            PersistentBrowserObject.prototype.GetInstance = function() {
                if(this.CacheType===PersistentBrowserObject.Cache.Instance)
                {
                    if(!this.InstanceCache)
                    {
                        this.InstanceCache = PersistentBrowserObject.Retrieve(this.Identifier + 'Object');
                    }
                    return this.InstanceCache;
                }
                else if(this.CacheType===PersistentBrowserObject.Cache.Shared)
                {
                    if(!SharedCache[this.Identifier])
                    {
                        SharedCache[this.Identifier] = PersistentBrowserObject.Retrieve(this.Identifier + 'Object');
                    }
                    return SharedCache[this.Identifier];
                }
                return PersistentBrowserObject.Retrieve(this.Identifier + 'Object');
            };
            
            PersistentBrowserObject.prototype.Get = function(Name) {
                var Instance = this.GetInstance();
                return(Instance[Name]);
            };
            
            PersistentBrowserObject.prototype.Set = function(NameOrObject, Value) {
                var Instance = this.GetInstance(), Key;
                if(NameOrObject && Value) 
                {
                    Instance[NameOrObject] = Value;
                }
                else if(typeof NameOrObject === "object")
                {
                    for(Key in NameOrObject)
                    {
                        if(NameOrObject.hasOwnProperty(Key))
                        {
                            Instance[Key] = NameOrObject[Key];
                        }
                    }
                }
                else
                {
                    throw new TypeError("PersistentBrowserObject: Invalid parameters passed to Set accessor. Either pass a single Key:Value pair as separate arguments or an object containing the Key:Value pairs you want to assign.");
                }
                PersistentBrowserObject.Store(this.Identifier + 'Object', Instance);
            };
            
            PersistentBrowserObject.prototype.Delete = function(Name) {
                var Instance = this.GetInstance();
                delete Instance[Name];
                PersistentBrowserObject.Store(this.Identifier + 'Object', Instance);
            };
        }
        this.Identifier = Identifier;
        if(MemoryCache===undefined)
        {
            this.CacheType = PersistentBrowserObject.Cache.None;
        }
        else
        {
            this.CacheType = MemoryCache;
        }
        
        this.InstanceCache = null;
        if(!PersistentBrowserObject.Exists(this.Identifier + 'Object'))
        {   
            PersistentBrowserObject.Store(this.Identifier + 'Object', {});
        }
        
        if(this.CacheType==PersistentBrowserObject.Cache.Instance||this.CacheType==PersistentBrowserObject.Cache.Shared)
        {
            this.GetInstance(); //Called to initialize cache if needed
        }
    }
    
    PersistentBrowserObject.Cache = {'None':0, 'Instance': 1, 'Shared': 2};
    
    PersistentBrowserObject.CleanSharedCache = function(Key){
        if(Key)
        {
            delete SharedCache[Key];
        }
        else
        {
            SharedCache = {};
        }
    };
    
    PersistentBrowserObject.Store = function(Key, Value){
        localStorage[Key] = JSON.stringify(Value);
    };
    
    PersistentBrowserObject.Retrieve = function(Key){
        return JSON.parse(localStorage[Key]);
    };
    
    PersistentBrowserObject.Exists = function(Key){
        return localStorage[Key] !== undefined;
    };
    
    if(window.jQuery===undefined)
    {
        window.PersistentBrowserObject = PersistentBrowserObject;
    }
    else
    {
        window.jQuery.PersistentBrowserObject = PersistentBrowserObject;
    }
})();
