---
title: "SignalR to synchronize web pages real-time"
path: "/signalr-to-synchronize-web-pages-real-time/"
tags: ["dotNET"]
excerpt: "SignalR is a client- and server-side solution with Javascript on client and ASP.NET on the back end to create these kinds of applications."
created: 2012-11-25
updated: 2012-11-25
---

## What is SignalR

In a nutshell, SignalR allows you to pass data between client and server in realtime. It will run on .Net 4.0 or 4.5 and to get websockets running, you will need IIS8 or IIS8 Express. That said, it will run on older versions of IIS and will switch to different transport modes.

## Hubs vs. Persistent Connections

SignalR talks about two concepts – persistent connections and hubs. Persistent Connection is a lower level API which is exposed over http. Hubs expose public methods to the clients and raise callbacks on the clients. In most web-based scenarios, you will be utilising hubs, which follow the publish-subscribe pattern.

## Transport modes

When a connection between a web client and a server is made, SignalR will determine a suitable transport type based on your client capabilities. It will gracefully degrade so older browsers might get long-polling instead of the fancy websockets. The transport mode can have a significant impact on the performance of the app.

* **WebSockets** (bidirectional stream) you’ll need IIS8 and the client needs a supported browser ie. (IE10, Chrome 13+, Firefox 7, Safari 5+, Opera 11+)
* **Server Sent Events** (push notifications from server to browser using DOM events)
* **Forever Frame** (uses HTTP 1.1 chunked encoding to establish a single long-lived HTTP connection in a hidden iframe)
* **Long polling** (hit the server hit the server hit the server hit the server hit server and hope something comes back with data)

## Creating a Hub

First, you will need to include SignalR in your project. The quickest way is to use NuGet. You will notice, there are various packages available. In this example, we are using both client and server parts of SignalR, therefore you should choose the “Microsoft ASP.NET SignalR” option. Don’t forget to include prerelease. The version I use is an alpha version.NuGet SignalR

This package will also install: Microsoft.AspNet.SignalR.JS, Microsoft.AspNet.SignalR.Core, Microsoft.AspNet.SignalR.Hosting.Common and Microsoft.AspNet.SignalR.Hosting.AspNet.

Creating a new hub then becomes very easy. Simply create a class and inherit from an abstract Hub class.

```csharp
public class ChatHub : Hub
{
    //your code here ...
}
```

## Connecting to the Hub from the client

In order to connect to the hub, you will need to add couple of Javascript references. Please note that SignalR uses JQuery. Therefore if it’s not included already, you should include it before initialising signalR.

```html
<script src="Scripts/jquery.signalR-1.0.0-alpha2.min.js" type="text/javascript"></script>  
<script src="/signalr/hubs" type="text/javascript"></script>
```

The /signalr/hubs endpoint exposes all the available hubs in the solution and lets you access their public methods. You will first need to initiate connection.

To get this route working you’ll need to add some code.

```csharp
[assembly: PreApplicationStartMethod(typeof(TheRoksSignalRDemo.RegisterHubs), 
                                     "Start")]
namespace TheRoksSignalRDemo
{
    public static class RegisterHubs
    {
        public static void Start()
        {
            // Register the default hubs route: ~/signalr/hubs
            RouteTable.Routes.MapHubs();            
        }
    }
}
```

This relies on the PreApplicationStartMethod attribute which is new in .NET 4.0

## Distributing messages from the server to the clients

Once you have made a connection to the hub, your client can then call the public methods on the hub and subscribe to the callbacks received from the hub.

```csharp
public class Chat : Hub
{
    public void Send(string message)
    {
        // Call the addMessage method on all clients            
        Clients.All.addMessage(message);
    }
}
```

When you want to distribute messages to your clients, you can do so using the Clients dynamic object. Any method that you call on Clients will raise a callback on the client. Furthermore, you can get access to the current client call id using Context.ConnectionId or Groups dynamic object which looks after groups management. To publish on a specific connection you can you `Clients[“groupName”].method(params)` or `Clients[Context.ConnectionId].method(params)`.

Finally, you should register your client callbacks in JS and wire-up the buttons, fields and your preferred rendering template

```js
$(function () {
    // Proxy created on the fly          
    var chat = $.connection.chat;

    // Declare a function on the chat hub so the server can invoke it          
    chat.client.addMessage = function (message) {
        $('#messages').append('<li>' + message + '</li>');
    };

    $("#broadcast").click(function () {
        // Call the chat method on the server
        chat.server.send($('#msg').val());
    });

    // Start the connection
    $.connection.hub.start();
});
```

And that’s it, simple as that.

This article is based on SignalR v.1.0.0.alpha2. This is still no final release so things may be different in the final release.

Read more about SignalR on Github or watch [this video on Vimeo](http://vimeo.com/43659069).
