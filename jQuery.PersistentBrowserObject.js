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
(function(){
    function PersistentBrowserObject(UniquePrefix, MemoryCache)
    {
        this.UniquePrefix = UniquePrefix;
        this.MemoryCache = MemoryCache;
        this.Instance = null;
        
        if(typeof(localStorage[this.UniquePrefix+'Object'])=='undefined')
        {  
            localStorage[this.UniquePrefix+'Object'] = JSON.stringify({});
        }
        
        if(this.MemoryCache)
        {
            this.Instance = JSON.parse(localStorage[this.UniquePrefix+'Object']);
        }
        
        if(!PersistentBrowserObject.prototype.HasMemoryCache)
        {
            PersistentBrowserObject.prototype.HasMemoryCache = function(){
                return !(this.Instance === null);
            };
            
            PersistentBrowserObject.prototype.GetInstance = function(){
                if(this.Instance)
                {
                    return this.Instance;
                }
                else
                {
                    return JSON.parse(localStorage[this.UniquePrefix+'Object']);
                }
            };
            
            PersistentBrowserObject.prototype.Get = function(Name){
                var Instance = this.GetInstance();
                return(Instance[Name]);
            };
            
            PersistentBrowserObject.prototype.Set = function(Name, Value){
                var Instance = this.GetInstance();
                if(Name&&Value)
                {
                    Instance[Name]=Value;
                }
                else if(typeof arguments[0] == "object")
                {
                    for(var Key in arguments[0])
                    {
                        if(arguments[0].hasOwnProperty(Key))
                        {
                            Instance[Key]=arguments[0][Key];
                        }
                    }
                }
                else
                {
                    throw new TypeError("PersistentBrowserObject: Invalid parameters passed to Set accessor. Either pass a single Key:Value pair as separate arguments or an object containing the Key:Value pairs you want to assign.");
                }
                localStorage[this.UniquePrefix+'Object'] = JSON.stringify(Instance);
            };
            
            PersistentBrowserObject.prototype.Delete = function(Name){
                var Instance = this.GetInstance();
                delete Instance[Name];
                localStorage[this.UniquePrefix+'Object'] = JSON.stringify(Instance);
            };
        }
    }
    
    if(jQuery)
    {
        jQuery.PersistentBrowserObject = PersistentBrowserObject;
    }
    else
    {
        window.PersistentBrowserObject = PersistentBrowserObject;
    }
})();
