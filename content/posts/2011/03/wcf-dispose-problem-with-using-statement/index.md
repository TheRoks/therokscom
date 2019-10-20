---
title: "WCF Dispose problem with using statement"
path: "/wcf-dispose-problem-with-using-statement/"
tags: ["dotNET"]
excerpt: "WCF client cannot be used inside a Using block because they may unexpectedly throw an exception. Even if you catch the exception, it is possible that a connection will be left open."
created: 2011-03-11
updated: 2011-03-11
---


WCF client cannot be used inside a Using block because they may unexpectedly throw an exception. Even if you catch the exception, it is possible that a connection will be left open.

Why is this IDisposable implementation so different from all the others in the .NET Framework.

The first problem with WCF clients is that the Close/Dispose method can throw an exception. This makes the Dispose method unsafe to call from a Finally block. `Close()` take a Timeout and has an async version, and also `Close()` can throw Exceptions. `Abort()` conversely is not supposed to block (or throw any expected exceptions), and therefore doesn’t have a timeout or an async version

Even worse, there is a chance that the Close/Dispose method can leave the connection open if Abort isn’t called. If too many connections are left open, this can lead to application instability. The solution given on MSDN is not safe!

In short, `Close()` will dispose the resources friendly and `Abort()` will do this ungracefully. Because `Close()` may throw some exceptions such as `CommunicationException` and `TimeoutException`, so the code snippet on the client side would be like this:

```csharp
MyClient client = null;
try
{
  client = new MyClient();
  result = client.Bronsystemen();
}
catch (EndpointNotFoundException)
{
  if (client != null) client.Abort();
}
catch (FaultException)
{
  if (client != null) client.Abort();
}
catch (TimeoutException)
{
  if (client != null) client.Abort();
}
catch (CommunicationException)
{
  if (client != null) client.Abort();
}
catch (Exception)
{
  if (client != null) client.Abort();
}
finally
{
  if (client != null) client.Close();
}
```

Side effects of implementing the Close method only in the Try block is that a Code Analysis rule `CA2000` is given. To solve this you need the move the Close method to the Finally block. However the Close method can throw an exception that will go up.

A workaround is to create an extension method that will close the connection. The Close method will be called within a Try-catch block.

```csharp
public static class Extensions
{
    public static void CloseConnection(this ICommunicationObject client)
    {
        if (client.State != CommunicationState.Opened)
        {
            return;
        }
        try
        {
            client.Close();
        }
        catch (CommunicationException ex)
        {
            client.Abort();
        }
        catch (TimeoutException ex)
        {
            client.Abort();
        }
        catch (Exception ex)
        {
            client.Abort();
            throw;
        }
    }
}
```