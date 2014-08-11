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
    //Lower level details that are hidden away in closures
    var SharedCache = {};   
    function InitializeInternals(MemoryCache) {
        if(MemoryCache===undefined)
        {
            this.CacheType = PersistentBrowserObject.Cache.None;
        }
        else
        {
            this.CacheType = MemoryCache;
        }
        
        this.InstanceCache = null;
        if(!this.Exists(this.Identifier + 'Object'))
        {   
            this.Store(this.Identifier + 'Object', {});
        }
        
        if(this.CacheType==PersistentBrowserObject.Cache.Instance||this.CacheType==PersistentBrowserObject.Cache.Shared)
        {
            this.GetInstance(); //Called to initialize cache if needed
        }
    }
    
    //Constructor
    function PersistentBrowserObject(Identifier, MemoryCache, CustomFallbackList) 
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
                        this.InstanceCache = this.Retrieve(this.Identifier + 'Object');
                    }
                    return this.InstanceCache;
                }
                else if(this.CacheType===PersistentBrowserObject.Cache.Shared)
                {
                    if(!SharedCache[this.Identifier])
                    {
                        SharedCache[this.Identifier] = this.Retrieve(this.Identifier + 'Object');
                    }
                    return SharedCache[this.Identifier];
                }
                return this.Retrieve(this.Identifier + 'Object');
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
                this.Store(this.Identifier + 'Object', Instance);
            };
            
            PersistentBrowserObject.prototype.Delete = function(Name) {
                var Instance = this.GetInstance();
                delete Instance[Name];
                this.Store(this.Identifier + 'Object', Instance);
            };
            
            PersistentBrowserObject.prototype.DeleteAll = function() {
                var Instance = this.GetInstance(), Key;
                for(Key in Instance)
                {
                    if(Instance.hasOwnProperty(Key))
                    {
                        delete Instance[Key];
                    }
                }
                this.Store(this.Identifier + 'Object', Instance);
            };
        }
        this.Identifier = Identifier;
        if(CustomFallbackList !== undefined)
        {
            this.FallbackList = CustomFallbackList;
        }
        InitializeInternals.call(this, MemoryCache);
    }
    
    //Enums for the types of cache users can pass to the constructor
    PersistentBrowserObject.Cache = {'None':0, 'Instance': 1, 'Shared': 2};
    
    //Function you can call to clean the shared cache, especially useful for apps that don't load new pages often
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
    
    //Logic to enumerate a list of storage APIs and use the first one that is supported by the browser.
    //The logic is deliberately hidden away in a closure while the list it operates on is deliberately exposed through
    //the prototype and meant to allow users to customize the list.
    //See the default file for some predefined APIs and the default value for the list
    PersistentBrowserObject.prototype.FallbackList = [];
    function ExecuteOnFallbackList()
    {
        var Index;
        for(Index=0; Index<this.FallbackList.length; Index++)
        {
            if(this.FallbackList[Index].Supported())
            {
                //console.log("ExecuteOnFallbackList["+arguments[0]+"]");
                //console.log(Array.prototype.slice.call(arguments, 1));
                return this.FallbackList[Index][arguments[0]].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
    
    //Those functions are used internally and call the logic to check the fallback list
    //to store objects in the storage, retrieve objects in the storage and check if they are stored
    //They can be used as hooks by users to bypass the fallback list althogether
    PersistentBrowserObject.prototype.Store = function(Key, Value){
        ExecuteOnFallbackList.call(this, 'Store', Key, Value);
    };
    PersistentBrowserObject.prototype.Retrieve = function(Key){
        return ExecuteOnFallbackList.call(this, 'Retrieve', Key);
    };
    PersistentBrowserObject.prototype.Exists = function(Key){
        return ExecuteOnFallbackList.call(this, 'Exists', Key);
    };
    
    //Expose the constructor, either in jQuery if present, else the global object
    if(window.jQuery===undefined)
    {
        window.PersistentBrowserObject = PersistentBrowserObject;
    }
    else
    {
        window.jQuery.PersistentBrowserObject = PersistentBrowserObject;
    }
})();
