# pick-le

`pick-le` is a
[Web Component](https://webcomponents.org/) designed to spruce 
up your `select` elements. Inspiration was heavily drawn from the filtering 
dropdowns present in GitHub's Issues and Bootstrap.

## Installation

Install from bower with `bower install pick-le` and do whatever you want to 
do to copy or move `dist/pick-le.js` to a place where you can include it in 
your HTML.

## Using `pick-le`

### Your HTML & CSS

On all screen sizes, `pick-le` will need to be able to get information about
the current scroll position of the page. Here are some rules of thumb to help 
to ensure that `pick-le` won't run into any issues while doing that:

- Set `height: 100%` on both `html` and `body`.
- Set `overflow-x: hidden` on `html` if you like, but **not** on `body`.
- Do not set `position` at all on `html` or `body`.
  
### HTML Elements & CSS Classes

- `<pick-le>`
  
  `pick-le`'s tag name. `pick-le` currently supports declarative 
  instantiation only.
  
- `pick-le-right`
  
  A CSS class that aligns `pick-le`'s popup menu with the right side
  of the `<pick-le>` element rather than the left.
  
The content model of `pick-le` is driven by two selectors:
  
- `:not(.pick-le-tool)`
 
  Descendants matching this rule are left in the document flow; clicking
  on them (or `pick-le` itself) will toggle the expanded state of `pick-le`.

- `.pick-le-tool`
 
  A CSS class that designates a child element as an additional 'tool'
  within `pick-le`'s menu. Some styling will be applied; it is
  recommended that you wrap the element/tool you wish to include
  in a containing `div` that has this class applied to it.
  
**The following two selectors can also be applied to descendants:**
  
- `.pick-le-text`
 
  A CSS class that designates a child element as a target for receiving
  the text of the currently selected option (or in the case of 
  multiple selects, the first selected option.) If `pick-le`
  has no child elements, the `pick-le` itself will receive the text
  as its `textContent`.
  
- `.pick-le-focus`
 
  A CSS class that designates a child element as a target for receiving
  focus when `pick-le`'s menu is closed by hitting `Escape` or `Tab`,
  or by clicking the close button.
  
-----
  
### HTML Attributes & Javascript Properties

- `.expanded` (Javascript property: Boolean)

  Gets or sets whether `pick-le` is expanded. This property manipulates the 
  `aria-expanded` attribute of `pick-le`; hover, that attribute is not to be
  considered part of `pick-le`'s public API.

- `filterable` (HTML attribute: boolean)
- `.filterable` (Javascript property: Boolean)

  Specifies whether or not `pick-le` should display the option filtering tool.

- `list` (HTML attribute: string)
- `.list` (Javascript property: HTMLSelectElement)
  
  The string provided to the attribute should match the `id` attribute of the `<select>`
  element that `pick-le` should control. The value provided to the property should
  be an instance of `HTMLSelectElement`.
  
  `<select>` elements with and without the 
  `multiple` attribute are supported. `pick-le` will render its list of options from
  the options present in the associated `<select>` list. 
  
  - An `<option>` element's `label` attribute will be rendered as 'strong' text.
  - An `<option>` element's text contents will be rendered as 'normal' text, and if no
    `value` attribute is specified, it will be used as a URL for navigation when
    `pick-le`'s `mode` is `navigate` (see below.)
  - An `<option>` element's `value` attribute will be used as a URL for navigation
    when `pick-le`'s `mode` is `navigate` (see below.) 
  - An `<option>` element's `disabled` and `hidden` attributes will be respected.  
  - `<optgroup>` elements are not considered in any way by `pick-le`, at least for now.

- `mode` (HTML attribute: string)
- `.mode` (Javascript property: String)
  
  One of `select` or `navigate`. An invalid or missing value will 
  default to `select`.
  
  - `select`
  
  	This mode causes the `pick-le` to manipulate the selected 
    `<option>`(s) of and trigger `change` events on the associated 
    `<select>` element.
  
  - `navigate`  
  
  	This mode causes each `<option>` to be interpreted as a link, where 
    selecting an option causes navigation to the URL provided by the 
    `<option>` element's `value` property (which, per the HTML5 specification,
    resolves to the value of the `<option>`'s `value` attribute, or the 
  	whitespace-collapsed value of the `<option>`'s `textContent`.

- `title` (HTML attribute: string)
- `.title` (Javascript property: String)
  
  While this is a standard `HTMLElement` attribute and javascriptproperty, 
  it is worth noting here because the value provided to this attribute will 
  be displayed in the 'title bar' of `pick-le`'s popup menu.
  
- `unresolved`  (HTML attribute: boolean)

  An attribute that will be removed once the custom element is registered and 
  ready to use. This exists as a shim for the `:unresolved` CSS pseudo-class 
  that is introduced with the Custom Elements specification. If you want
  cross-browser styling of unresolved elements, it is recommend that you add
  this attribute to `pick-le`'s markup.
  
-----
  
### Styling

Using the following supported selectors within a `<style is="pick-le-style">`
tag, you can customize the appearance of `pick-le`'s sub-components:

- `pick-le::shadow .popup` - The popup menu. You can apply text/font styles here and they will propagate throughout `pick-le`.
- `pick-le::shadow .title` - The title bar
- `pick-le::shadow .close` - The close button within the title bar
- `pick-le::shadow .close svg` - The close button glyph
- `pick-le::shadow .filter` - The filter bar
- `pick-le::shadow .filter input` - The filter input
- `pick-le::shadow .list` - The option list
- `pick-le::shadow .option` - An individual option, with the following available subclasses:
    - `.highlighted`
    - `.selected`
    - `.disabled`
- `pick-le::shadow .glyph` - The 'selected' glyph's container
- `pick-le::shadow .glyph svg` - The 'selected' glyph
- `pick-le::shadow .label` - The label within the option
- `pick-le::shadow .text` - The text within the option

Shadow selectors not listed here are not considered part of `pick-le`'s public 
API, except for those that target some pseudo-element or pseudo-class of the 
above elements (e.g. `pick-le::shadow .option:first-child` or 
`pick-le::shadow .label::first-letter`.) 

It is **highly recommended** that you place these customized styles
in a `<style is="pick-le-style">` tag so they will be automatically shimmed,
including in the event that the
[CSS Scoping Module specification](http://dev.w3.org/csswg/css-scoping/) 
changes or another way of styling web components becomes standard (such as
custom pseudo elements or cascading variables.) _The way that `pick-le`
manages Shadow DOM stuff in non-supporting browsers is subject to change
and any hand-shimmed selectors you write may stop working._

An example of the `<style is="pick-le-style">` element's usage:

```
<style is="pick-le-style">
    pick-le::shadow .popup {
        border: 3px outset silver;
        border-radius: 0;
        text-transform: uppercase;
    }
    
    pick-le::shadow .title {
        background: linear-gradient(to right, darkblue 0, steelblue 100%);
        color: white;
    }
    
    pick-le::shadow .filter {
        background: lightgray;
    }
    
    pick-le::shadow .filter input {
        border-radius: 0;
        border: 2px inset silver;
        outline: none;
    }

    pick-le::shadow .close {
        background: lightgray;
        border: 2px outset silver;
        width: 20px;
        height: 20px;
        color: black;
    }

    pick-le::shadow .close svg {
        display: block;
        width: 14px;
        height: 14px;
        margin: 1px;
    }
    
    pick-le::shadow .option {
        border: 1px solid transparent;
        border-bottom-color: gainsboro;
    }

    pick-le::shadow .option.selected {
        background-color: darkblue;
        color: whitesmoke;
        border: 1px solid darkblue;
    }

    pick-le::shadow .option.highlighted {
        background-color: darkblue;
        color: whitesmoke;
        border: 1px dotted white;
    }
    
    /* Windows 98 called, it wants its aesthetic plastered all over your app */
</style>
```

-----
  
### Examples  
```
<pick-le unresolved filterable title="Select a Make" list="make-list" mode="navigate">
    <div class="btn btn-default pick-le-focus" aria-role="button" tabindex="0">
        <span class="pick-le-text"></span>
        <span class="caret"></span>
    </div>
    <div class="pick-le-tool">
        <a href="http://www.kbb.com/">Kelley Blue Book</a>
    </div>
    <select id="make-list" hidden>
        <option label="Chevrolet" value="www.chevrolet.com">
            Impala, Avalanche, etc.
        </option>
        <option label="Ford" value="www.ford.com">
            Fusion, F-150, etc.
        </option>
        <option label="GMC" value="www.gmc.com">
            Acadia, Sierra, etc.
        </option>
    </select>
</pick-le>
```

## Accessibility & Mobile

`pick-le` should be accessible for all users, so attention has paid into making sure the 
following topics have been addressed:

- **Accessibility attributes**
    - `pick-le` will set its `aria-role` attribute to `combobox` and its 
      `aria-controls` attribute to the id of the associated `<select>` element
      automatically; it also manages its `aria-expanded` property.
    - All of `pick-le`'s option will be render with the appropriate `aria-*` attributes
      according to their state:
        - `aria-hidden`
        - `aria-disabled`
        - `aria-selected`
        - `aria-role` (`option` or `option link`)
    - Other sub-controls of `pick-le` are also assigned appropriate `aria-*` values,
      such as the 'close' button.
- **Keyboard navigation**
    - `Tab`
        - **Collapse** `pick-le` and give focus back to the toggle, if expanded
    - `Enter`
        - **Select** the highlighted option, or navigate to the link it represents
        - **Expand** `pick-le`, if collapsed
    - ` ` (Space)
        - **Expand** `pick-le`, if collapsed
    - `Escape`
        - **Collapse** `pick-le`, if expanded
    - `ArrowUp`
        - **Expand** `pick-le`, if collapsed
        - **Highlight** the previous option, if available
    - `ArrowDown`
        - **Expand** `pick-le`, if collapsed
        - **Highlight** the next option, if available
    - Everything else redirects to the filter input when expanded, if available
- **Mobile devices, touch screens, & small screens**
    - The `pointer` media query is unfortunately not yet commonplace,
      so we don't have much a 'true' test when it comes to this stuff. However,
      `pick-le` borrows the 'extra small screen' breakpoint from Bootstrap
      to make its menu go full-screen with a slightly larger 'close' button.
      `-webkit-touch-scrolling` is also configured for the option list, and some
      work has been done to help prevent weird `position: fixed` bugs with input
      focusing and content scrolling.
      Mobile, touch, and small screen support should improve as the standards
      continue to develop.

## Browser support

`pick-le` relies on the **Custom Elements** and **Shadow DOM** APIs. You will
want to bring in a polyfill for **Custom Elements**, whether you use 
[WebReflection/document-register-element](https://github.com/WebReflection/document-register-element)
or [webcomponents/webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).
I have to recommend _not_ using the Shadow DOM polyfill from 
[webcomponents/webcomponentsjs](https://github.com/webcomponents/webcomponentsjs),
as it has a large performance impact and is really not necessary. For browsers
that lack native support, `pick-le` provides its own minimalistic polyfill.

To help you gauge browser support and the need for polyfills, 
here is a small list some of the various 'modern' DOM APIs that `pick-le` uses:

- `window.matchMedia`
- `classList`
- `WeakMap`
- `CustomEvent`

Some details about how `pick-le` polyfills the required Shadow DOM functionality:

- A specific build of the stylesheet is appended to the document's head
- `shadowRoot` is partially implemented on the `pick-le` element, for `pick-le`'s 
  internal use only
- The `shadowRoot` implementation basically shims `querySelector`, `querySelectorAll`,
  and `getElementById` so they are 'filtered down' to finding elements that have a 
  specific CSS class that is generated at runtime
- Programmatic manipulation of child nodes and elements is not supported
- Other features of the Shadow DOM specification, including but not limited to
shadow insertion points, event retargeting, event paths, or inert HTML elements,
are not shimmed or polyfilled in any way.

## Credits

- [FontAwesome](http://fortawesome.github.io/Font-Awesome/) 
  for the excellent icons
- [encharm/Font-Awesome-SVG-PNG](https://github.com/encharm/Font-Awesome-SVG-PNG) 
  for the SVG versions of the FontAwesome icons
- [twbs/bootstrap](https://github.com/twbs/bootstrap)
  for the design foundation
- [GitHub](https://github.com)
  for the design foundation
- [Polymer](https://github.com/Polymer/polymer)
  for the stylesheet polyfill idea