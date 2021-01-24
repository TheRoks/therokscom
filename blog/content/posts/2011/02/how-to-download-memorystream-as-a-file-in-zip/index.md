---
title: "How to download MemoryStream as a file in zip"
path: "/how-to-download-memorystream-as-a-file-in-zip/"
tags: ["dotNET"]
excerpt: "Using the SharpZipLib it’s possible to zip and unzip files. This can be a good solution when file size matters. Downloading files that are ziped can save many bandwidth. In this case a object is serialized to XML and put into a ZipOutputStream which belongs to SharpZipLib."
created: 2011-02-25
updated: 2011-02-25
---

Using the SharpZipLib it’s possible to zip and unzip files. This can be a good solution when file size matters. Downloading files that are ziped can save many bandwidth. In this case a object is serialized to XML and put into a ZipOutputStream which belongs to SharpZipLib.

```csharp
public static byte[] RetreiveBytes(IEnumerable<int> Ids)
{
  MemoryStream stream = new MemoryStream();
  ZipOutputStream zipStream = new ZipOutputStream(stream);
  zipStream.SetLevel(3);

  foreach (int Id in Ids)
  {
    Export export = DaoWrapper.GetExportObject(Id);
    MemoryStream memoryStream = new MemoryStream();
    using (XmlTextWriter xmlTextWriter =
             new XmlTextWriter(memoryStream, Encoding.UTF8))
    {
       XmlSerializer xmlSerializer = new XmlSerializer(export.GetType());
       xmlSerializer.Serialize(xmlTextWriter, trigger);
       // Write stream into a memorystream
       memoryStream = (MemoryStream) xmlTextWriter.BaseStream;
       memoryStream.Seek(0, SeekOrigin.Begin);

       ZipEntry newEntry = new ZipEntry(export.FileName)
                                 {DateTime = DateTime.Now};
       zipStream.PutNextEntry(newEntry);

       StreamUtils.Copy(memoryStream, zipStream, new byte[4096]);
       zipStream.CloseEntry();
    }
  }
  zipStream.IsStreamOwner = false;
  zipStream.Close();
  stream.Seek(0, SeekOrigin.Begin);

  return stream.ToArray();
}
```

After that it’s a piece of cake to get everything up and running. Put this piece of code in a ASP.NET page and have a download available.

```csharp
//Convert the memorystream to an array of bytes.
byte[] byteArray = RetreiveBytes();
// Clear all content output from the buffer stream
Response.Clear();
// for the browser's download dialog
Response.AddHeader("Content-Disposition",
                   "attachment; filename=export.zip");
// Add a HTTP header to the output stream that contains the
Response.AddHeader("Content-Length",
                   byteArray.Length.ToString());
// Set the HTTP MIME type of the output stream
Response.ContentType = "application/zip";
// Write the data out to the client.
Response.BinaryWrite(byteArray);
```
