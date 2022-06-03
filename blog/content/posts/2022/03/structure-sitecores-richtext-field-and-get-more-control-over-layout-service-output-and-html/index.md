---
title: "Structure Sitecore's RichText field and get more control over layout service output and HTML"
path: "/structure-sitecores-richtext-field-and-get-more-control-over-layout-service-output-and-html/"
tags: ["Sitecore", "JSS", "Headless", "Layout Service"]
excerpt: Sitecore's rich text field is a good, bad, and ugly field. It's a real Swiss army knife. It can be used to create a lot of different HTML structures. But that's not a structured way to build a site.
created: 2022-06-03
updated: 2022-06-03
featuredImage: "./rich-text-editor.png"
---

The inconvenience with Sitecore's rich text field is that it is a real Swiss army knife. It can be used to create a lot of different HTML structures. But that is not a structured way to build a site. Maintainance can also get hard when a lot of 'code' gets into the content. Besides it can be used to create not allowed HTML structures, content editors can also paste HTML which includes all kinds of HTML you don't want in the HTML output of your public website.

Goals to achieve in this blog post:

- Be in control of the HTML output. E.g. prevent MS Word HTML in the output.
- Split content from code, and be always in control of the visual appearance with code.

## Extending the Sitecore Layout service

First of all, we need to extend the Sitecore Layout service. By extending the Layout Service it will be possible to get more control over the output of the layout service. In the configuration below we will add a processor that will be executed when processing the content of a rich text field.

```xml
  <pipelines>
        <group groupName="layoutService">
            <pipelines>
                <getFieldSerializer>
                    <processor patch:instead="processor[@type='Sitecore.LayoutService.Serialization.Pipelines.GetFieldSerializer.GetRichTextFieldSerializer, Sitecore.LayoutService']"
                      type="TheRoks.Foundation.LayoutServiceExtensions.Pipelines.GetFieldSerializer.GetRichTextFieldSerializer, TheRoks.Foundation.LayoutServiceExtensions"
                      resolve="true">
                        <FieldTypes hint="list">
                            <fieldType id="1">rich text</fieldType>
                        </FieldTypes>
                    </processor>
                </getFieldSerializer>
            </pipelines>
        </group>
    </pipelines>
```

This configuration needs some implementation as well. In the `WriteValue` method we can add a new property, document, to the field. This property will get a structured JSON output. This will be done by the `RichTextParser`. The contents of the `RichTextParser` will be below.

```cs

```cs
public class GetRichTextFieldSerializer : BaseFieldSerializer
{
    private readonly JsonSerializerSettings _serializerSettings = new JsonSerializerSettings()
    {
        NullValueHandling = NullValueHandling.Ignore,
        ContractResolver = new CamelCasePropertyNamesContractResolver()
    };

    public GetRichTextFieldSerializer(IItemSerializer itemSerializer, IFieldRenderer fieldRenderer) : base(fieldRenderer)
    {
        Assert.ArgumentNotNull(itemSerializer, nameof(itemSerializer));
    }

    protected override void WriteValue(Field field, JsonTextWriter writer)
    {
        Assert.ArgumentNotNull(field, nameof(field));
        Assert.ArgumentNotNull(writer, nameof(writer));

        var fieldRendererResult = RenderField(field, true);
        writer.WriteValue(fieldRendererResult.ToString());

        // Add extra property
        writer.WritePropertyName("document");

        var parser = new RichTextParser();
        parser.LoadHtml(fieldRendererResult.ToString());
        var document = parser.ParseToDocument();

        // Write value
        writer.WriteRawValue(JsonConvert.SerializeObject(document, _serializerSettings));
    }
}
```

## Cleaning the RichText field

We want to support all the HTML tags that are allowed in the rich text field. We do not want to allow any HTML tags that are not allowed in the rich text field. Which tags are allowed is up to you. In my opinion, this should be only the tags that have semantic meaning in HTML. We don't want any div, span, etc. in the rich text field. You can always write a custom validator in Sitecore for this. But this will not fix all existing content.

If you think about clean HTML, in basic it's very structured like XML. XML is however not the output we want in the Layout Service. We will process this to be JSON. Therefore we create a model that will be used to process the HTML.

### Modeling the RichText field

In the model, we will create a class that will be used to process the HTML. We create several classes to represent the different HTML tags.

- Node (Text, Paragraph, Heading, etc.), all the supported HTML tags.
- Content, represents the inner tags of the HTML tag.
- Marks, represents the markup that is used in the HTML. I.e. bold, italic, etc.
- Value, represents the value of the HTML tag.

```cs
public class Node
{
    public string NodeType { get; protected set; }
    public IEnumerable<Mark> Marks { get; set; }

