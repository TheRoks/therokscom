---
title: "Create shortcut to generate GUID in Visual Studio"
path: "create-shortcut-to-generate-guid-in-visual-studio"
tags: ["Visual Studio"]
excerpt: Working on SharePoint you see and use a lot of GUIDs. Creating them can be done by using guidgen.exe. When you just need a few it works just fine. But I need a lot and I like my keyboard. So I wanted a shortcut key to generate GUID. This is how I did do it.
created: 2011-06-15
updated: 2011-06-15
---


Working on SharePoint you see and use a lot of GUIDs. Creating them can be done by using guidgen.exe. When you just need a few it works just fine. But I need a lot and I like my keyboard. So I wanted a shortcut key to generate GUID. This is how I did do it.

## Create a macro in Visual Studio

First open the Macro explorer. You can find it under `Tools –> Macros -> Macro Explorer`.

Right click on MyMacros and choose “New Module”. Name it “GenerateGUID” and press the Add button.

You’ll notice that “GenerateGUID” has been added to MyMacros. Double click on the “GenerateGUID” file to open the editor.

Copy the following piece of VB code in your GenerateGUID Module.

```vb
Sub GenerateGUID()
  Dim textSelection As TextSelection = DTE.ActiveDocument.Selection
  textSelection.Text = Guid.NewGuid().ToString().ToUpper()
End Sub
```

## Bind shortcut to macro

Open the keyboard mappings dialog, you can find it under: “Tools –> Options –> Environment -> Keyboard”.

Ikeyboardn the “Show commands containing” textbox, start typing MyMacros. The new created Macros should appears.

Activate the “Press shortcut keys” textbox, by clicking in it. Then choose the shortcut you want to use, just by pressing the key-combination you prefer. I used “ALT + G”.

That’s all there is to it! You can test it by opening a file and pressing the shortcut. A fresh GUID will appear!