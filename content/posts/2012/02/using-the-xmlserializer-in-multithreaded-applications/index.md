---
title: "Using the XmlSerializer in multithreaded applications"
path: "/using-the-xmlserializer-in-multithreaded-applications"
tags: ["dotNET"]
excerpt: "The XmlSerializer can cause serious problems in multithreaded environments."
created: 2011-02-12
updated: 2011-02-12
---


The XmlSerializer can cause serious problems in multithreaded environments. See this piece of code.

```csharp
[ThreadStatic]
private static XmlSerializer xmlSerializer =
        new XmlSerializer(typeof(Mailpack), Namespace);

private static string SerialiseAssemblageResultaat(Mailpack mailpack)
{
   StringBuilder xmlString = new StringBuilder();
   TextWriter xmlWriter = new StringWriter(xmlString);
   try
   {
      xmlSerializer.Serialize(xmlWriter, mailpack);
      return xmlString.ToString();
   }
   finally
   {
      xmlWriter.Close();
      xmlWriter.Dispose();
   }
}
```

What we see is an static instance of XMLSerializer out-side of the method it is used in. It’s even has a ThreadStatic attribute on it. The method show a simple method that gets an object and returns the as xml serialized object as a string.

## The problem of the XMLSerializer

This piece of code run in different threads. Both of the threads use the same instance of the XmlSerializer. The ThreadStatic attribute will cause that once the instance of the XmlSerializer is created it never will be recreated. If one the threads re-creates, the instance will be null for the new thread. Followed by a NullReferenceException.

## How to solve

Possibility number one is to put the creation of the instance of the XmlSerializer in the method. But why did the developer who wrote this didn’t do that. He had a reason for that. The XmlSerializer has a memory-leak by design as you can read in this post [http://blogs.msdn.com/b/tess/archive/2006/02/15/532804.aspx](http://blogs.msdn.com/b/tess/archive/2006/02/15/532804.aspx) in short. Every time a new instance is created .NET creates dynamic a new assembly and that assembly will never be removed from memory.

Creating a singleton implementation of the XmlSerializer makes a dynamic dll is created for every thread. To prevent this XmlSerializerFactory is used. XmlSerializerFactory caches the dynamic dll’s that are created. The same constructor will return a XmlSerializer that it is from the cached dll. The singleton implementation has to thread-safe. This code can be found here [http://msdn.microsoft.com/en-us/library/ff650316.aspx](http://msdn.microsoft.com/en-us/library/ff650316.aspx) on MSDN.

## The source code

```csharp
private static volatile XmlSerializer xmlSerializer;
private static readonly object syncRoot = new object();

private static XmlSerializer XmlSerializer
{
   get
   {
      // only create a new instance if one doesn't already exist.
      if (xmlSerializer == null)
      {
         // use this lock to ensure that only one thread is access
         // this block of code at once.
         lock(syncRoot)
         {
            if (xmlSerializer == null)
            {
                XmlSerializerFactory factory = new XmlSerializerFactory();
                xmlSerializer = factory.CreateSerializer(typeof(Mailpack),
                                                         Namespace);
            }
       }
   }
   // return instance where it was just created or already existed.
   return xmlSerializer;
}

private static string SerializeResult(Mailpack mailpack)
{
   StringBuilder xmlString = new StringBuilder();
   TextWriter xmlWriter = new StringWriter(xmlString);
   try
   {
      XmlSerializer.Serialize(xmlWriter, mailpack);
      return xmlString.ToString();
   }
   finally
   {
      xmlWriter.Close();
      xmlWriter.Dispose();
   }
}
```