    public string Value { get; set; }

    public object Data { get; set; }

    public List<Node> Content { get; set; }
}
```

### Parsing the RichText field

Now it comes to parsing the HTML to the model. We will use the [HtmlAgilityPack](https://html-agility-pack.net/) to parse the HTML.

```cs
public class RichTextParser
{
    private readonly HtmlDocument _htmlDocument = new HtmlDocument();

    public void LoadHtml(string html)
    {
        html = CleanHtml(html);
        _htmlDocument.LoadHtml(html);
    }

    public Node ParseToDocument()
    {
        if (_htmlDocument == null) { return null; }
        var document = new Document();
        var parser = new HtmlElementToNodeParser<Document>();
        document.Content = parser.ParseNodes(_htmlDocument.DocumentNode.ChildNodes);
        return document;
    }

    private static string CleanHtml(string html)
    {
        html = html.Replace(Environment.NewLine, string.Empty);
        return html;
    }
}
```

```cs
internal class HtmlElementToNodeParser<T> : IHtmlDocumentToNodeParser where T : Node, new()
    {
        private Dictionary<string, IHtmlDocumentToNodeParser> _parsers => GetParsers();
        private readonly Func<HtmlNode, List<Node>> _contentParser;
        private readonly Func<HtmlNode, object> _dataParser;
        private readonly Func<HtmlNode, string> _valueParser;
        private readonly Func<HtmlNode, IEnumerable<Mark>> _marksParser;

        internal HtmlElementToNodeParser(Func<HtmlNode, List<Node>> content = null,
            Func<HtmlNode, object> data = null,
            Func<HtmlNode, string> value = null,
            Func<HtmlNode, IEnumerable<Mark>> marks = null)
        {
            _contentParser = content;
            _dataParser = data;
            _valueParser = value;
            _marksParser = marks;
        }

        private Dictionary<string, IHtmlDocumentToNodeParser> GetParsers()
        {
            return new Dictionary<string, IHtmlDocumentToNodeParser>()
            {
                { "p", new HtmlElementToNodeParser<Paragraph>(content: DefaultContent) },
                { "ul", new HtmlElementToNodeParser<UnorderedList>(content: DefaultContent) },
                { "ol", new HtmlElementToNodeParser<OrderedList>(content: DefaultContent) },
                { "li", new HtmlElementToNodeParser<ListItem>(content: DefaultContent) },
                { "h1", new HtmlElementToNodeParser<Heading1>(content: DefaultContent) },
                { "h2", new HtmlElementToNodeParser<Heading2>(content: DefaultContent) },
                { "h3", new HtmlElementToNodeParser<Heading3>(content: DefaultContent) },
                { "h4", new HtmlElementToNodeParser<Heading4>(content: DefaultContent) },
                { "h5", new HtmlElementToNodeParser<Heading5>(content: DefaultContent) },
                { "h6", new HtmlElementToNodeParser<Heading6>(content: DefaultContent) },
                { "blockquote", new HtmlElementToNodeParser<Blockquote>(content: DefaultContent) },
                { "hr", new HtmlElementToNodeParser<Hr>() },
                { "a", new HtmlElementToNodeParser<Hyperlink>(content: DefaultContent, data: LinkData) },
                { "img", new HtmlElementToNodeParser<Image>(content: DefaultContent, data: ImageData) },
                { "b", new HtmlElementToNodeParser<Text>(marks: DefaultMarks, value: DefaultValue) },
                { "u", new HtmlElementToNodeParser<Text>(marks: DefaultMarks, value: DefaultValue) },
                { "i", new HtmlElementToNodeParser<Text>(marks: DefaultMarks, value: DefaultValue) },
                { "em", new HtmlElementToNodeParser<Text>(marks: DefaultMarks, value: DefaultValue) },
                { "code", new HtmlElementToNodeParser<Text>(marks: DefaultMarks, value: DefaultValue) },
                { "strong", new HtmlElementToNodeParser<Text>(marks: DefaultMarks, value: DefaultValue) },
                { "#text", new HtmlElementToNodeParser<Text>(value: ValueExitWhenEmpty, marks: EmptyMarks) },
                { "span", new HtmlElementToNodeParser<Text>(value: ValueExitWhenEmpty, marks: EmptyMarks, content: DefaultContent) }
            };
        }

        private static object ImageData(HtmlNode htmlNode)
        {
            return new ImageData
            {
                Uri = htmlNode.GetAttributeValue("src", null),
                Width = htmlNode.GetAttributeValue("width", null),
                Height = htmlNode.GetAttributeValue("height", null),
                Title = htmlNode.GetAttributeValue("title", null)
            };
        }

        private static object LinkData(HtmlNode htmlNode)
        {
            return new LinkData
            {
                Uri = htmlNode.GetAttributeValue("href", null),
                Rel = htmlNode.GetAttributeValue("rel", null),
                Target = htmlNode.GetAttributeValue("target", null),
                Title = htmlNode.GetAttributeValue("title", null)
            };
        }

        private static string DefaultValue(HtmlNode htmlNode)
        {
            if (!string.IsNullOrWhiteSpace(htmlNode.InnerText))
            {
                return htmlNode.InnerText;
            }
            return null;
        }

        private static string ValueExitWhenEmpty(HtmlNode htmlNode)
        {
            if (string.IsNullOrWhiteSpace(htmlNode.InnerText))
            {
                throw new NotImplementedException();
            }
            return htmlNode.InnerText;
        }

        private static IEnumerable<Mark> EmptyMarks(HtmlNode htmlNode)
        { return new List<Mark>(); }

        private static IEnumerable<Mark> DefaultMarks(HtmlNode htmlNode)
        { return GetMarks(htmlNode); }

        private List<Node> DefaultContent(HtmlNode htmlNode)
        { return ParseNodes(htmlNode.ChildNodes); }

        public List<Node> ParseNodes(HtmlNodeCollection nodes)
        {
            var result = new List<Node>();

            result.AddRange(nodes.Select(node =>
            {
                IHtmlDocumentToNodeParser parser = new HtmlElementToNodeParser<Unsupported>(content: (htmlNode) => { return ParseNodes(htmlNode.ChildNodes); });
                if (_parsers.ContainsKey(node.Name))
                {
                    parser = _parsers[node.Name];
                }
                return parser.ParseNode(node);
            }).Where(y => y != null));

            return result;
        }

        public Node ParseNode(HtmlNode htmlNode)
        {
            if (htmlNode == null) { return null; }

            var node = new T();
            try
            {
                if (_contentParser != null)
                {
                    node.Content = _contentParser(htmlNode);
                }
                if (_dataParser != null)
                {
                    node.Data = _dataParser(htmlNode);
                }
                if (_valueParser != null)
                {
                    node.Value = _valueParser(htmlNode);
                }
                if (_marksParser != null)
                {
                    node.Marks = _marksParser(htmlNode) ?? new List<Mark>();
                }
            }
            catch (NotImplementedException)
            {
                return null;
            }
            return node;
        }
        private static IEnumerable<Mark> GetMarks(HtmlNode node)
        {
            var result = node.DescendantsAndSelf().Select(node =>
            {
                switch (node.Name)
                {
                    case "strong":
                    case "b":
                        return Mark.Bold;
                    case "u":
                        return Mark.Underline;
                    case "i":
                    case "em":
                        return Mark.Italic;
                    case "code":
                        return Mark.Code;
                    case "#text":
                        return null;
                    default:
                        return new Mark() { Type = "unsupported" };
                }
            }).Where(y => y != null);

            return result;
        }
    }
