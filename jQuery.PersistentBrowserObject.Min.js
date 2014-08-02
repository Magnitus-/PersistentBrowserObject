//Copyright (c) 2014 Eric Vallee <eric_vallee2003@yahoo.ca>
//MIT License: https://raw.githubusercontent.com/Magnitus-/PersistentBrowserObject/master/License.txt
(function(){function a(f,g){this.UniquePrefix=f;this.MemoryCache=g;this.Instance=null;"undefined"==typeof localStorage[this.UniquePrefix+"Object"]&&(localStorage[this.UniquePrefix+"Object"]=JSON.stringify({}));this.MemoryCache&&(this.Instance=JSON.parse(localStorage[this.UniquePrefix+"Object"]));a.prototype.HasMemoryCache||(a.prototype.HasMemoryCache=function(){return null!==this.Instance},a.prototype.GetInstance=function(){return this.Instance?this.Instance:JSON.parse(localStorage[this.UniquePrefix+ "Object"])},a.prototype.Get=function(b){return this.GetInstance()[b]},a.prototype.Set=function(b,a){var c=this.GetInstance();if(b&&a)c[b]=a;else if("object"==typeof b)for(var d in b)b.hasOwnProperty(d)&&(c[d]=b[d]);else throw new TypeError("PersistentBrowserObject: Invalid parameters passed to Set accessor. Either pass a single Key:Value pair as separate arguments or an object containing the Key:Value pairs you want to assign.");localStorage[this.UniquePrefix+"Object"]=JSON.stringify(c)},a.prototype.Delete= function(a){var e=this.GetInstance();delete e[a];localStorage[this.UniquePrefix+"Object"]=JSON.stringify(e)})}jQuery?jQuery.PersistentBrowserObject=a:window.PersistentBrowserObject=a})();