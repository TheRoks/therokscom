---
title: "Angularjs Communication Controllers"
path: "/angularjs-communication-controllers"
tags: ["AngularJS"]
excerpt: There are many different ways to communicate between different Angular controllers in the same app. I will show what's the best way in my opinion for now. Communicate with events. The alternative way is by using a inherited scope.
created: 2013-12-15
updated: 2013-12-15
---

There are many different ways to communicate between different Angular controllers in the same app. I will show what's the best way in my opinion for now. Communicate with events. The alternative way is by using a inherited scope.

## Inherited scopes

The simplest way for controllers to communicate is through the use of scope. Each time a controller is instantiated within another controller, that controller (the child) inherits the scope from the parent controller. This gives the child access to all the functions and variables attached to the parent scope. However, it’s important to know that because of Javascript’s prototype-based inheritance, primitive variables (such as strings, integers, and booleans) may be affected in unexpected ways.

## Event driven communication

While inherited scope works well in situations where data needs to be shared between parent and child controllers, it doesn’t deal with communication between siblings. For that, we can used event-based communication with the Angular services `$on`, `$emit`, and `$broadcast`.

## $Broadcast

Dispatches an event name downwards to all child scopes (and their children) notifying the registered `ng.$rootScope.Scope#methods_$on` listeners. The event life cycle starts at the scope on which $broadcast was called. All listeners listening for name event on this scope get notified. Afterwards, the event propagates to all direct and indirect scopes of the current scope and calls all registered listeners along the way. The event cannot be canceled.

## $Emit

Dispatches an event name upwards through the scope hierarchy notifying the registered `ng.$rootScope.Scope#methods_$on` listeners. The event life cycle starts at the scope on which `$emit` was called. All listeners listening for name event on this scope get notified. Afterwards, the event traverses upwards toward the root scope and calls all registered listeners along the way. The event will stop propagating if one of the listeners cancels it.

## $On

Listens on events of a given type. If a broadcast or emit is done, the on will catch both. The event listener function format is: function(event, args...).

## Solution

Working with this event in only controllers still needs a parent controller. Because in that way you will stack the scopes of the controllers and the broadcast and emit will be able to communicate with the on. Alternative to that is the use of the $rootscope. The $rootscope is the highest possible scope in Angular. Have said that, `$rootscope.$broadcast` will always hit on all controllers wherever it is located. However the use of $rootscope should be minimized at all costs in my opinion. Or at least isolated as much as possible. Therefor I'll never use $rootscope in my controllers. For this solution I produced a service that I'll include in my controllers. The service will handle the complete `$rootscope.$broadcast` and `$scope.$on` combination. In the controller we only fire the event of service and in the subscribed controller we will handle the outcome.

## Example code

Here a simplified example of the service. If you don't see the Fiddle, hit this [link](https://jsfiddle.net/TheRoks/8j34n/2).
