---
title: "Invalid postback or callback argument. Event validation is enabled"
path: "/invalid-postback-or-callback-argument-event-validation-is-enabled"
tags: ["SharePoint"]
excerpt: "I wrote web part that uses Repeater control to create some repeating blocks of output. Each of these blocks has Button control in it. When I ran web part under SharePoint I got the following error: Invalid postback or callback argument."
created: 2011-08-21
updated: 2011-08-21
---


I wrote web part that uses Repeater control to create some repeating blocks of output. Each of these blocks has Button control in it. When I ran web part under SharePoint I got the following error: `Invalid postback or callback argument. Event validation is enabled using <pages enableEventValidation="true"/> in configuration or <%@ Page EnableEventValidation="true" %> in a page. For security purposes, this feature verifies that arguments to postback or callback events originate from the server control that originally rendered them.  If the data is valid and expected, use the ClientScriptManager.RegisterForEventValidation method in order to register the postback or callback data for validation.`

## What is it

ASP.NET 2.0  added a feature called event validation. Event validation checks the incoming POST request to ensure that the event causing the Postback / callback is valid and the event which triggered the Postback /callback is expected by the Runtime. If the runtime finds a Postback / callback by an event which is not registered for validation, it throws an exception. This has been added in ASP.NET 2.0 explicitly to prevent the attack to the application by spoofing a Postback. Event validation can help prevent injection attacks from malicious users who are trying to POST data by an event which does not come up from the controls registered to the page. So we don’t want to disable this check.

## The solution

Button control in Repeater item template has ID assigned to it. If Repeater data source has more than one row then this exception is thrown. My solution was simple. As I had ItemDataBound event handler written anyway I solved the problem there. All I had to do was to change Button control ID so it is unique. Here is my repeater (actually, very-very simplified version of it).

```xml
<asp:Repeater ID="TransactionRepeater" runat="server"
         OnItemDataBound="TransactionRepeater_ItemDataBound"
         OnItemCommand="TransactionRepeater_ItemCommand">
   <ItemTemplate>
      <asp:TextBox ID="searchTextbox" runat="server"></asp:TextBox>
      <asp:Button ID="searchButton" runat="server" Text="Search"
                   CommandName="Search" />
      <asp:Panel ID="searchResults" runat="server">...</asp:Panel>
   </ItemTemplate>
</asp:Repeater>
```

When I try to bind repeater to data then everything is okay. Error occurs when I try to push searchButton because buttons in ItemTemplate have similar ID-s. My solution here simple one and it works. At least for me.

```csharp
protected void TransactionRepeater_ItemDataBound(object sender,
                                                 RepeaterItemEventArgs e)
{
   if (e.Item.DataItem == null)
      return;
   Button searchButton = e.Item.FindControl("SearchButton") as Button;
   searchButton.ID = "searchButton_" + e.Item.ItemIndex;
   Panel searchResults = e.Item.FindControl("SearchResults") as Panel;
   searchButton.Click += delegate { searchResults.Visible = true; };
}
```

As you can see the solution is simple: each button in item template has now different ID and error mentioned above doesn’t occur anymore.
