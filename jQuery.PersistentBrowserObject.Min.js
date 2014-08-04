//Copyright (c) 2014 Eric Vallee <eric_vallee2003@yahoo.ca>
//MIT License: https://raw.githubusercontent.com/Magnitus-/PersistentBrowserObject/master/License.txt
(function(){function a(c,b){a.prototype.GetInstance||(a.prototype.GetCacheType=function(){return this.CacheType},a.prototype.GetInstance=function(){return this.CacheType===a.Cache.Instance?(this.InstanceCache||(this.InstanceCache=a.Retrieve(this.Identifier+"Object")),this.InstanceCache):this.CacheType===a.Cache.Shared?(d[this.Identifier]||(d[this.Identifier]=a.Retrieve(this.Identifier+"Object")),d[this.Identifier]):a.Retrieve(this.Identifier+"Object")},a.prototype.Get=function(a){return this.GetInstance()[a]}, a.prototype.Set=function(c,d){var b=this.GetInstance(),e;if(c&&d)b[c]=d;else if("object"===typeof c)for(e in c)c.hasOwnProperty(e)&&(b[e]=c[e]);else throw new TypeError("PersistentBrowserObject: Invalid parameters passed to Set accessor. Either pass a single Key:Value pair as separate arguments or an object containing the Key:Value pairs you want to assign.");a.Store(this.Identifier+"Object",b)},a.prototype.Delete=function(c){var b=this.GetInstance();delete b[c];a.Store(this.Identifier+"Object",b)}); this.Identifier=c;this.CacheType=void 0===b?a.Cache.None:b;this.InstanceCache=null;a.Exists(this.Identifier+"Object")||a.Store(this.Identifier+"Object",{});this.CacheType!=a.Cache.Instance&&this.CacheType!=a.Cache.Shared||this.GetInstance()}var d={};a.Cache={None:0,Instance:1,Shared:2};a.CleanSharedCache=function(a){a?delete d[a]:d={}};a.Store=function(a,b){localStorage[a]=JSON.stringify(b)};a.Retrieve=function(a){return JSON.parse(localStorage[a])};a.Exists=function(a){return void 0!==localStorage[a]}; void 0===window.jQuery?window.PersistentBrowserObject=a:window.jQuery.PersistentBrowserObject=a})();
