---
title: "Unit test SharePoint list with TypeMock Isolator"
path: "/unit-test-sharepoint-list-with-typemock-isolator/"
tags: ["SharePoint"]
excerpt: "Unit testing SharePoint code can be very hard. TypeMock Isolator can help you test your code that runs in SharePoint."
created: 2013-06-25
updated: 2013-06-25
---


Testing your code can be a time consuming business with SharePoint. You’ll to F5 Build. Deploy, And test. This cycle is extremely slow and you don’t want to do this often. Then there’s unit testing. But SharePoint is a complex system. It needs loads of infrastructure to get anywhere. The best to speed up is to get rid of SharePoint when testing your code.

## TypeMock Isolator to the rescue

In this post I’ll show how to this piece of code. In this code a list item is retrieved with the SharePoint Client Object Model. I’ve included the dll with the use of NuGet. TypeMock Isolator is installed on my development machine.

```csharp
public string GetTemplateInRootWeb(string documentName)
{
	try
	{
		using (ClientContext clientContext = new ClientContext("http://localhost"))
		{
			List listTemplates = clientContext.Web.Lists.GetByTitle("TemplateList");

			CamlQuery camlQueryTemplates = new CamlQuery();
			string queryTemplates = QueryTemplates(documentName);

			camlQueryTemplates.ViewXml = queryTemplates;

			ListItemCollection listItemsEmailtemplates = listTemplates.GetItems(camlQueryTemplates);
			clientContext.Load(listItemsEmailtemplates);

			clientContext.ExecuteQuery();

			if (listItemsEmailtemplates != null && listItemsEmailtemplates.Count == 1)
			{
				return listItemsEmailtemplates[0]["Template"].ToString();
			}
		}
		throw new ArgumentException(string.Format("Template {0} not found", documentName));
	}
	catch (Exception exception)
	{
		throw new Exception("Get TemplateInRootWeb niet gelukt", exception);
	}
}

private static string QueryTemplates(string documentName)
{
	return string.Format(@"<View>
							<Query>
								<Where>
									<Eq>
									<FieldRef Name='Title'></FieldRef>
									<Value Type='Text'>{0}</Value>
									</Eq>
								</Where>
							</Query>                                          
							<ViewFields>
								<FieldRef Name=""EmailTemplate"" />
							</ViewFields>
								<RowLimit>1</RowLimit>     
							</View>", documentName);
}
```

## How to unit test SharePoint Client Object Model

The code belows show a unit test of the code above. This is done in the typical AAA structure. Every unit test, with or without TypeMock Isolator needs to be off structure in my opion. It’s al about Arrange al the things you’ll need. Act, execute the action to be tested. And assert, check if everything is as you were expecting.

```csharp
[TestMethod, Isolated]
public void GetTemplateInRootWebOneTemplateFound()
{
	// Arrange
	const string documentName = "document.txt";

	ClientContext context = Isolate.Fake.NextInstance<ClientContext>();
	List list = Isolate.Fake.Instance<List>();
	Isolate.WhenCalled(() => context.Web.Lists.GetByTitle(string.Empty)).WillReturn(list);

	ListItem fakeListItem = Isolate.Fake.Instance<ListItem>();
	Isolate.WhenCalled(() => fakeListItem["Template"]).WithExactArguments().WillReturn("template text");

	List<ListItem> listItems = new List<ListItem> { fakeListItem };
	Isolate.WhenCalled(() => list.GetItems(null)).WillReturnCollectionValuesOf(listItems);

	Isolate.WhenCalled(() => context.Load(list)).IgnoreCall();
	Isolate.WhenCalled(() => context.ExecuteQuery()).IgnoreCall();

	// Act
	SharePointHelper helper = new SharePointHelper();
	string template = helper.GetTemplateInRootWeb(documentName);

	// Assert
	Assert.AreEqual("template text", template);
}
```

In short what is done.

Of each the next instance that’s created of the class ClientContext create a fake. In older versions of TypeMock the syntax Swap.NextInstance was used. This is deprecated and `Fake.NextInstance` is the new syntax.

An other ‘special’ piece is `GetItems(..)` this will return a `ListItemCollection`. It’s almost not possible to create a fake collection with items. To fake this we use: `WillReturnCollectionValuesOf(..)` method. In this we can return an array of ListItems.

After that the hardest part is done and we Ignore the calls `Load(..)` and `ExcecuteQuery(..)`.

## Summary

TypeMock Isolator is a powerfull framework that helps unit testing. However it isn’t an excuse to have a bad design. When mocking/faking too much is a smell for bad design.

A trail copy of TypeMock Isolator can be downloaded [here](http://www.typemock.com/).
