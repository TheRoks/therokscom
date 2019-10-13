---
title: "Custom asset picker with Enhanced URLField"
path: "/custom-asset-picker-with-enhanced-urlfield"
tags: ["SharePoint"]
excerpt: Working on a SharePoint 2010 WCM site I had the requirement to deliver a more content editor friendly SharePoint. Especially when it becomes to url fields. Content editors are asked to copy-paste urls in SharePoints out-of-the-box url fields. In contrast to the Publishing Content Field, the url field does not come with an asset picker.
created: 2012-09-26
updated: 2012-09-26
---

Working on a SharePoint 2010 WCM site I had the requirement to deliver a more content editor friendly SharePoint. Especially when it becomes to url fields. Content editors are asked to copy-paste urls in SharePoints out-of-the-box url fields. In contrast to the Publishing Content Field, the url field does not come with an asset picker.

## Inconvinient asset picker in SharePoint

Standard SharePoint comes with the field SPFieldUrl. A field is always acompanied with a control that renders the input control. As seen below in the screenshot. The user needs to enter the url with the keyboard. SharePoint only offers a link to test it. This is helpful, but not friendly. On every Publishing Content Field we can insert hyperlinks with a asset picker, this would be nice in all other places.

out of the box sharepoint

## Solution: TheRoks’ Enhanced URLField

What is created is a field type with a custom control. The custom control will extend the default control with an asset picker. So what do you need to do:

1. Override SPFieldURL, or any other SPField
2. Override BaseFieldControl
3. Field definition xml, map this to {SharePointRoot}TemplateXML
4. Field definition xsl, map this to {SharePointRoot}TemplateLAYOUTSXSL

First we need to override the SPFieldUrl. The full explanation is on MSDN. Important things to know when you override this control are:

* String Value
* Custom Value Class
* A custom field value class must implement at least two constructors, and usually only two
* Override the FieldRenderingControl property which returns the control that can be used to render the field in Edit and Display mode

```csharp
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;

namespace TheRoks.EnhancedUrlField.CodeBehind
{
    public class EnhancedFieldUrl : SPFieldUrl
    {
        public EnhancedFieldUrl(SPFieldCollection fields, string fieldName)
            : base(fields, fieldName)
        {
        }

        public EnhancedFieldUrl(SPFieldCollection fields, string typeName, string displayName)
            : base(fields, typeName, displayName)
        {
        }

        public override BaseFieldControl FieldRenderingControl
        {
            get
            {
                BaseFieldControl control = new EnhancedUrlSelectorControl();
                control.FieldName = base.InternalName;
                return control;
            }
        }

        public override object GetFieldValue(string value)
        {
            return value;
        }
    }
}
```

Next thing is override the BaseFieldControl. This is also documented on MSDN. What’s important:

Field Validation

* Validate the control valies before setting the field values in the Field Control class
  * Set the IsValid to false
  * Set the ErrorMessage to an appropriate error message
* Override the Validate method in the Field Control class
  * Set the IsValid to false
  * Set the ErrorMessage to an appropriate error message
* Override the GetValidatedString in the Field class
  * Throw SPFieldValidationException as an error

