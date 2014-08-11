PersistentBrowserObject
=======================

This library is used to give more of an object-oriented feel to the localStorage API by default. 

It also supports caching, sessionStorage, cookies, memory storage and a customisable array of fallback solutions.

Requirements
============

- A browser that supports the JSON and localStorage APIs, though you can waive those requirements if you customize the library (read below)

- jQuery is optional. If present, the library will assign its constructor as a property of the jQuery object, else it will assign its constructor as a property of the global window object.

- The unit tests are dependent on the QUnit library

What Comes With It
==================

- The human-friendly library which comprise both the main file and the defaults file (both required if you want a working solution out of the box)

- A production-friendly minimized version of the library which includes both the main and defaults files in one minized file.

- The unit tests I created for the library. You can run them by opening the Tests.html file with your browser.

How To Use The Library In Your code
===================================

Make sure to source it in web pages/apps that plan to use it.

From there, you can create and use it with a simple object as follows:

```javascript
var Instance = new jQuery.PersistentBrowserObject('SimpleObject');       //Or just new PersistentBrowserObject('SimpleObject') if you don't use jQuery
Instance.Set('Name', 'Object');                                          //Using persistent storage to store the value 'Object' in the property 'Name' for all 'SimpleObject' objects
Instance.Set({'Qualificative': 'Simple', 'Purpose': 'None'});            //You can also take a shortcut and pass a single object which will contain Key:Value pairs to store
console.log(Instance.Get('Name'));                                       //logs 'Object'
console.log(Instance.Get('Qualificative'));                              //logs 'Simple'
var InstanceSame = new jQuery.PersistentBrowserObject('SimpleObject');   //We just created another object that works as an in-sync duplicate of the first object, because they are both 'SimpleObject'
console.log(InstanceSame.Get('Name'));                                   //logs 'Object'
InstanceSame.Set('SameStorageAsInstance', 'Indeed');
console.log(Instance.Get('SameStorageAsInstance'));                      //logs 'Indeed'
var Other = new jQuery.PersistentBrowserObject('DifferentObject'); 
console.log(Other.Get('Name'));                                          //logs 'undefined', because it is 'DifferentObject' and uses a different storage entry from 'SimpleObject'
```

Caching
=======

By default, objects from the library always read and write to permanent storage whenever Get/Set are called.

If you do a lot of Get calls, the library provides caching facilities to improve on speed.

The caching facilities are as follow:

1) Instance Caching

Syntax:

```javascript
var InstanceThatUsesCache = new jQuery.PersistentBrowserObject('ObjectIdentifier', jQuery.PersistentBrowserObject.Cache.Instance);  
```

This works well as long as you don't have several concurrent objects with the same identifier that call the Set method.

If there are, they won't see each other's changes and corrupt each other's updates.

Instance caching is best used for singletons or groups of read-only objects (objects that only call the Get method).

1) Shared Caching

Syntax:

```javascript
var InstanceThatUsesCache = new jQuery.PersistentBrowserObject('ObjectIdentifier', jQuery.PersistentBrowserObject.Cache.Shared);  
```

Shared caching provides the best of both worlds. It provides cache and allows you to use concurrent objects that won't corrupt each other's data.

However, unless you clean it up, data in the shared cache will persist for the lifetime of the user's browser session which may or may not be what you want.

To clean up the shared cache for a specific object name (for example, with the object above), the syntax is:

```javascript
PersistentBrowserObject.CleanSharedCache('ObjectIdentifier'); 
```

Alternatively, you can clean the entire shared cache by calling the above function with an argument as follows:

```javascript
PersistentBrowserObject.CleanSharedCache(); 
```

Customization
=============

The library gives you a lot of freedom to customize the storage/retrieval of objects.

You can customize the library in 2 different manners.

1) Total Overhaul

Internally, the library calls the following 3 functions:

- PersistentBrowserObject.prototype.Store

This method takes a key (object identifier) as its first argument, a value (Object instance) as its second argument and associates the value with the key in the permanent storage.

If the key doesn't exist, it is created with the given value, else it is updated with the given value.

- PersistentBrowserObject.prototype.Retrieve

This method takes a key (object identifier) as its only argument and fetches the value (Object instance) associated with the key in the permanent storage.

If the key is not found, it returns undefined.

- PersistentBrowserObject.prototype.Exists

This method returns true if the key exists in the permanent storage, else it returns false.

By assigning your own functions that behave outwardly like the defaults, you gain total control over how object storage is handled.

2) Working with the Fallback List

The following prototype property is defined:

PersistentBrowserObject.prototype.FallbackList

This is an array of storage solutions that the library will iterate over, stopping at the first storage solution that is supported.

Each element of the array is an object instance that has the following methods:

- Store(Key, Value)

Stores the Object instance 'Value' under the identifier 'Key'

- Retrieve(Key)

Retrieves the Object instance stored under identifier 'Key'

- Exists(Key)

Returns true if there is an Object instance stored under identifier 'Key'

- Supported()

Returns true if the current execution environment allows the methods (Store, Retrieve, Exists) to execute properly.

By default, the library provides the following objects which support the above API:

- PersistentBrowserObject.Storage.localStorage
- PersistentBrowserObject.Storage.sessionStorage
- PersistentBrowserObject.Storage.Memory
- PersistentBrowserObject.Storage.Cookie

It goes without saying that you can also define your own.

This is the default value of the library:

PersistentBrowserObject.prototype.FallbackList = [PersistentBrowserObject.Storage.localStorage]

You can assign a custom array of values such as:

```javascript
PersistentBrowserObject.prototype.FallbackList = [PersistentBrowserObject.Storage.localStorage, PersistentBrowserObject.Storage.Cookie]
```

The above would use PersistentBrowserObject.Storage.localStorage by default to store objects, except for browsers that don't support localStorage in which case PersistentBrowserObject.Storage.Cookie would be used instead.

If you override the PersistentBrowserObject.prototype.FallbackList property, you better do so before you create any PersistentBrowserObject objects instances.

Additionally, you can pass a custom fallback array to an instance's constructor call in which case it will only apply to that instance.

An example of the syntax:

```javascript
var Instance = new jQuery.PersistentBrowserObject('SimpleObject', jQuery.PersistentBrowserObject.Cache.None, [PersistentBrowserObject.Storage.localStorage, PersistentBrowserObject.Storage.Cookie]);
```

jQuery.PersistentBrowserObject... really!?!?!
=============================================

```javascript
window.PBO = jQuery.PersistentBrowserObject; //Now, you just type PBO :).
```
