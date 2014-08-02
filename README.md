PersistentBrowserObject
=======================

This library is used to give more of an object-oriented feel to the localStorage API.

It started its life as an get/set accessor generator script to store options for a javascript library I plan to bring on Github later and then the "This should be separate. How can I generalize this?" OCD kicked in and this is the result.

Requirements
============

- A browser that supports the JSON and localStorage APIs.

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

You can also specify that a PersistentBrowserObject instance uses a memory cache to minize access to localStorage, mostly useful for objects that perform a lot of Get.
The syntax is as follows:

```javascript
var InstanceThatUsesCache = new jQuery.PersistentBrowserObject('CoolObject', true);  
```

However, when using several instances sharing the same localStorage entry: you should only use memory cache either on singletons or several instances that only call Get. Otherwise, be prepared for the following consequences:

- If you have 1 instance that performs Set and other cache-using instances that perform Get, the Cache-using instances won't see the changes from the Set calls.
- If you have several cache-using instances that perform Set, they'll negate the effect of each other's Set calls.
