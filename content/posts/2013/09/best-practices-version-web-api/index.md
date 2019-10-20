---
title: "Best practices to version Web API"
path: "/best-practices-version-web-api/"
tags: ["dotNET"]
excerpt: Once you publish an Web API, it’s set stone. Publishing an API is not a trivial move to do. Users or customers rely on the API not changing after publishing. But however requirements will change always. So there’s a need to evolve the API without breaking existing clients.
created: 2013-09-27
updated: 2013-09-27
---


Once you publish an Web API, it’s set stone. Publishing an API is not a trivial move to do. Users or customers rely on the API not changing after publishing. But however requirements will change always. So there’s a need to evolve the API without breaking existing clients.

## What causes a need to version?

The reasons to version can be datacontract changes of change of URL. When the datacontract has a change of required fields or when a URL changes i.e. when it changes from theroks.com/api/user?id=435 to theroks.com/api/user/435 this is a change of version.

## Versioning in URI Path

This way of versioning is done by Tumblr i.e.: [http://api.tumblr.com/v2/user](http://api.tumblr.com/v2/user) and has the version number in the URI.

Allows you to drastically change the API. So it’s simple to segregate old APIs for backwards compability. However it requires lots of clients changes as you version and it increases the size of the URI surface area you have to support. This will cause a larger technical depth.

## Versioning with a URI parameter

This is has the version number in the URI querystring parameter. This is done by Netflix: [http://api.netflix.com/catalog/titles/series/70023522?v1.5](http://api.netflix.com/catalog/titles/series/70023522?v1.5)

It works with an optional parameters. Without version, users always get the latest version of the API. An other advantage is that there are small client changes as versions mature. On the other hand it can suprise developers with unintended changes

## Versioning with content negotiation

This is done by adding a content type like: `application/vnd.theroks.1.param+json`. This done by GitHub. Instead of using standard MIME types, it uses a custom MIME type to version. It can include the Accept Header for format too. The standard indicates you use “vnd.” as a starting point (meaning vendor). It has the packages API and resource versioning in one and it removes versioning from API so clients don’t have to change. But it adds complexity and adding headers isn’t easy on all platforms. It also can encourage increased versioning which causes more code churning.

## Version with Request Headers

This should be a header value that is only a value to your API like `x-MyApp-Version: 2.1` This way of versioning is done by the API of Azure. It seperates versioning from API call signatures and is not tied to resource versioning (e.g. content types). But is adds also complexity. This is also not easy to do on all platforms.

## What about resource versioning

Resources you return should be versioned too. Versioning API calls alone isn’t enough. Structure and constraints can change. So you need to know which version you are getting back. Versioning with custom content types is easier in this case. But again, it adds complexity. But including the version in the resource pollutes the data and should not be considered.

## Web API versioning, which to Choose

There is not easy answer. Version with content negotiation and custom headers are popular now, but version with URI components are more common now. It’s more popular because it’s easier to implement. Ultimately it’s a pragmatic decision. But you should version from the first release of your API.

## Summary

First of all, do version your Web API. But with that statement there’s still no canonical way to do API versioning. Pick the one that matches the maturity level of your team and users. Complex versioning doesn’t have to be evil. But it will increase friction with developers.

But just start versioning. You can always sunset the version scheme you are using and start over with a new strategy.
