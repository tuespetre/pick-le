(function() {
    'use strict';

    const SHADOWDOM_POLYFILLED = window.shadowDomPolyfilled;

    const SCREEN_XS_MAX = window.matchMedia('screen and (max-width: 767px)');

    const FRAG = strings => {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('div');

        template.innerHTML = strings[0];

        while (template.firstChild) {
            fragment.appendChild(template.firstChild);
        }

        return fragment;
    };

    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const KEY_SPACE = ' ';
    const KEY_ESCAPE = 'Escape';
    const KEY_ENTER = 'Enter';
    const KEY_TAB = 'Tab';

    const KEY_MAP = Object.freeze({

        // Standard 'key' values, see: http://www.w3.org/TR/DOM-Level-3-Events-key/

        'ArrowUp': KEY_UP,
        'ArrowDown': KEY_DOWN,
        ' ': KEY_SPACE,
        'Escape': KEY_ESCAPE,
        'Enter': KEY_ENTER,
        'Tab': KEY_TAB,

        // Nonstandard 'key' values, used in IE and older Gecko
        // see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

        'Up': KEY_UP,
        'Down': KEY_DOWN,
        'Spacebar': KEY_SPACE,
        'Esc': KEY_ESCAPE,

        // deprecated 'which' and 'keyCode' values

        38: KEY_UP,
        40: KEY_DOWN,
        32: KEY_SPACE,
        27: KEY_ESCAPE,
        13: KEY_ENTER,
        9: KEY_TAB

    });

    const CLASS = Object.freeze({
        PRIVATE_LIST: 'private-list',
        POPUP: 'popup',
        TITLE_TEXT: 'title-text',
        CLOSE: 'close',
        FILTER: 'filter',
        LIST: 'list',
        OPTION: 'option',
        SCOPE: 'pick-le',
        HIGHLIGHTED: 'highlighted',
        SELECTED: 'selected',
        DISABLED: 'disabled'
    });

    const SELECTOR = Object.freeze({
        PICK_LE_FOCUS: '.pick-le-focus',
        PICK_LE_TEXT: '.pick-le-text',
        PRIVATE_TITLE: '.private-title',
        CLOSE: '.close',
        FILTER: '.filter',
        FILTER_INPUT: '.filter input',
        POPUP: '.popup',
        LIST: '.list',
        PRIVATE_LIST: '.private-list',
        OPTION: '.option',
        SELECTED_VISIBLE: '.option.selected:not([hidden])',
        VISIBLE: '.option:not([hidden])'
    });

    const EVENT = Object.freeze({
        CLICK: 'click',
        KEYDOWN: 'keydown',
        INPUT: 'input',
        CHANGE: 'change'
    });

    const ATTR = Object.freeze({
        ROLE: 'role',
        ARIA_EXPANDED: 'aria-expanded',
        ARIA_SELECTED: 'aria-selected',
        ARIA_HIDDEN: 'aria-hidden',
        ARIA_HASPOPUP: 'aria-haspopup',
        ARIA_DISABLED: 'aria-disabled',
        ARIA_ACTIVEDESCENDANT: 'aria-activedescendant',
        ARIA_MULTISELECTABLE: 'aria-multiselectable',
        DATA_INDEX: 'data-index',
        DATA_LABEL: 'data-label',
        DATA_TEXT: 'data-text',
        DATA_VALUE: 'data-value',
        DATA_HIDDEN: 'data-hidden',
        TITLE: 'title',
        LIST: 'list',
        FILTERABLE: 'filterable',
        MODE: 'mode',
        LABEL: 'label',
        VALUE: 'value',
        HREF: 'href',
        TABINDEX: 'tabindex',
        PLACEHOLDER: 'placeholder',
        ID: 'id',
        HIDDEN: 'hidden',
        SELECT: 'select',
        NAVIGATIONAL: 'navigational'
    });

    const TRUE_STRING = 'true';
    const FALSE_STRING = 'false';
    const SELECT_MULTIPLE = 'select-multiple';
    const LISTBOX = 'listbox';
    const TEMPLATE_MAIN = FRAG`<slot></slot><div class="anchor shady-shadow"><div class="popup" tabindex="-1"><div class="title"><span class="private-title"></span> <span class="close" aria-label="Close" role="button"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg></span></div><slot name="pick-le-tool"></slot><div class="filter"><input type="search" autocomplete="off" aria-label="Filter options" tabindex="-1" data-value=""></div><div class="list"><div class="private-list"></div></div></div></div>`;
    const TEMPLATE_OPTION = FRAG`<div id="p-opt-" class="option" tabindex="-1" role="option" aria-selected="false" aria-hidden="false" aria-disabled="false" data-index="" data-label="" data-text="" data-value=""><div class="glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></div><div class="label"></div><div class="text"></div></div>`;
    const TEMPLATE_LINK = FRAG`<a id="p-opt-" href="" class="option" tabindex="-1" role="option" aria-selected="false" aria-hidden="false" aria-disabled="false" data-index="" data-label="" data-text="" data-value=""><div class="glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></div><div class="label"></div><div class="text"></div></a>`;
    const STYLE_SHADOW = `.close,.filter,.glyph,.label,.list,.option,.popup,.text,.title,slot[name=pick-le-tool]::slotted(*){background-clip:border-box;background-color:inherit;box-sizing:border-box;color:inherit;display:block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;line-height:20px;font-size:14px;font-weight:400;height:auto;margin:0;opacity:1;padding:0;text-align:left;text-decoration:none;text-shadow:none;text-transform:inherit;-webkit-transform:none;transform:none;width:auto}.close,.label,.title{font-weight:700}:host{position:relative;display:inline-block}.anchor,.popup{position:absolute}.anchor{top:0;left:0;bottom:0;right:auto;width:0}:host(.pick-le-right) .anchor{right:0;left:auto}.popup{display:none;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important}.filter input,.filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}:host([aria-expanded=true]) .popup{display:block}:host(.pick-le-right) .popup{right:0;left:auto}:host(.pick-le-top) .popup{top:auto;bottom:100%}@media screen and (max-width:767px){:host([aria-expanded=true]) .popup{z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.popup{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}}.list,.option{position:relative}.filter,.title,slot[name=pick-le-tool]::slotted(*){display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px;vertical-align:bottom}.close,.close svg,.title::after{display:inline-block}.filter input,.list{background-color:#fff}.title{color:#111;vertical-align:middle}.title::after{width:0;height:0;font-size:0;content:"";clear:both}.close{font-size:20px;line-height:20px;color:#b7b7b7;float:right}.close:hover{cursor:pointer;color:#111}.close svg{width:15px;height:15px;fill:currentColor}@media screen and (max-width:767px){.title{padding:15px 10px}.close svg{width:20px;height:20px}}.filter[aria-hidden=true]{display:none}.filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.filter input:focus{border-color:#66afe9;outline:0}.list{overflow-x:hidden;overflow-y:auto;max-height:340px;-webkit-overflow-scrolling:touch}@media screen and (max-width:767px){.list{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}}.option{border:none;border-bottom:1px solid #dcdcdc;padding:7px 25px;cursor:pointer}.option.highlighted,.option:active,.option:focus,.option:hover{background-color:#f5f5f5;text-decoration:none;color:#111;outline:0}.option[hidden]{display:none!important}.option.disabled{cursor:default}.glyph{position:absolute;top:7px;left:0;right:auto;bottom:auto;width:25px;height:20px;text-align:center}.glyph svg{visibility:hidden;display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.option.selected .glyph svg{visibility:visible}.label+.text{font-size:.9em;margin-top:7px;color:#777}`;
    const STYLE_SHADY = `.pick-le.close,.pick-le.filter,.pick-le.glyph,.pick-le.label,.pick-le.list,.pick-le.option,.pick-le.popup,.pick-le.text,.pick-le.title,slot.pick-le[name=pick-le-tool]>*{background-clip:border-box;background-color:inherit;box-sizing:border-box;color:inherit;display:block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;line-height:20px;font-size:14px;font-weight:400;height:auto;margin:0;opacity:1;padding:0;text-align:left;text-decoration:none;text-shadow:none;text-transform:inherit;-webkit-transform:none;transform:none;width:auto}.pick-le.close,.pick-le.label,.pick-le.title{font-weight:700}pick-le{position:relative;display:inline-block}.pick-le.anchor{position:absolute;top:0;left:0;bottom:0;right:auto;width:0}pick-le.pick-le-right .pick-le.anchor{right:0;left:auto}.pick-le.popup{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important}.pick-le.filter input,.pick-le.filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}pick-le[aria-expanded=true] .pick-le.popup{display:block}pick-le.pick-le-right .pick-le.popup{right:0;left:auto}pick-le.pick-le-top .pick-le.popup{top:auto;bottom:100%}@media screen and (max-width:767px){pick-le[aria-expanded=true] .pick-le.popup{z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.pick-le.popup{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}}.pick-le.filter,.pick-le.title,slot.pick-le[name=pick-le-tool]>*{display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px;vertical-align:bottom}.pick-le.title{color:#111;vertical-align:middle}.pick-le.title::after{display:inline-block;width:0;height:0;font-size:0;content:"";clear:both}.pick-le.close{display:inline-block;font-size:20px;line-height:20px;color:#b7b7b7;float:right}.pick-le.close:hover{cursor:pointer;color:#111}.pick-le.close svg{width:15px;height:15px;display:inline-block;fill:currentColor}@media screen and (max-width:767px){.pick-le.title{padding:15px 10px}.pick-le.close svg{width:20px;height:20px}}.pick-le.filter[aria-hidden=true]{display:none}.pick-le.filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.pick-le.filter input:focus{border-color:#66afe9;outline:0}.pick-le.list{overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}@media screen and (max-width:767px){.pick-le.list{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}}.pick-le.option{border:none;border-bottom:1px solid #dcdcdc;padding:7px 25px;position:relative;cursor:pointer}.pick-le.option.highlighted,.pick-le.option:active,.pick-le.option:focus,.pick-le.option:hover{background-color:#f5f5f5;text-decoration:none;color:#111;outline:0}.pick-le.option[hidden]{display:none!important}.pick-le.option.disabled{cursor:default}.pick-le.glyph{position:absolute;top:7px;left:0;right:auto;bottom:auto;width:25px;height:20px;text-align:center}.pick-le.glyph svg{visibility:hidden;display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pick-le.option.selected .pick-le.glyph svg{visibility:visible}.pick-le.label+.pick-le.text{font-size:.9em;margin-top:7px;color:#777}pick-le .pick-le.shadow{position:relative}slot[name=pick-le-tool]{-ms-flex-negative:0;flex-shrink:0}`;

    if (!SHADOWDOM_POLYFILLED) {
        const style = document.createElement('style');
        style.textContent = STYLE_SHADOW;
        TEMPLATE_MAIN.insertBefore(style, TEMPLATE_MAIN.firstChild);
    }
    else {
        const style = document.createElement('style');
        style.textContent = STYLE_SHADY;
        document.head.insertBefore(style, document.head.firstChild);

        const transform = node =>
            Array.prototype.forEach.call(
                node.querySelectorAll('*'),
                elem => elem.classList.add(CLASS.SCOPE));

        transform(TEMPLATE_MAIN);
        transform(TEMPLATE_OPTION);
        transform(TEMPLATE_LINK);
    }

    ///////////////////////////////////////////////////////////////////////
    //
    // Deal with fixed position stuffs        
    //
    ///////////////////////////////////////////////////////////////////////

    const overlayContext = new (function() {
        let container = () => document.documentElement,
            map = new WeakMap(),
            length = 0,
            cachedStyle = {},
            cachedScroll = 0,
            overlayStyle = {
                'overflow': 'hidden',
                'position': 'fixed'
            };

        const applyStyles = (currentStyles, newStyles) => {
            for (var prop in overlayStyle) {
                currentStyles[prop] = newStyles[prop];
            }
        }

        const touchContext = {
            startY: 0,
            moveY: 0,
            top: false,
            bottom: false,
            allowY: function(context) {
                return (
                    (context.top && context.moveY > context.startY) ||
                    (context.bottom && context.moveY < context.startY)
                );
            }
        };

        const touchstart = e => {
            let element = e.currentTarget,
                context = map.get(element);

            context.startY = e.targetTouches[0].clientY;
            context.top = element.scrollTop > 0;
            context.bottom = (element.scrollHeight - element.clientHeight) > element.scrollTop;
        };

        const touchmove = e => {
            let element = e.currentTarget,
                context = map.get(element);

            context.moveY = e.targetTouches[0].clientY;

            if (!context.allowY(context)) {
                e.preventDefault();
            }
        };

        return {

            register: function(element) {
                if (map.has(element)) return;

                element.addEventListener('touchstart', touchstart);
                element.addEventListener('touchmove', touchmove);
                map.set(element, Object.create(touchContext));
                length++;

                if (length === 1) {
                    cachedScroll =
                        document.documentElement.scrollTop ||
                        document.body.scrollTop;
                    applyStyles(cachedStyle, container().style);
                    applyStyles(container().style, overlayStyle);
                }
            },

            unregister: function(element) {
                if (!map.has(element)) return;

                element.removeEventListener('touchstart', touchstart);
                element.removeEventListener('touchmove', touchmove);
                map.delete(element);
                length--;

                if (!length) {
                    applyStyles(container().style, cachedStyle);
                    document.documentElement.scrollTop = cachedScroll;
                    document.body.scrollTop = cachedScroll;
                }
            }

        }
    });

    ///////////////////////////////////////////////////////////////////////
    //
    // <pick-le>       
    //
    ///////////////////////////////////////////////////////////////////////

    const internals = Object.freeze({

        create_option: function(option, newNode, addHref) {
            let opt = newNode;

            let vals = {
                index: option.index,
                value: option.value,
                label: option.getAttribute(ATTR.LABEL),
                text: option.textContent.trim(),
                selected: option.selected,
                disabled: option.disabled
            };

            let elems = {
                label: opt.children[1],
                text: opt.children[2]
            };

            opt.id += option.index.toString();
            opt.setAttribute(ATTR.DATA_INDEX, vals.index);
            opt.setAttribute(ATTR.DATA_VALUE, vals.value);
            opt.setAttribute(ATTR.DATA_LABEL, vals.label || '');
            opt.setAttribute(ATTR.DATA_TEXT, vals.text);

            if (addHref) {
                opt.setAttribute(ATTR.HREF, vals.value);
            }

            if (option.hasAttribute(ATTR.HIDDEN)) {
                opt.setAttribute(ATTR.HIDDEN, '');
                opt.setAttribute(ATTR.DATA_HIDDEN, '');
            }

            if (vals.selected) {
                opt.setAttribute(ATTR.ARIA_SELECTED, TRUE_STRING);
                opt.classList.add(CLASS.SELECTED);
            }

            if (vals.disabled) {
                opt.setAttribute(ATTR.ARIA_DISABLED, TRUE_STRING);
                opt.classList.add(CLASS.DISABLED);
            }

            if (vals.label) {
                elems.label.textContent = vals.label;
            }
            else {
                opt.removeChild(elems.label);
            }

            if (vals.text) {
                elems.text.textContent = vals.text;
            }
            else {
                opt.removeChild(elems.text);
            }

            return opt;
        },

        /* 
            Executes a function against each option within a cloned list
            of all options within pick-le; replaces the existing list of
            options with the operated-on close
        */
        each_option: function(func) {
            var oldContainer, newContainer, options;
            oldContainer = this.shadowRoot.querySelector(SELECTOR.PRIVATE_LIST);
            newContainer = oldContainer.cloneNode(true);
            options = newContainer.querySelectorAll(SELECTOR.OPTION);
            for (var i = 0; i < options.length; i++) {
                func(options[i]);
            }
            newContainer.className = oldContainer.className;
            oldContainer.parentNode.replaceChild(newContainer, oldContainer);
        },

        scroll_option_into_view: function(option) {
            // Focusing the option is no bueno.
            // Causes iOS (et al) to hide keyboard
            // if the filter was focused
            // option.focus();

            // Since the goal was to get the highlighted
            // link into view (and because scrollIntoView sucks)
            // we'll just have to adjust the scrollTop ourselves.
            // This requires some certain CSS constraints on
            // the <html> and <body> elements to work cross-browser.
            let menu = this.shadowRoot.querySelector(SELECTOR.LIST),
                v_rect = undefined,
                m_rect = menu.getBoundingClientRect(),
                o_rect = option.getBoundingClientRect();

            if (o_rect.bottom > m_rect.bottom) {
                menu.scrollTop += o_rect.bottom - m_rect.bottom;
            }
            else if (o_rect.top < m_rect.top) {
                menu.scrollTop -= m_rect.top - o_rect.top;
            }

            o_rect = option.getBoundingClientRect();
            v_rect = document.documentElement.getBoundingClientRect();

            if (o_rect.bottom > v_rect.height) {
                let diff = o_rect.bottom - v_rect.height;
                document.body.scrollTop += diff;
                document.documentElement.scrollTop += diff;
            }
            else if (o_rect.top < 0) {
                let diff = 0 - o_rect.top;
                document.body.scrollTop -= diff;
                document.documentElement.scrollTop -= diff;
            }
        },

        apply_highlight: function(option, highlighted) {
            if (highlighted) {
                this.setAttribute(ATTR.ARIA_ACTIVEDESCENDANT, option.id);
                option.classList.add(CLASS.HIGHLIGHTED);
            }
            else {
                option.classList.remove(CLASS.HIGHLIGHTED);
            }
        },

        apply_filter: function(value) {
            let allWereHidden = true,
                highlightedOne = false,
                firstVisible = undefined,
                applyHighlight = (option, highlighted) => internals.apply_highlight.call(this, option, highlighted),
                getFirstVisible = () => internals.get_first_visible_prefer_selected.call(this);

            internals.each_option.call(this, option => {
                let match = internals.match_filter(option, value),
                    display = match && !option.hasAttribute(ATTR.DATA_HIDDEN),
                    selected = option.classList.contains(CLASS.SELECTED),
                    highlight = !highlightedOne && display && (value || selected);

                if (display) {
                    allWereHidden = false;
                    option.removeAttribute(ATTR.HIDDEN);
                }
                else {
                    option.setAttribute(ATTR.HIDDEN, '');
                }

                if (highlight) {
                    highlightedOne = true;
                    applyHighlight(option, true);
                }
                else {
                    applyHighlight(option, false);
                }
            });

            !highlightedOne
                && (firstVisible = getFirstVisible())
                && applyHighlight(firstVisible, true);
        },

        match_filter: function(option, filter) {
            if (!filter) return true;

            filter = filter.toLowerCase();

            let label = option.getAttribute(ATTR.DATA_LABEL),
                text = option.getAttribute(ATTR.DATA_TEXT),
                matchesLabel = label && label.toLowerCase().indexOf(filter) > -1,
                matchesText = text && text.toLowerCase().indexOf(filter) > -1,
                matches = matchesLabel || matchesText;

            return matches;
        },

        toggle_option: function(option) {
            let disabled = option.getAttribute(ATTR.ARIA_DISABLED) === TRUE_STRING,
                list = this.list || {},
                multiple = (list.type === SELECT_MULTIPLE),
                cloned = undefined;

            if (disabled) return;

            internals.each_option.call(this, opt => {
                let index = opt.getAttribute(ATTR.DATA_INDEX),
                    listOption = list[opt.getAttribute(ATTR.DATA_INDEX)],
                    identical = opt.id === option.id,
                    selected = multiple
                        ? (identical ? !listOption.selected : listOption.selected)
                        : identical;

                // IE10 and IE11 and some Android do not support
                // the second parameter for 'toggle'
                listOption.selected = selected;
                opt.classList[selected ? 'add' : 'remove'](CLASS.SELECTED);
                opt.setAttribute(ATTR.ARIA_SELECTED, selected ? TRUE_STRING : FALSE_STRING);
                internals.apply_highlight.call(this, opt, identical);
                identical && (cloned = opt);
            });

            internals.scroll_option_into_view.call(this, cloned);

            if (!multiple) internals.set_display_text.call(this, cloned);

            // 'change' only fires naturally when the user is the one
            // doing the changing. 
            var event;
            try {
                event = new CustomEvent(EVENT.CHANGE);
            }
            catch (e) {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(EVENT.CHANGE, true, true, null);
            }
            list.dispatchEvent(event);
        },

        get_focus_target: function() {
            return this.filterable
                ? this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT)
                : this.shadowRoot.querySelector(SELECTOR.POPUP);
        },

        focus_collapsed_target: function() {
            let target = this.querySelector(SELECTOR.PICK_LE_FOCUS) || this;

            target.focus();
        },

        get_highlighted_option: function() {
            let id = this.getAttribute(ATTR.ARIA_ACTIVEDESCENDANT);

            return this.shadowRoot.getElementById(id);
        },

        set_display_text: function(option) {
            let elem = this.querySelector(SELECTOR.PICK_LE_TEXT),
                value = option
                    ? option.getAttribute(ATTR.DATA_LABEL)
                    || option.getAttribute(ATTR.DATA_TEXT)
                    : null;

            if (elem) elem.textContent = value;
        },

        respond_xs_media_query: function(query) {
            let list = this.shadowRoot.querySelector(SELECTOR.LIST);

            if (query.matches) {
                overlayContext.register(list);
            }
            else {
                overlayContext.unregister(list);
            }
        },

        set_title_text: function(text) {
            let elem = this.shadowRoot.querySelector(SELECTOR.PRIVATE_TITLE);

            if (elem) elem.textContent = text;
        },

        get_first_visible_prefer_selected: function() {
            let list = this.shadowRoot.querySelector(SELECTOR.LIST);

            return list.querySelector(SELECTOR.SELECTED_VISIBLE)
                || list.querySelector(SELECTOR.VISIBLE);
        }

    });

    const handlers = Object.freeze({

        pickle_click: function(e) {
            if (this.getAttribute(ATTR.ARIA_EXPANDED) !== TRUE_STRING) {
                this.expanded = true;
            }
            else {
                this.expanded = false;
                internals.focus_collapsed_target.call(this);
            }
        },

        pickle_keydown: function(e) {
            switch (KEY_MAP[e.key || e.which || e.keyCode]) {

                case KEY_UP:
                    handlers.key_up_down.call(this, e, t => t.previousElementSibling);
                    break;

                case KEY_DOWN:
                    handlers.key_up_down.call(this, e, t => t.nextElementSibling);
                    break;

                case KEY_ESCAPE:
                    handlers.key_escape.call(this, e);
                    break;

                case KEY_SPACE:
                    handlers.key_space.call(this, e);
                    break;

                case KEY_ENTER:
                    handlers.key_enter.call(this, e);
                    break;

                case KEY_TAB:
                    handlers.key_tab.call(this, e);
                    break;

                default:
                    handlers.key_other.call(this, e);
                    break;

            }
        },

        key_up_down: function(e, getSibling) {
            let wasExpanded = this.expanded,
                list = this.querySelector(SELECTOR.LIST),
                target = internals.get_highlighted_option.call(this)
                    || internals.get_first_visible_prefer_selected.call(this),
                original = target;

            if (!target) {
                return;
            }
            else if (!wasExpanded) {
                this.expanded = true;
            }
            else if (!(target = getSibling(target))) {
                return;
            }

            do {
                if (!target.hasAttribute(ATTR.HIDDEN)) {
                    // Not using each_option here because there *should*
                    // only be one highlighted option unless someone was messing
                    // with our stuff, and each_option takes an undesirable
                    // performance hit on keyboard navigation.
                    internals.apply_highlight.call(this, original, false);
                    internals.apply_highlight.call(this, target, true);
                    internals.scroll_option_into_view.call(this, target);
                    break;
                }
            } while (target = getSibling(target));

            e.preventDefault();
            e.stopPropagation();
        },

        key_escape: function(e) {
            if (this.expanded) {
                this.expanded = false;
                internals.focus_collapsed_target.call(this);
                e.preventDefault();
                e.stopPropagation();
            }
        },

        key_space: function(e) {
            if (!this.expanded) {
                this.expanded = true;
                e.preventDefault();
                e.stopPropagation();
            }
        },

        key_enter: function(e) {
            if (!this.expanded) {
                this.expanded = true;
            }
            else {
                var highlighted = internals.get_highlighted_option.call(this);

                if (highlighted) {
                    if (this.navigational) {
                        window.location = highlighted.href;
                    }
                    else {
                        internals.toggle_option.call(this, highlighted);

                        if ((this.list || {}).type !== SELECT_MULTIPLE) {
                            this.expanded = false;
                            internals.focus_collapsed_target.call(this);
                        }
                    }
                }
            }

            e.preventDefault();
            e.stopPropagation();
        },

        key_tab: function(e) {
            if (this.expanded) {
                this.expanded = false;
                internals.focus_collapsed_target.call(this);
                e.preventDefault();
                e.stopPropagation();
            }
        },

        key_other: function(e) {
            let filter = () => this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT);

            if (!this.expanded) {
                return;
            }
            else if (this.filterable && e.currentTarget !== filter()) {
                internals.get_focus_target.call(this).focus();
            }
            else {
                e.stopPropagation();
            }
        },

        menu_click: function(e) {
            e.stopPropagation();
        },

        close_click: function(e) {
            this.expanded = false;
            internals.focus_collapsed_target.call(this);
        },

        filter_input: function(e) {
            let input = this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT),
                last = input.getAttribute(ATTR.DATA_VALUE),
                next = e.target.value;

            if (last != next) {
                input.setAttribute(ATTR.DATA_VALUE, next);
                internals.apply_filter.call(this, next);
            }
        },

        option_click: function(e) {
            let target = e.target,
                isList = target => target.classList && target.classList.contains(CLASS.LIST),
                isContainer = target => target.classList && target.classList.contains(CLASS.PRIVATE_LIST),
                isOption = target => target.classList && target.classList.contains(CLASS.OPTION);

            if (isList(target) || isContainer(target)) {
                return;
            }

            while (!isOption(target) && target.parentNode) {
                target = target.parentNode;
            }

            if (!isOption(target)) {
                return; // then what happened?
            }

            if (!this.navigational) {
                e.preventDefault();
                internals.toggle_option.call(this, target);

                if ((this.list || {}).type === SELECT_MULTIPLE) {
                    internals.get_focus_target.call(this).focus();
                    // toggle_option causes the list to be replaced,
                    // and we lost focus, so need to regain it for
                    // keyboard operations to continue to work
                }
                else {
                    this.expanded = false;
                    internals.focus_collapsed_target.call(this);
                }
            }

            e.stopPropagation();
        },

        document_click: function(e) {
            const isFromMe = e.composedPath().indexOf(this) !== -1;

            if (!isFromMe && this.expanded) {
                internals.get_focus_target.call(this).blur();
                this.expanded = false;
            }
        }

    });

    class pickle extends HTMLElement {

        constructor() {
            super();
            var templateClone = TEMPLATE_MAIN.cloneNode(true);
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(templateClone);
        }

        connectedCallback() {
            let select = s => this.shadowRoot.querySelector(s),
                menu = select(SELECTOR.POPUP),
                close = select(SELECTOR.CLOSE),
                filter = select(SELECTOR.FILTER_INPUT),
                list = select(SELECTOR.LIST);

            let handlerMap = [
                [this, EVENT.CLICK, handlers.pickle_click],
                [this, EVENT.KEYDOWN, handlers.pickle_keydown],
                [menu, EVENT.CLICK, handlers.menu_click],
                [close, EVENT.CLICK, handlers.close_click],
                [filter, EVENT.INPUT, handlers.filter_input],
                [filter, EVENT.KEYDOWN, handlers.pickle_keydown],
                [list, EVENT.CLICK, handlers.option_click],
                [document, EVENT.CLICK, handlers.document_click],
            ];

            handlerMap.forEach(def => def[0].addEventListener(def[1], def[2].bind(this)));

            // init title
            internals.set_title_text.call(this, this.getAttribute(ATTR.TITLE));

            // init list
            this.list = document.getElementById(this.getAttribute(ATTR.LIST));

            // init filterable
            let hidden = this.hasAttribute(ATTR.FILTERABLE) ? FALSE_STRING : TRUE_STRING;
            select(SELECTOR.FILTER).setAttribute(ATTR.ARIA_HIDDEN, hidden);

            // init first selected item
            let firstSelected = list.querySelector(SELECTOR.SELECTED_VISIBLE);
            firstSelected && internals.set_display_text.call(this, firstSelected);

            // init accessibility attributes
            this.setAttribute(ATTR.ROLE, LISTBOX);
            this.setAttribute(ATTR.ARIA_HASPOPUP, TRUE_STRING);
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case ATTR.TITLE:
                    internals.set_title_text.call(this, newValue);
                    break;

                case ATTR.LIST:
                    this.list = document.getElementById(newValue);
                    break;

                case ATTR.NAVIGATIONAL:
                    this.list = this.list;
                    break;

                case ATTR.FILTERABLE:
                    let filterable = (newValue === null),
                        filter = this.shadowRoot.querySelector(SELECTOR.FILTER);

                    filter.setAttribute(ATTR.ARIA_HIDDEN, filterable ? FALSE_STRING : TRUE_STRING);
                    break;

                case ATTR.ARIA_EXPANDED:
                    this.expanded = (newValue === TRUE_STRING);
                    break;

                default:
                    break;
            }
        }

        get title() {
            return this.getAttribute(ATTR.TITLE);
        }

        set title(value) {
            this.setAttribute(ATTR.TITLE, value);
        }

        get navigational() {
            return this.hasAttribute(ATTR.NAVIGATIONAL);
        }

        set navigational(value) {
            let navigational = value ? true : false;

            if (navigational) {
                this.setAttribute(ATTR.NAVIGATIONAL, '');
            }
            else {
                this.removeAttribute(ATTR.NAVIGATIONAL);
            }
        }

        get list() {
            let id = this.getAttribute(ATTR.LIST);
            return document.getElementById(id);
        }

        set list(list) {
            let oldContainer = this.shadowRoot.querySelector(SELECTOR.PRIVATE_LIST),
                newContainer = document.createElement('div'),
                set = (name, value) => this.setAttribute(name, value),
                remove = (name) => this.removeAttribute(name);

            if (list instanceof HTMLSelectElement) {
                set(ATTR.LIST, list.id);
                set(ATTR.ARIA_MULTISELECTABLE, list.type === SELECT_MULTIPLE);

                let options = list.options,
                    addHref = (this.navigational),
                    template = addHref ? TEMPLATE_LINK : TEMPLATE_OPTION,
                    shell = template.querySelector(SELECTOR.OPTION);

                for (var i = 0; i < options.length; i++) {
                    let option = internals.create_option(options[i], shell.cloneNode(true), addHref);
                    newContainer.appendChild(option);
                }

                let selected = newContainer.querySelector(SELECTOR.SELECTED_VISIBLE);
                selected && internals.set_display_text.call(this, selected);
            }
            else {
                remove(ATTR.LIST);
                remove(ATTR.ARIA_MULTISELECTABLE);
                internals.set_display_text.call(this, null);
            }

            newContainer.className = oldContainer.className;
            oldContainer.parentNode.replaceChild(newContainer, oldContainer);
        }

        get expanded() {
            return this.getAttribute(ATTR.ARIA_EXPANDED) === TRUE_STRING;
        }

        set expanded(value) {
            let current = this.expanded,
                expanded = value === true,
                attr = val => this.setAttribute(ATTR.ARIA_EXPANDED, val),
                select = s => this.shadowRoot.querySelector(s),
                list = select(SELECTOR.LIST),
                listener = internals.respond_xs_media_query.bind(this);

            if (current === expanded) {
                return;
            }
            else if (expanded) {
                let filter = select(SELECTOR.FILTER_INPUT);

                filter.value = null;
                filter.setAttribute(ATTR.DATA_VALUE, '');
                internals.apply_filter.call(this, null);
                listener(SCREEN_XS_MAX);
                SCREEN_XS_MAX.addListener(listener);
                attr(TRUE_STRING);

                let active = internals.get_first_visible_prefer_selected.call(this);
                active && internals.scroll_option_into_view.call(this, active);

                // This is a little too jarring for mobile devices,
                // and since we divert keyboard input anyways,
                // not really necessary.
                // internals.get_focus_target.call(this).focus();
            }
            else {
                listener(SCREEN_XS_MAX);
                SCREEN_XS_MAX.removeListener(listener);
                overlayContext.unregister(list);
                attr(FALSE_STRING);

                // This should be called or not called when collapse 
                // depending on context, so we can't just do it here.
                // Responsibility lies on the function doing the collapsing.
                // internals.focus_collapsed_target.call(this);
            }
        }

        get filterable() {
            return this.hasAttribute(ATTR.FILTERABLE);
        }

        set filterable(value) {
            let filterable = value ? true : false;

            if (filterable) {
                this.setAttribute(ATTR.FILTERABLE, '');
            }
            else {
                this.removeAttribute(ATTR.FILTERABLE);
            }
        }

    }

    customElements.define('pick-le', pickle);

})();