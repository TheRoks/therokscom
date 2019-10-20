---
title: "How to unit test code with a fluent interface with TypeMock Isolator"
path: "/how-to-unit-test-code-with-a-fluent-interface-with-typemock-isolator/"
tags: ["dotNET"]
excerpt: "How to unit test code with a fluent interface with TypeMock Isolator"
created: 2011-08-14
updated: 2011-08-14
---


Recently I was asked to write a unit test for some code that had a fluent interface. The code made calls to a database that should be mocked/faked. Faking and mocking is done by TypeMock Isolator.

Let’s say you have class like this:

```csharp 
public class CommandBuilder : ICommandBuilder
{
  private string name;
  private string param;

  public ICommandBuilder SetName(string name)
  {
    this.name = name;
    return this;
 }

  public ICommandBuilder AddParam(string name, string value)
  {
    this.param = value;
    return this;
  }
}

public interface ICommandBuilder
{
  ICommandBuilder SetName(string name);
  ICommandBuilder AddParam(string name, string value);
}
```
 
That’s called by a repository like this:

```csharp
public class Repository
{
   public void MakeDbCall()
   {
     ICommandBuilder builder = new CommandBuilder()
       .SetName("test")
       .AddParam("param1", "value");
   }
}
```

Let’s say the MakeDbCall method has lot logic in it. Then it is enough to test that CommandBuilder is constructed with right methods and parameters. This kind of testing is behavior testing. We don’t test the real outcome, but the behavior our method will have. To do this you can use a mocking framework. My familiarity is with TypeMock Isolator. So the example shown below is with that framework. Frameworks like Moq and RhinoMocks can do the same. Nice to see is that all these frameworks use a fluent interface as well.

What we see here is that there won’t be made one call to the CommandBuilder instance. Everything is faked. It starts by `Isolate.Fake.Instance<CommandBuilder>`. Then we interrupt the first creation of a CommandBuilder by replacing it by our fake one. On the return of SetName we return just our fakeBuilder again. All next calls that will be inline would return this fakeBuilder. Last call we fake has a ReturnRecursiveFake() in this case. This is because we don’t use the fakeBuilder anymore.

The most extensive check is the WasCalledWithExtactArguments. Everything must match the methods and the parameters. There is one exception to that. The order of the method calls is not relevant in this way of testing.

If the implementation of your fluent interface enforces the method calls in a certain order, the implementation of the unit test should be slightly different.

```csharp
[TestMethod]
public void MakeDbCallMethodOrderImportant()
{
   // Arrange
   CommandBuilder fakeBuilder = 
     Isolate.Fake.Instance<CommandBuilder();
   Isolate.Swap.NextInstance().With(fakeBuilder);
   Isolate.WhenCalled(() => fakeBuilder
     .SetName(string.Empty)
     .AddParam(string.Empty, string.Empty)).ReturnRecursiveFake();
   Repository repository = new Repository();

   // Act
   repository.MakeDbCall();

   // Assert
   Isolate.Verify.WasCalledWithExactArguments(() => fakeBuilder
     .SetName("test")
     .AddParam("param1", "value"));
}
```

The WhenCalled method contains all calls that will be made. To put it like this everything including the order of method call must match.