```csharp
using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Publishing.WebControls;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.WebControls;

namespace TheRoks.EnhancedUrlField.CodeBehind
{
    public class EnhancedUrlSelectorControl : BaseFieldControl
    {
        protected HyperLink testHyperLinkControl;
        protected AssetUrlSelector urlSelector;
        protected TextBox urlText;

        public override object Value
        {
            get
            {
                var URLValue = new SPFieldUrlValue();
                URLValue.Description = urlText.Text;
                URLValue.Url = urlSelector.AssetUrl;
                return URLValue;
            }
            set
            {
                var URLValue = new SPFieldUrlValue(value as string);
                urlText.Text = URLValue.Description;
                urlSelector.AssetUrl = URLValue.Url;
            }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            // Set the value if this is a postback.
            if ((Page.IsPostBack) && (base.ControlMode == SPControlMode.Edit || base.ControlMode == SPControlMode.New))
            {
                base.UpdateFieldValueInItem();
            }
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            if (urlSelector != null && testHyperLinkControl != null)
            {
                //Necessary to retrieve AssetUrl, otherwise textbox does not have clientId.
                string assetUrl = this.urlSelector.AssetUrl;
                testHyperLinkControl.NavigateUrl = "javascript:TestURL('" +
                                                   SPHttpUtility.EcmaScriptStringLiteralEncode(
                                                       urlSelector.AssetUrlClientID) + "')";
            }
        }

        protected override void CreateChildControls()
        {
            Controls.Add(new LiteralControl(GetResource("LabelWebAddressStart")));
            testHyperLinkControl = new HyperLink {Text = GetResource("LabelTestLink")};
            Controls.Add(testHyperLinkControl);
            Controls.Add(new LiteralControl(GetResource("LabelWebAddressEnd")));
            base.CreateChildControls();
            // Add the asset picker when in edit or new mode.
            if (base.ControlMode == SPControlMode.Edit || base.ControlMode == SPControlMode.New)
            {
                urlSelector = new AssetUrlSelector();
                Controls.Add(urlSelector);
                urlText = new TextBox();
                Controls.Add(new LiteralControl(GetResource("LabelDescription")));
                Controls.Add(urlText);
            }
        }

        public override void Validate()
        {
            if (ControlMode == SPControlMode.Display || !IsValid)
            {
                return;
            }
            base.Validate();
            if (Field.Required)
            {
                if ((Value == null))
                {
                    ErrorMessage = string.Format(GetResource("ErrorMessageValue"), Field.Title);
                    IsValid = false;
                }
                else if (Value != null)
                {
                    var mcv = (SPFieldUrlValue) Value;
                    if (mcv.Description.Length == 0)
                    {
                        ErrorMessage = string.Format(GetResource("ErrorMessageTitle"), Field.Title);
                        IsValid = false;
                        return;
                    }
                    if (mcv.Url.Length == 0)
                    {
                        ErrorMessage = string.Format(GetResource("ErrorMessageUrl"), Field.Title);
                        IsValid = false;
                    }
                }
            }
        }

        private static string GetResource(string key)
        {
            return SPUtility.GetLocalizedString(string.Format("$Resources:{0}", key),
                                                "TheRoks.EnhancedURLField",
                                                (uint) SPContext.Current.Web.Locale.LCID);
        }
    }
}
```

Next we create a xml and xsl file. This are fldtypes_EnhancedURLField.xml and fldtypes_EnhancedURLField.xsl. These needs this names because there is a naming convention. The xml is the field type definition file. It describes the field and it’s properties. Full documenation is on [MSDN](http://msdn.microsoft.com/en-us/library/bb861838.aspx).

The Field type definition xml

```xml
<?xml version="1.0" encoding="utf-8" ?>
<FieldTypes>
  <FieldType>
    <Field Name="TypeName">EnhancedFieldUrl</Field>
    <Field Name="ParentType">URL</Field>
    <Field Name="TypeDisplayName">Enhanced URL Selector</Field>
    <Field Name="TypeShortDescription">Enhanced URL Selector</Field>
    <Field Name="UserCreatable">TRUE</Field>
    <Field Name="FieldTypeClass">TheRoks.EnhancedUrlField.CodeBehind.EnhancedFieldUrl, TheRoks.EnhancedUrlField, Version=1.0.0.0, Culture=neutral, PublicKeyToken=f4aca7afa0e2c265</Field>
  </FieldType>
</FieldTypes>
```

The xsl to create custom rendering of a field

```xml
<xsl:stylesheet xmlns:x=http://www.w3.org/2001/XMLSchema xmlns:d=http://schemas.microsoft.com/sharepoint/dsp version="1.0" exclude-result-prefixes="xsl msxsl ddwrt" xmlns:ddwrt=http://schemas.microsoft.com/WebParts/v2/DataView/runtime xmlns:asp=http://schemas.microsoft.com/ASPNET/20 xmlns:__designer=http://schemas.microsoft.com/WebParts/v2/DataView/designer xmlns:xsl=http://www.w3.org/1999/XSL/Transform xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:SharePoint="Microsoft.SharePoint.WebControls" xmlns:ddwrt2="urn:frontpage:internal">
  <xsl:template match="FieldRef[@FieldType='EnhancedFieldUrl']" mode="URL_body">
    <xsl:param name="thisNode" select="." />
    <xsl:variable name="url" select="$thisNode/@*[name()=current()/@Name]" />
    <xsl:variable name="desc" select="$thisNode/@*[name()=concat(current()/@Name, '.desc')]" />
    <xsl:choose>
      <xsl:when test="$url=''">
        <xsl:if test="$desc=''">
          <xsl:value-of select="$desc"/>
        </xsl:if>
      </xsl:when>
      <xsl:otherwise>
        <a href="{$url}" >
          <xsl:choose>
            <xsl:when test="$desc=''">
              <xsl:value-of select="$url"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$desc"/>
            </xsl:otherwise>
          </xsl:choose>
        </a>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
```

The result gives a browse button which will show an asset picker.

enhanced urlfield with asset picker

[Updated 11-01-2013] [Download Visual Studio 2010 solution](./EnhancedURLField.zip)

Check also SharePoint security stuff.
