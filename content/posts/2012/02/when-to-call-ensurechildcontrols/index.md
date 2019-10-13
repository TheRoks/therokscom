---
title: "When to call EnsureChildControls in custom controls"
path: "/when-to-call-ensurechildcontrols"
tags: ["dotNET"]
excerpt: "Should I call EnsureChildControls in code?"
created: 2012-02-05
updated: 2012-02-05
---


Should I call EnsureChildControls in code?

It depends on different scenarios.

Actually, EnsureChildControls method determines whether the server control contains child controls. If it does not, it creates child controls.

This method first checks the current value of the ChildControlsCreated property. If this value is false, the CreateChildControls method is called.

ASP.NET calls it this method when it needs to make sure that child controls have been created. In most cases, custom server control developers do not need to override this method. If you do override this method, use it in a similar fashion as its default behavior.

## Reserve engineered EnsureChildControls method

```csharp
protected virtual void EnsureChildControls()
{
    if (!this.ChildControlsCreated &amp;&amp; !this.flags[256])
    {
        this.flags.Set(256);
        try
        {
            this.ResolveAdapter();
            if (this._adapter != null)
            {
                this._adapter.CreateChildControls();
            }
            else
            {
                this.CreateChildControls();
            }
            this.ChildControlsCreated = true;
        }
        finally
        {
            this.flags.Clear(256);
        }
    }
}

protected internal virtual void CreateChildControls()
{
}
```

## Conclusion

In normal life cycle it’s not necessary to call EnsureChildControls. Unless you have a property or something that’s affecting your CreateChildControls method. If you don’t do this, never call EnsureChildControls. CreateChildControls wil be called in normal Page Life Cycle.
