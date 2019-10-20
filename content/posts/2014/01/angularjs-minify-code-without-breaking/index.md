---
title: "AngularJS Minify your code without breaking it"
path: "/angularjs-minify-code-without-breaking/"
tags: ["AngularJS"]
excerpt: "How to write AngularJS code that can be minified. This post shows an example together with the MVC bundling and minification feature"
created: 2014-01-12
updated: 2014-01-12
---


Minifying your clientside code is a best practice. Minification performs a variety of different code optimizations to scripts or css, such as removing unnecessary white space and comments and shortening variable names to one character. This last thing can be problem with Angular if you do it right.

## Bundling and minifying with MVC

Since working with Angular and MVC together I’m using the standard bundling and minification feature of the .NET Framework. This is working as you would expect. It bundles and minifies your assets. In the `bundleconfig.cs` this looks like this:

```csharp
bundles.Add(new StyleBundle("~/content/css/app").Include("~/content/app.css"));

bundles.Add(new ScriptBundle("~/js/jquery").Include("~/scripts/vendor/jquery-{version}.js"));

bundles.Add(new ScriptBundle("~/js/angular").Include("~/scripts/vendor/angular.js",
                "~/scripts/angular-*"));

bundles.Add(new ScriptBundle("~/js/app").Include(
                "~/scripts/vendor/angular-ui-router.js",
                "~/scripts/filters.js",
                "~/scripts/services.js",
                "~/scripts/directives.js",
                "~/scripts/controllers.js",
                "~/scripts/app.js"));
```

Now I create a very simple Angular controller that will work.

```js
angular.module('app.controllers', [])
    .controller('HomeCtrl', [function ($scope, $location, $window) {
        //your code
    }]);
```

When running this will lead to multiple files to been loaded in the network tab.

It will bundles after you will set the `debug` variable in the `web.config` to `false`. Afterwards things get bundled and minified. The difference is visible in the network tab of the browser.

Looking to my we see it isn’t working anymore. What did I do? The minification broke the variable names where Angular leans on. All service you can inject are renamed to one letter variables.

## Solution

So did Angular fix this? Yes, they did. Is it a nice solution? No, in my opinion not. But it’s working. We need to inject explicit the names of the variables we will be using. So $scope will we injected as `$scope`. So how is this working? It all depends on order. The variable name in the function is not important anymore, you can name it as you want. Still I think you should use other names. Let it be clear you are using which variable you are using. See the code below how to fix it and let you code be able to minify.

```js
angular.module('app.controllers', [])
    .controller('HomeCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
       // your code
    }])
```

## Conclusion

Minifying is one of the best practices when working with client code. Start with this in the beginning. Finding problems when you have a lot of code is much more difficult.
