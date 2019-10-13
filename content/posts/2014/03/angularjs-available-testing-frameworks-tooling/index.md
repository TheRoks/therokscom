---
title: "AngularJS available testing frameworks and tooling"
path: "/angularjs-available-testing-frameworks-tooling"
tags: ["AngularJS"]
excerpt: Lessons learned from mixins, render props, HOCs, and classes.
featuredImage: "./javascript-tools-frameworks.png"
created: 2014-03-29
updated: 2014-03-29
---

Recently I’m discovering a whole new world. The client side world. Last years I was developing a lot of webpart for SharePoint, but looking into the future we see a that many sites depend on a heavy frontend. As this client side is getting bigger and bigger, more code is produced. There’s also a need to test this code on a structured way. There I was looking in the last couple of weeks what’s around to do this.

Where I’m originally a ASP.NET guy, I work with Visual Studio. So looking for all available frameworks and tools I kept in mind it should be working with Visual Studio but it should also stay close to how the inventors of AngularJS did meant it. I made a list of tools and frameworks that are out now and are very helpful.

## Tools and Frameworks

[Jasmine](http://jasmine.github.io/2.0/introduction.html): Behavior driven javascript testing framework. Jasmine is a behavior-driven development framework for testing JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. Runs in Chutzpah. Protractor tests on the AngularJS documentation site are made in Jasmine.

[Mocha](https://github.com/mochajs/mocha): javascript testing framework. Mocha is a feature-rich JavaScript test framework running on NodeJS and the browser. Runs also in Chutzpah and it’s also possible to write protractor tests with it.

[QUnit](https://qunitjs.com/): QUnit is a JavaScript unit testing framework. It’s used by the jQuery, jQuery UI and jQuery Mobile projects and is capable of testing any generic JavaScript code. Runs also in Chutzpah.

[SinonJS](http://sinonjs.org/): Standalone test spies, stubs and mocks for JavaScript. No dependencies, works with any unit testing framework.

[Chai](http://chaijs.com/): Assertion library. Chai is a BDD / TDD assertion library for node and the browser that can be paired with any javascript testing framework.

[BlanketJS](https://github.com/alex-seville/blanket): An easy to install, easy to configure, and easy to use JavaScript code coverage library that works both in-browser and with NodeJS.

[PhantomJS](http://phantomjs.org/): A headless WebKit scriptable with a JavaScript API. It has fast and native support for various web standards: DOM handling, CSS selector, JSON, Canvas, and SVG.

[Chutzpah](http://chutzpah.codeplex.com/): Javascript runner as a Visual Studio extension. Uses PanthomJS as headless browser to run the tests.

[NodeJS](http://nodejs.org/): Node.js is a platform built on Chrome’s JavaScript runtime for easily building fast, scalable network applications. NodeJS uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

[Karma](http://karma-runner.github.io/0.12/index.html): Javascript Test runner build by the AngularJS team formally known as Testangular. Support unittests and e2e tests. Needs NodeJS to run.

[Angular scenario Framework](https://github.com/karma-runner/karma-ng-scenario): Since Angular v1.2. On their site they advise to use Protractor. If you are starting a new project, we recommend using Protractor for e2e testing AngularJS projects.

[Protractor](https://github.com/angular/protractor): Protractor is an end to end test framework for AngularJS applications. It’s built on top of WebDriverJS. Protractor runs tests against your application running in a real browser, interacting with it as a user would. You can use together with Jasmine. To run it’s tests it uses selenium. It will replace the Angular scenario Framework.

## Conclusion

For now my choice will be a combination of the Jasmine framework for unit testing and Protractor for e2e testing. Jasmine is easy to use and there’s a lot of documentation on the internet. Together with the Chutzpah tooling for Visual Studio does this give me great integration for unit testing.
For e2e testing I'll work with protractor. Integration with Visual Studio is not available but this stays close to how the AngularJS team meant it.