```

### Layout Service output

The structured output of the Layout Service will be as shown below. Every HTML element will be a JSON object which will describe all of its properties. The HTML elements and attributes that are not supported will be ignored by the parsers and therefore not shown in the output.

```json
"fields": {
  "Text": {
    "value": "<p>In deze paragraaf laten we nog eens wat er gebeurd als je via de Rich Text editor lijstjes toevoegt aan de paragraaf. Je kun een ordered (genummerd) en een unordered (bullets) toevoegen. Het voordeel van deze manier is dat je wel linkjes en andere markup in de list items kunt zetten.</p>\r\n<ol>\r\n    <li>Dit is item 1 met een <a href=\"/test/content\">link</a></li>\r\n    <li>Dit is item 2 met <strong>strong</strong> text</li>\r\n    <li>Dit is item 3 met <em>emphasized</em> text</li>\r\n</ol>\r\n<ul>\r\n    <li>Dit is item 1 met een <a href=\"/test/content\">link</a></li>\r\n    <li>Dit is item 2 met <strong>strong </strong>text</li>\r\n    <li>Dit is item 3 met <em>emphasized </em>text</li>\r\n</ul>",
    "document": {
      "nodeType": "Document",
      "content": [
        {
          "nodeType": "paragraph",
          "content": [
            {
              "nodeType": "text",
              "marks": [],
              "value": "In deze paragraaf laten we nog eens wat er gebeurd als je via de Rich Text editor lijstjes toevoegt aan de paragraaf. Je kun een ordered (genummerd) en een unordered (bullets) toevoegen. Het voordeel van deze manier is dat je wel linkjes en andere markup in de list items kunt zetten."
            }
          ]
        },
        {
          "nodeType": "ordered-list",
          "content": [
            {
              "nodeType": "list-item",
              "content": [
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "Dit is item 1 met een "
                },
                {
                  "nodeType": "hyperlink",
                  "data": {
                    "uri": "/test/content"
                  },
                  "content": [
                    {
                      "nodeType": "text",
                      "marks": [],
                      "value": "link"
                    }
                  ]
                }
              ]
            },
            {
              "nodeType": "list-item",
              "content": [
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "Dit is item 2 met "
                },
                {
                  "nodeType": "text",
                  "marks": [
                    {
                      "type": "bold"
                    }
                  ],
                  "value": "strong"
                },
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": " text"
                }
              ]
            },
            {
              "nodeType": "list-item",
              "content": [
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "Dit is item 3 met "
                },
                {
                  "nodeType": "text",
                  "marks": [
                    {
                      "type": "italic"
                    }
                  ],
                  "value": "emphasized"
                },
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": " text"
                }
              ]
            }
          ]
        },
        {
          "nodeType": "unordered-list",
          "content": [
            {
              "nodeType": "list-item",
              "content": [
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "Dit is item 1 met een "
                },
                {
                  "nodeType": "hyperlink",
                  "data": {
                    "uri": "/test/content"
                  },
                  "content": [
                    {
                      "nodeType": "text",
                      "marks": [],
                      "value": "link"
                    }
                  ]
                }
              ]
            },
            {
              "nodeType": "list-item",
              "content": [
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "Dit is item 2 met "
                },
                {
                  "nodeType": "text",
                  "marks": [
                    {
                      "type": "bold"
                    }
                  ],
                  "value": "strong "
                },
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "text"
                }
              ]
            },
            {
              "nodeType": "list-item",
              "content": [
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "Dit is item 3 met "
                },
                {
                  "nodeType": "text",
                  "marks": [
                    {
                      "type": "italic"
                    }
                  ],
                  "value": "emphasized "
                },
                {
                  "nodeType": "text",
                  "marks": [],
                  "value": "text"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

Here ends the Sitecore C# implementation part. With this solution the output can be interpreted by all kinds of implementations. Sitecore main focus is websites, but an implementation by an app is also possbile without the need of a webviewer component.

The rest of the code will focus on the web implementation. This can be done in the frontend library of your choice, in this case, I'll show an Angular implementation.

## Sitecore JSS SDK

For this part, we'll use the Sitecore JSS SDK for Angular. The solution as shown can also be used for React, Vue, or any other frontend framework supported by Sitecore.

### Custom Rich Text Angular directive

Sitecore comes with a RichText directive we need to use for rendering a rich text field. We need to make our implementation of this directive.

```typescript
  import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { documentToHtmlString, Options } from './node-renderers';
import { ExtendedRichTextField } from './rich-text-field';

@Directive({
  selector: '[customRichText]',
})
export class RichTextDirective implements OnChanges {
  private viewRef: EmbeddedViewRef<unknown>;

  @Input('customRichTextEditable') editable = true;

  @Input('customRichText') field: ExtendedRichTextField;

  @Input('customRichTextOptions') options: Partial<Options> = {};

  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<unknown>) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.field || changes.editable || changes.options) {
      if (!this.viewRef) {
        this.viewContainer.clear();
        this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
      }

      this.updateView();
    }
  }

  private updateView() {
    const field = this.field;
    if (!field || (!field.editable && !field.value)) {
      return;
    }

    const html = field.editable && this.editable ? field.editable : documentToHtmlString(field.document, this.options);
    this.viewRef.rootNodes.forEach((node) => {
      node.innerHTML = html;
    });
  }
}
```

Compared with the Sitecore directive there are 3 lines added/changed:

- `import { documentToHtmlString, Options } from './node-renderers';`
- `@Input('customRichTextOptions') options: Partial<Options> = {};`
- `const html = field.editable && this.editable ? field.editable : documentToHtmlString(field.document, this.options);`

With this change, we can read the new document property and use it to render the rich text field. Now we will interpret the document and create HTML for it.

```typescript
import escape from 'escape-html';
import {
  Block, BLOCKS, Document, helpers, Inline, INLINES, Mark, MARKS, Text,
} from './rich-text-types';

const attributeValue = (value: string) => `"${value.replace(/"/g, '&quot;')}"`;

