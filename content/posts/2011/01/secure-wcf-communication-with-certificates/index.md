---
title: "Secure WCF communication with certificates"
path: "/secure-wcf-communication-with-certificates/"
tags: ["dotNET"]
excerpt: "When having hosted a WCF webservice that is secured by a certificate. Opening the service with a browser al the security stuff is handled by the browser. This situation is different. The caller is a .NET Click-once application, that is hosted near the webservice. This application has to handle the use of the certificate by itself."
created: 2011-01-26
updated: 2011-01-26
---

When having hosted a WCF webservice that is secured by a certificate. Opening the service with a browser al the security stuff is handled by the browser. This situation is different. The caller is a .NET Click-once application, that is hosted near the webservice. This application has to handle the use of the certificate by itself.

There are two essential parts in this. Client configuration and client code. First the server configuration.

The endpoint configuration is a wsHttpBinding with a custom behavior.

```xml
<endpoint name="stage"
          address="https://application.hosting.corp/Services/Import.svc"
          behaviorConfiguration="stage"
          binding="wsHttpBinding"
          bindingConfiguration="wsHttpBinding_IImport" 
          contract="ImportService.IImport" />
```

The binding defines that a certificate is used.

```xml
<security mode="Transport">
  <transport clientCredentialType="Certificate"
             proxyCredentialType="None" />
  <message clientCredentialType="None"
           negotiateServiceCredential="true"
           establishSecurityContext="false" />
</security>
```

The custom behavior.

```xml
<behavior name="stage">
  <clientCredentials>
    <clientCertificate storeName="AddressBook"
                       storeLocation="CurrentUser"
                       x509FindType="FindBySubjectName"
                       findValue="stage.hosting.corp" />
  </clientCredentials>
</behavior>
```

The custom behaviour holds the location where to find the certificate on the client. For all posibilities that can put in here see MSDN. The choice of AddressBook is because the certificate the server has, is not available on the client. The client has to install manually the certificate. After that the certificate can be found in the “other people” store of certificates. If you don’t use i.e. Verisign the addressbook is also needed.

All this wasn’t even enough to get is working. The error: “Could not establish trust relationship for the SSL/TLS secure channel with authority staging.hosting.corp” did still appear. To get it working some dummy code is inserted on the client.

```csharp
ServicePointManager.ServerCertificateValidationCallback 
  = new RemoteCertificateValidationCallback(CertificateValidation);
```

By implementing ServicePointManager.ServerCertificateValidationCallback the certificate validation can be overriden.

```csharp
public bool CertificateValidation(Object sender,
                                  X509Certificate cert,
                                  X509Chain chain,
                                  SslPolicyErrors Errors)
{
  return true;
}
```

Returning true is NOT the right solution. There is no check on the certificate now. This is only for test purposes.
