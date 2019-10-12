---
title: "Dynamically add an icon on new window links"
path: "dynamically-add-an-icon-on-new-window-links"
tags: ["jQuery"]
excerpt: "A common feature on sites and wikis is the “open in new window” icon. It’s not very good idea for several reason to put them al over the HTML, they’re a greate candidate for using progressive enhancement."
created: 2012-05-09
updated: 2012-05-09
---


A common feature on sites and wikis is the “open in new window” icon. It’s not very good idea for several reason to put them al over the HTML, they’re a greate candidate for using progressive enhancement. In our case, we can use jQuery to add the images pretty easily.

## Use the jQuery selectors

First we loop through all the anchor, HTML a element, with the target _blank. This will open the hyperlink in a new window.

Next we test if there’s a class that contains the external window icon. If not present, we set the class.

Last, but not least, we check with the jQuery selector not, .not(“has(img)”) statement if the anchor has an img element inside. In this case it’s not common to use a new window icon.

```js
$(document).ready(function() {
  $('a[target="_blank"]').each(function () {
    if (!$(this).hasClass("external"))
      $(this).not(":has(img)").addClass("external");
  })
});
```