const defaultNodeRenderers: RenderNode = {
  [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`,
  [BLOCKS.HEADING_1]: (node, next) => `<h1>${next(node.content)}</h1>`,
  [BLOCKS.HEADING_2]: (node, next) => `<h2>${next(node.content)}</h2>`,
  [BLOCKS.HEADING_3]: (node, next) => `<h3>${next(node.content)}</h3>`,
  [BLOCKS.HEADING_4]: (node, next) => `<h4>${next(node.content)}</h4>`,
  [BLOCKS.HEADING_5]: (node, next) => `<h5>${next(node.content)}</h5>`,
  [BLOCKS.HEADING_6]: (node, next) => `<h6>${next(node.content)}</h6>`,
  [BLOCKS.UL_LIST]: (node, next) => `<ul>${next(node.content)}</ul>`,
  [BLOCKS.OL_LIST]: (node, next) => `<ol>${next(node.content)}</ol>`,
  [BLOCKS.LIST_ITEM]: (node, next) => `<li>${next(node.content)}</li>`,
  [BLOCKS.QUOTE]: (node, next) => `<blockquote>${next(node.content)}</blockquote>`,
  [BLOCKS.HR]: () => '<hr/>',
  [BLOCKS.TABLE]: (node, next) => `<table>${next(node.content)}</table>`,
  [BLOCKS.TABLE_ROW]: (node, next) => `<tr>${next(node.content)}</tr>`,
  [BLOCKS.TABLE_HEADER_CELL]: (node, next) => `<th>${next(node.content)}</th>`,
  [BLOCKS.TABLE_CELL]: (node, next) => `<td>${next(node.content)}</td>`,
  [INLINES.HYPERLINK]: (node, next) => {
    const href = typeof node.data.uri === 'string' ? node.data.uri : '';
    return `<a href=${attributeValue(href)}>${next(node.content)}</a>`;
  },
  [INLINES.IMAGE]: (node) => {
    const src = typeof node.data.uri === 'string' ? node.data.uri : '';
    const width = typeof node.data.width === 'string' ? node.data.width : '';
    const height = typeof node.data.height === 'string' ? node.data.height : '';
    const alt = typeof node.data.title === 'string' ? node.data.title : '';
    return `<img src=${attributeValue(src)} width=${attributeValue(width)} height=${attributeValue(height)} alt=${attributeValue(alt)} />`;
  },
  ['unsupported']: (node, next) => `${next(node.content)}`,
};

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: text => `<strong>${text}</strong>`,
  [MARKS.ITALIC]: text => `<em>${text}</em>`,
  [MARKS.UNDERLINE]: text => `<u>${text}</u>`,
  [MARKS.CODE]: text => `<code>${text}</code>`,
};

export type CommonNode = Text | Block | Inline;

export interface Next {
  (nodes: CommonNode[]): string;
}

export interface NodeRenderer {
  (node: Block | Inline, next: Next): string;
}

export interface RenderNode {
  [k: string]: NodeRenderer;
}

export interface RenderMark {
  [k: string]: (text: string) => string;
}

export interface Options {
  /**
   * Node renderers
   */
  renderNode?: RenderNode;
  /**
   * Mark renderers
   */
  renderMark?: RenderMark;
}

/**
 * Serialize a Sitecore Rich Text `document` to an html string.
 */
export function documentToHtmlString(
  richTextDocument: Document,
  options: Partial<Options> = {},
): string {
  if (!richTextDocument || !richTextDocument.content) {
    return '';
  }

  return nodeListToHtmlString(richTextDocument.content, {
    renderNode: {
      ...defaultNodeRenderers,
      ...options.renderNode,
    },
    renderMark: {
      ...defaultMarkRenderers,
      ...options.renderMark,
    },
  });
}

function nodeListToHtmlString(nodes: CommonNode[], { renderNode, renderMark }: Options): string {
  return nodes
    .map<string>(node => nodeToHtmlString(node, { renderNode, renderMark }))
    .join('');
}

function nodeToHtmlString(node: CommonNode, { renderNode, renderMark }: Options): string {
  if (helpers.isText(node)) {
    const nodeValue = escape(node.value);
    if (node.marks.length > 0) {
      return node.marks.reduce((value: string, mark: Mark) => {
        if (!renderMark[mark.type]) {
          return value;
        }
        return renderMark[mark.type](value);
      }, nodeValue);
    }

    return nodeValue;
  }
  const nextNode: Next = nodes => nodeListToHtmlString(nodes, { renderMark, renderNode });
  if (!node.nodeType || !renderNode[node.nodeType]) {
    return '';
  }
  return renderNode[node.nodeType](node, nextNode);

}
```

Now we have parsed the document to clean HTML. With the options attribute in the directive, we can even pass an override on the default HTML element we want to use. In case of a list where you need to add an extra class to the HTML element, you can do so by passing a class.

### Using the directive

Customizing the options with classes

```typescript
import { Component } from '@angular/core';
import { JssComponent } from '@theroks/shared/jss-utils';
import { Options } from './node-renderers';
import { RichTextContentFields } from './rich-text-content.types';
import { BLOCKS } from './rich-text-types';

@Component({
  selector: 'custom-rich-text-content',
  templateUrl: './rich-text-content.component.html',
})
export class RichTextContentComponent extends JssComponent<RichTextContentFields> {
  options: Partial<Options> = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`,
      [BLOCKS.UL_LIST]: (node, next) => `<ul class="list list--bullet">${next(node.content)}</ul>`,
      [BLOCKS.LIST_ITEM]: (node, next) => `<li class="list__item">${next(node.content)}</li>`,
    },
  };
}
```

## Summary

In this blog post, we have covered in short how you can get in control of the rich text field output. The code examples are not complete, There are references in the example code that I did not provide in this blog post. These are mainly PoCo classes/interfaces. The idea to structure the content like this is not my own. I have used this in the past together with [Contentful](https://www.contentful.com/). Which also provides an frontend implementation of this structure in [React](https://github.com/contentful/rich-text/blob/master/packages/rich-text-html-renderer/src/index.ts).