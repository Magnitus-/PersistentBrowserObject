PersistentBrowserObject
=======================

This library is used to give more of an object-oriented feel to the localStorage API.

It started its life as an get/set accessor generator script to store options for a javascript library I plan to bring on Github later and then the "This should be separate. How can I generalize this?" OCD kicked in and this is the result.

Requirements
============

- A browser that supports the JSON and localStorage APIs, though you can waive those requirements if you customize the library (read below)

- jQuery is optional. If present, the library will assign its constructor as a property of the jQuery object, else it will assign its constructor as a property of the global window object.

- The unit tests are dependent on the QUnit library

What Comes With It
==================

- The library, in its original programmer-friendly format and minified.

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
var InstanceThatUsesCache = new jQuery.PersistentBrowserObject('ObjectIdentifier', jQuery.PersistentBrowserObject.Cache.Instance);  
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

By default, the library uses the built-in JSON object (ie, window.JSON) to render and parse JSON and the built-in localStorage object (ie, window.localStorage) for permanent storage.

If you'd prefer a different solution (ie, custom JSON library, sessionStorage instead of localStorage, cookie fallback for browsers that don't support localStorage, etc), you can assign your own functions to the following properties:

- PersistentBrowserObject.Store

This method takes a key as its first argument, a value as its second argument and associates the value with the key in the permanent storage.

If the key doesn't exist, it is created with the given value, else it is updated with the given value.

- PersistentBrowserObject.Retrieve

This method takes a key as its only argument and fetches the value associated with the key in the permanent storage.

If the value is not found, it returns undefined.

- PersistentBrowserObject.Exists

This method returns true if the key exists in the permanent storage, else it returns false.

As long as you follow the above interface, the library will work with your custom functions. Feel free to tweak the Tests.js in order to test it if you are unsure.
