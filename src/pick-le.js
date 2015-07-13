// SVGs courtesy of https://github.com/encharm/Font-Awesome-SVG-PNG
// Inspiration taken from GitHub's issue tracker's dropdowns
(function () {
    var PICKLE_PERF_LOGGING = () => window.PICKLE_PERF_LOGGING || false;
    var SHADOWDOM_SUPPORTED = 'createShadowRoot' in document.createElement('div');
    
    // http://stackoverflow.com/a/1349426/1030925
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var i = 0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    
    var PERF = function(label) {
        if (!PICKLE_PERF_LOGGING()) return;
        console.log(`${label}: ${performance.now()}`);
    };

    var frag = function(strings) {
        PERF('frag start');
        var template = document.createElement('div');
        template.innerHTML = strings[0];
        var fragment = document.createDocumentFragment();
        while (template.firstChild) {
            fragment.appendChild(template.firstChild);
        }
        PERF('frag end');
        return fragment;
    };
    
    
    var TEMPLATE_MAIN   = frag `inject(build/template.main.html)`;    
    var TEMPLATE_OPTION = frag `inject(build/template.option.html)`;    
    var TEMPLATE_LINK   = frag `inject(build/template.link.html)`;  
    var STYLE_SHADOW    = `inject(build/pick-le.css)`;  
    var STYLE_SHADY     = `inject(build/pick-le.shady.css)`;

    var KEY = Object.freeze({
        UP: 'ArrowUp',
        DOWN: 'ArrowDown',
        SPACE: ' ',
        ESCAPE: 'Escape',
        ENTER: 'Enter',
        TAB: 'Tab'
    });

    var KEY_MAP = Object.freeze({
        // Standard 'key' values, see: http://www.w3.org/TR/DOM-Level-3-Events-key/
        'ArrowUp': KEY.UP,
        'ArrowDown': KEY.DOWN,
        ' ': KEY.SPACE,
        'Escape': KEY.ESCAPE,
        'Enter': KEY.ENTER,
        'Tab': KEY.TAB,
        // Nonstandard 'key' values, used in IE and older Gecko
        // see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        'Up': KEY.UP,
        'Down': KEY.DOWN,
        'Spacebar': KEY.SPACE,
        'Esc': KEY.ESCAPE,
        // deprecated 'which' and 'keyCode' values
        38: KEY.UP,
        40: KEY.DOWN,
        32: KEY.SPACE,
        27: KEY.ESCAPE,
        13: KEY.ENTER,
        9: KEY.TAB
    });

    var ID = Object.freeze({
        FILTER: 'pickle-filter-input',
        LIST: 'pickle-option-container'
    });

    var CLASS = Object.freeze({
        CONTENT: 'shady-content',
        SHADOW: 'shady-shadow',
        JS_TEXT: 'pick-le-text',
        JS_PICKLE_FOCUS: 'pick-le-focus',
        POPUP: 'popup',
        TITLE: 'title',
        TITLE_TEXT: 'title-text',
        CLOSE: 'close',
        FILTER: 'filter',
        LIST: 'list',
        OPTION: 'option',
        GLYPH: 'glyph',
        LABEL: 'label',
        TEXT: 'text',
        SHADY: 'shady-' + makeid(),
        SCOPE: 'pick-le',
        HIGHLIGHTED: 'highlighted',
        SELECTED: 'selected',
        DISABLED: 'disabled',
        HIDDEN: 'hidden'
    });

    var EVENT = Object.freeze({
        CLICK: 'click',
        KEYDOWN: 'keydown',
        INPUT: 'input',
        FOCUS: 'focus'
    });

    var ATTR = Object.freeze({
        ARIA_ROLE: 'aria-role',
        ARIA_EXPANDED: 'aria-expanded',
        ARIA_SELECTED: 'aria-selected',
        ARIA_CONTROLS: 'aria-controls',
        ARIA_HIDDEN: 'aria-hidden',
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
        SELECT: 'select'
    });
    
    var TAG = Object.freeze({
        DIV: 'div',
        CONTENT: 'content'
    });
    
    var SELECTOR = Object.freeze({
        FILTER_INPUT: '.filter input'
    });

    var ROLE = Object.freeze({
        COMBOBOX: 'combobox'
    });

    var MODE = Object.freeze({
        SELECT: 'select',
        NAVIGATE: 'navigate'
    });

    var TRUE = 'true';
    var FALSE = 'false';
    var DOT = '.';
    var HASH = '#';
    var PICKLE = 'pick-le';
    var SELECT_MULTIPLE = 'select-multiple';
    var OPTION_ANY = '.option';
    var OPTION_SELECTED = '.option.selected';
    var OPTION_VISIBLE = '.option:not([hidden])';
    var OPTION_VISIBLE_SELECTED = '.option.selected:not([hidden])';
    var SCREEN_XS_MAX = window.matchMedia('screen and (max-width: 767px)');
    
    ///////////////////////////////////////////////////////////////////////
    //
    // Set up templates according to whether or not native shadow DOM
    // is supported
    //
    ///////////////////////////////////////////////////////////////////////
    
    if (SHADOWDOM_SUPPORTED) {   
        var style = document.createElement('style');
        style.textContent = STYLE_SHADOW;
        TEMPLATE_MAIN.insertBefore(style, TEMPLATE_MAIN.firstChild);       
    }    
    else {
        var style = document.createElement('style');
        style.textContent = STYLE_SHADY;
        document.head.appendChild(style);   
        
        let transform = node => 
            Array.prototype.forEach.call(
                node.querySelectorAll('*'), 
                elem => {
                    if (!elem.classList) return;
                    elem.classList.add(CLASS.SHADY);
                    elem.classList.add(CLASS.SCOPE);
                });
        
        transform(TEMPLATE_MAIN);
        transform(TEMPLATE_OPTION);
        transform(TEMPLATE_LINK);
    }
    
    ///////////////////////////////////////////////////////////////////////
    //
    // Deal with fixed position stuffs        
    //
    ///////////////////////////////////////////////////////////////////////
    
    var OVERLAY_CONTEXT = new function() { 
        let container = () => document.documentElement;
        var map = new WeakMap();
        var length = 0;
        var ORIGINAL_STYLE = {};
        var ORIGINAL_SCROLL = 0;
        var NEW_STYLE = {
            'overflow': 'hidden',
            'position': 'fixed'
        };
                
        var applyStyles = function (currentStyles, newStyles) {
            for (var prop in NEW_STYLE) {
                currentStyles[prop] = newStyles[prop];
            }
        }
            
        var touchContext = {
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
            
        var touchstart = function (e) {
            var element = e.currentTarget;
            var context = map.get(element);
            
            context.startY = e.targetTouches[0].clientY;
            context.top = element.scrollTop > 0;
            context.bottom = (element.scrollHeight - element.clientHeight) > element.scrollTop;
        };
            
        var touchmove = function (e) {
            var element = e.currentTarget;
            var context = map.get(element);
            
            context.moveY = e.targetTouches[0].clientY;
            
            if (!context.allowY(context)) {
                e.preventDefault();
            }
        };
            
        return {
            register: function (element) { 
                if (map.has(element)) return;
                
                element.addEventListener('touchstart', touchstart);
                element.addEventListener('touchmove', touchmove); 
                map.set(element, Object.create(touchContext));
                length++;
                
                if (length === 1) {
                    ORIGINAL_SCROLL = 
                        document.documentElement.scrollTop ||
                        document.body.scrollTop;
                    applyStyles(ORIGINAL_STYLE, container().style);
                    applyStyles(container().style, NEW_STYLE);
                }
            },
            unregister: function (element) {
                if (!map.has(element)) return;
                
                element.removeEventListener('touchstart', touchstart);
                element.removeEventListener('touchmove', touchmove);
                map.delete(element);
                length--;
                
                if (!length) {
                    applyStyles(container().style, ORIGINAL_STYLE);
                    document.documentElement.scrollTop = ORIGINAL_SCROLL;
                    document.body.scrollTop = ORIGINAL_SCROLL;
                }
            }
        }
    };
    
    ///////////////////////////////////////////////////////////////////////
    //
    // Because without ES6 symbols there are no really 'private' properties        
    //
    ///////////////////////////////////////////////////////////////////////

    var internals = Object.freeze({

        create_option: function (option, newNode, addHref) {
            var opt = newNode;

            var vals = {
                index: option.index,
                value: option.value,
                label: option.getAttribute(ATTR.LABEL),
                text: option.textContent.trim(),
                selected: option.selected,
                disabled: option.disabled
            };

            var elems = {
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
                opt.setAttribute(ATTR.ARIA_SELECTED, TRUE);
                opt.classList.add(CLASS.SELECTED);
            }

            if (vals.disabled) {
                opt.setAttribute(ATTR.ARIA_DISABLED, TRUE);
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

        each_option: function (func) {
            var options = this.shadowRoot.querySelectorAll(DOT + CLASS.OPTION);

            for (var i = 0; i < options.length; i++) {
                var quit = func(options[i]);
                if (quit) break;
            }
        },

        highlight_option: function (option) {
            this.setAttribute(ATTR.ARIA_ACTIVEDESCENDANT, option.id);
            internals.each_option.call(this, (function (_option) {
                if (option === _option) {
                    _option.classList.add(CLASS.HIGHLIGHTED);
                    // Focusing the option is no bueno.
                    // Causes iOS (et al) to hide keyboard
                    // if the filter was focused
                    // _option.focus();
                    // Since the goal was to get the highlighted
                    // link into view (and because scrollIntoView sucks)
                    // we'll just have to adjust the scrollTop ourselves...
                    let menu = this.shadowRoot.querySelector(DOT + CLASS.LIST),
                        v_rect = undefined,
                        m_rect = menu.getBoundingClientRect(),
                        o_rect = _option.getBoundingClientRect();
                    
                    if (o_rect.bottom > m_rect.bottom) {
                        menu.scrollTop += o_rect.bottom - m_rect.bottom;
                    }
                    else if (o_rect.top < m_rect.top) {
                        menu.scrollTop -= m_rect.top - o_rect.top;
                    }
                    
                    o_rect = _option.getBoundingClientRect();
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
                }
                else {
                    _option.classList.remove(CLASS.HIGHLIGHTED);
                }
            }).bind(this));
        },

        apply_filter: function (value) {
            let allWereHidden = true;
            internals.each_option.call(this, function (option) {
                let match = internals.match_filter(option, value),
                    display = match && !option.hasAttribute(ATTR.DATA_HIDDEN);
                    
                if (display) {
                    option.removeAttribute(ATTR.HIDDEN);
                    allWereHidden = false;
                }
                else {
                    option.setAttribute(ATTR.HIDDEN, '');
                }
            });
            
            // This stops a weird bug where IE11 likes to set the container's
            // height to '-0.01px' if all the options became hidden while
            // the container was in overflow.
            let container = this.shadowRoot.querySelector(DOT + CLASS.LIST);
            container.style.height = allWereHidden ? 0 : '';

            let highlight = value
                ?
                    this.shadowRoot.querySelector(OPTION_VISIBLE)
                :
                    this.shadowRoot.querySelector(OPTION_VISIBLE_SELECTED) ||
                    this.shadowRoot.querySelector(OPTION_VISIBLE)
            ;

            if (highlight) {
                internals.highlight_option.call(this, highlight);
            }
        },

        match_filter: function (option, filter) {
            if (!filter) return true;

            filter = filter.toLowerCase();

            var label = option.getAttribute(ATTR.DATA_LABEL);
            var text = option.getAttribute(ATTR.DATA_TEXT);
            var matchesLabel = label && label.toLowerCase().indexOf(filter) > -1;
            var matchesText = text && text.toLowerCase().indexOf(filter) > -1;
            var matches = matchesLabel || matchesText;

            return matches;
        },

        toggle_option: function (option) {
            var disabled = option.getAttribute(ATTR.ARIA_DISABLED) === TRUE;
            if (disabled) return;
            
            var index = option.getAttribute(ATTR.DATA_INDEX);
            var list = this.list || {};
            var listOption = list[index] || {};

            if (list.type === SELECT_MULTIPLE) {
                listOption.selected = !listOption.selected;
                option.setAttribute(ATTR.ARIA_SELECTED, listOption.selected ? TRUE : FALSE);
                option.classList.add(CLASS.SELECTED);
            }
            else {
                listOption.selected = true;
                internals.set_display_text.call(this, option);
                internals.each_option.call(this, function (opt) {
                    opt.setAttribute(
                        ATTR.ARIA_SELECTED,
                        opt === option ? TRUE : FALSE);
                    opt.classList.toggle(CLASS.SELECTED, opt === option);
                });
            }
            
            // 'change' only fires naturally when the user is the one
            // doing the changing. 
            list.dispatchEvent(new CustomEvent('change'));
        },

        focus_filter_input: function () {
            let target = this.filterable
                ? this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT)
                : this.shadowRoot.querySelector(DOT + CLASS.POPUP);
                
            if (document.activeElement) document.activeElement.blur();
            
            target.focus();
        },

        focus_collapsed_target: function () {
            var target = this.querySelector(DOT + CLASS.JS_PICKLE_FOCUS) || this;
            target.focus();
        },

        get_highlighted_option: function () {
            var id = this.getAttribute(ATTR.ARIA_ACTIVEDESCENDANT);
            var active = this.shadowRoot.getElementById(id);
            return active;
        },

        set_display_text: function (option) {
            let value = 
                option.getAttribute(ATTR.DATA_LABEL) ||
                option.getAttribute(ATTR.DATA_TEXT);
                
            let elem = 
                this.querySelector(DOT + CLASS.JS_TEXT) ||
                (this.children.length ? null : this);

            if (elem) elem.textContent = value;
        },
        
        respond_xs_media_query: function (query) {    
            var list = this.shadowRoot.querySelector(DOT + CLASS.LIST);
            
            if (query.matches) {
                OVERLAY_CONTEXT.register(list);
            }
            else {
                OVERLAY_CONTEXT.unregister(list);
            }
        },
        
        prepare_shadow_dom: function () {
            var templateClone = TEMPLATE_MAIN.cloneNode(true);
        
            // Nothing to prepare! :)
            if ('createShadowRoot' in this) {
                this.createShadowRoot();                
                this.shadowRoot.appendChild(templateClone);
                return;
            }
            
            // Time to do some 'shady DOM', to borrow from Polymer
            // Not going to bother with shimming appendChild, etc.
            // unless it is demanded.
            
            // Supply a sufficient shadowRoot implementation
            var modifier = SHADOWDOM_SUPPORTED ? '' : DOT+CLASS.SHADY;
            Object.defineProperty(this, 'shadowRoot', {
                get: function() {
                    var me = this;
                    return {
                        get querySelector() {
                            return function(selector) {
                                return me.querySelector(modifier + selector);
                            };
                        },
                        get querySelectorAll() {
                            return function(selector) {
                                return me.querySelectorAll(modifier + selector);
                            };
                        },
                        get getElementById() {
                            return function(id) {
                                return me.querySelector(HASH + id + modifier);
                            };
                        }
                    };
                }
            });
            
            // Grab 'content'
            var originalId = this.id ? true : false;
            if (!originalId) this.id = makeid();
            var content = templateClone.querySelectorAll(TAG.CONTENT);
            for (var i = 0; i < content.length; i++) {
                var selector = content[i].getAttribute(ATTR.SELECT);
                var matches = this.parentNode.querySelectorAll(`#${this.id} > ${selector}`);
                var polyfill = document.createElement(TAG.DIV);
                polyfill.classList.add(CLASS.CONTENT);
                polyfill.setAttribute(ATTR.SELECT, selector);
                for (var j = 0; j < matches.length; j++) {
                    polyfill.appendChild(matches[j]);
                }
                (content[i].parentNode || templateClone).replaceChild(polyfill, content[i]);
            }
            if (!originalId) this.id = null;
            this.innerHTML = '';
            this.appendChild(templateClone);
        },
        
        set_title_text: function (text) {        
            var elem = this.shadowRoot.querySelector(DOT + CLASS.TITLE_TEXT);
            if (elem) elem.textContent = text;
        }

    });

    var handlers = Object.freeze({

        pickle_click: function (e) {                      
            if (this.getAttribute(ATTR.ARIA_EXPANDED) !== TRUE) {
                this.expanded = true;
            }
            else {
                this.expanded = false;
                internals.focus_collapsed_target.call(this);
            }
        },

        pickle_keydown: function (e) {
            var key = KEY_MAP[e.key || e.which || e.keyCode];
            var handled = false;
            
            let key_up_down = (getSibling) => {
                let wasExpanded = this.expanded;
                
                let target = 
                    internals.get_highlighted_option.call(this) ||
                    this.shadowRoot.querySelector(OPTION_SELECTED) ||
                    this.shadowRoot.querySelector(OPTION_VISIBLE);
                    
                if (!target) return;
                
                if (!wasExpanded)
                    this.expanded = true;
                else if (!(target = getSibling(target)))
                    return;
                    
                do {
                    if (!target.hasAttribute(ATTR.HIDDEN)) {  
                        internals.highlight_option.call(this, target);
                        return;
                    }
                } while (target = getSibling(target));
            };

            switch (key) {
                case KEY.UP:
                    key_up_down(t => t.previousElementSibling);
                    handled = true;
                    break;
                case KEY.DOWN:
                    key_up_down(t => t.nextElementSibling);
                    handled = true;
                    break;
                case KEY.ESCAPE:
                    if (this.expanded) {
                        this.expanded = false;
                        internals.focus_collapsed_target.call(this);
                        handled = true;
                    }
                    break;
                case KEY.SPACE:
                    if (!this.expanded) {
                        this.expanded = true;
                        handled = true;
                    }
                    break;
                case KEY.ENTER:
                    if (!this.expanded) {
                        this.expanded = true;
                        handled = true;
                    }
                    else {
                        var highlighted = internals.get_highlighted_option.call(this);
                        
                        if (highlighted) {
                            switch (this.mode) {
                                case MODE.SELECT:
                                    internals.toggle_option.call(this, highlighted);
                                    break;
                                case MODE.NAVIGATE:
                                    window.location = highlighted.href;
                                    break;
                            }
                        }
                        
                        handled = true;
                    }
                    break;
                case KEY.TAB:
                    if (this.expanded) {
                        this.expanded = false;
                        internals.focus_collapsed_target.call(this);
                        handled = true;
                    }
                    else {
                        return;
                    }
                    break;
                default:
                    break;
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
            else if (!this.expanded) {
                return;
            }
            else if (e.currentTarget !== this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT)) {
                internals.focus_filter_input.call(this);
            }
            else {
                e.stopPropagation();
            }
        },

        menu_click: function (e) {
            e.stopPropagation();
        },

        close_click: function (e) {            
            this.expanded = false;
            internals.focus_collapsed_target.call(this);
        },

        filter_input: function (e) {
            var input = this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT);
            var last = input.getAttribute(ATTR.DATA_VALUE);
            var next = e.target.value;

            if (last != next) {
                input.setAttribute(ATTR.DATA_VALUE, next);
                internals.apply_filter.call(this, next);
            }
        },

        option_click: function (e) {
            var target = e.target;
            
            if (
                target.classList && // <--- because it could be SVG
                target.classList.contains(CLASS.LIST)
            ) {
                return;
            }

            while (
                !target.classList || // <--- because it could be SVG
                !target.classList.contains(CLASS.OPTION)
            ) {
                target = target.parentNode;
            }

            switch (this.mode) {
                case MODE.SELECT:
                    internals.toggle_option.call(this, target);
                    internals.highlight_option.call(this, target);
                    break;
                case MODE.NAVIGATE:
                    break;
            }
        },

        document_click: function (e) {
            // Check if e.path even exists (it should if shadow DOM is supported)
            var isFromMe;
            
            if (SHADOWDOM_SUPPORTED) {
                isFromMe = e.path.indexOf(this) > -1;
            }
            else if (e.target.classList.contains(CLASS.SHADY)) {
                isFromMe = true;
            }
            else {
                var alreadyHadAnId = e.target.hasAttribute(ATTR.ID);
                if (!alreadyHadAnId) e.target.setAttribute(ATTR.ID, 'temp-' + makeid());
                isFromMe = this.querySelector(HASH + e.target.id) ? true : false;
                if (!alreadyHadAnId) e.target.removeAttribute(ATTR.ID);
            }
            
            if (!isFromMe && this.expanded) {
                this.expanded = false;
                this.blur();
            }
        }

    });

    var pickle = Object.create(HTMLElement.prototype, {

        'createdCallback': {
            value: function () {
                PERF('createdCallback started');
                
                internals.prepare_shadow_dom.call(this);
                
                let select = s => this.shadowRoot.querySelector(s);
                
                let menu = select(DOT + CLASS.POPUP),
                    close = select(DOT + CLASS.CLOSE),
                    filter = select(SELECTOR.FILTER_INPUT),
                    options = select(DOT + CLASS.LIST);
                    
                let handlerMap = [
                    [ this,     EVENT.CLICK,   handlers.pickle_click   ],
                    [ this,     EVENT.KEYDOWN, handlers.pickle_keydown ],
                    [ menu,     EVENT.CLICK,   handlers.menu_click     ],
                    [ close,    EVENT.CLICK,   handlers.close_click    ],
                    [ filter,   EVENT.INPUT,   handlers.filter_input   ],
                    [ filter,   EVENT.KEYDOWN, handlers.pickle_keydown ],
                    [ options,  EVENT.CLICK,   handlers.option_click   ],
                    [ document, EVENT.CLICK,   handlers.document_click ],
                ];
                
                handlerMap.forEach(def => 
                    def[0].addEventListener(def[1], def[2].bind(this)));

                // init title
                internals.set_title_text.call(this, this.getAttribute(ATTR.TITLE));
                
                // init list
                this.list = document.getElementById(this.getAttribute(ATTR.LIST));
                
                // init filterable
                let hidden = this.hasAttribute(ATTR.FILTERABLE) ? FALSE : TRUE;
                select(DOT + CLASS.FILTER).setAttribute(ATTR.ARIA_HIDDEN, hidden);

                // init first selected item
                let firstSelected = select(OPTION_SELECTED);
                if (firstSelected) 
                    internals.set_display_text.call(this, firstSelected);

                // init accessibility attributes
                if (!this.hasAttribute(ATTR.ARIA_ROLE)) 
                    this.setAttribute(ATTR.ARIA_ROLE, ROLE.COMBOBOX);
                
                // init unresolved attribute
                this.removeAttribute('unresolved');
                
                PERF('createdCallback finished');
            }
        },

        'attributeChangedCallback': {
            value: function (name, oldValue, newValue) {
                switch (name) {
                    case ATTR.TITLE:
                        internals.set_title_text.call(this, newValue);
                        break;
                    case ATTR.LIST:
                        this.list = document.getElementById(newValue);
                        break;
                    case ATTR.MODE:
                        this.list = this.list;
                        break;
                    case ATTR.FILTERABLE:
                        let filterable = (newValue === null),
                            filter = this.shadowRoot.querySelector(DOT + CLASS.FILTER);
                            
                        filter.setAttribute(ATTR.ARIA_HIDDEN, filterable ? FALSE : TRUE);
                        break;
                    case ATTR.ARIA_EXPANDED:
                        this.expanded = (newValue === TRUE);
                        break;
                    default:
                        break;
                }
            }
        },

        'title': {
            get: function () {
                return this.getAttribute(ATTR.TITLE);
            },
            set: function (value) {
                this.setAttribute(ATTR.TITLE, value);
            }
        },

        'mode': {
            get: function () {
                var value = this.getAttribute(ATTR.MODE);

                switch (value) {
                    case MODE.SELECT:
                    case MODE.NAVIGATE:
                        return value;
                    default:
                        return MODE.SELECT;
                }
            },
            set: function (value) {
                this.setAttribute(ATTR.MODE, value);
            }
        },

        'list': {
            get: function () {
                var id = this.getAttribute(ATTR.LIST);
                return document.getElementById(id);
            },
            set: function (list) {                
                var container = this.shadowRoot.querySelector(DOT + CLASS.LIST);
                var frag = document.createDocumentFragment();
                
                if (list && list.constructor === HTMLSelectElement) {
                    this.setAttribute(ATTR.LIST, list.id);
                    this.setAttribute(ATTR.ARIA_CONTROLS, list.id);
                    
                    var options = list.options;
                    var addHref = (this.mode === MODE.NAVIGATE);
                    var opt = (addHref ? TEMPLATE_LINK : TEMPLATE_OPTION).querySelector(DOT+CLASS.OPTION);
                    
                    PERF('options loop start');
                    for (var i = 0; i < options.length; i++) {
                        var option = internals.create_option(options[i], opt.cloneNode(true), addHref);
                        frag.appendChild(option);
                    }
                    PERF('options loop finish');
                }
                else {
                    this.removeAttribute(ATTR.LIST);
                    this.removeAttribute(ATTR.ARIA_CONTROLS);
                }
                
                container.innerHTML = '';
                container.appendChild(frag);
            }
        },

        'expanded': {
            get: function () {
                return this.getAttribute(ATTR.ARIA_EXPANDED) === TRUE;
            },
            set: function (value) {
                let current = this.expanded,
                    expanded = value === true,
                    attr = val => this.setAttribute(ATTR.ARIA_EXPANDED, val),
                    select = s => this.shadowRoot.querySelector(s),
                    listener = internals.respond_xs_media_query.bind(this);

                if (current === expanded) {
                    return;
                }
                else if (expanded) {
                    let active = 
                        select(OPTION_VISIBLE_SELECTED) ||
                        select(OPTION_VISIBLE);
                        
                    listener(SCREEN_XS_MAX);
                    SCREEN_XS_MAX.addListener(listener);                    
                    attr(TRUE);
                    if (active) internals.highlight_option.call(this, active);
                    
                    /* 
                       This is a little too jarring for mobile devices,
                       and since we divert keyboard input anyways,
                       not really necessary.
                    */
                    
                    // internals.focus_filter_input.call(this);
                }
                else {
                    let filter = select(SELECTOR.FILTER_INPUT),
                        list = select(DOT + CLASS.LIST);
                
                    attr(FALSE);
                    internals.apply_filter.call(this, null);
                    filter.value = null;
                    filter.setAttribute(ATTR.DATA_VALUE, '');
                    SCREEN_XS_MAX.removeListener(listener);
                    OVERLAY_CONTEXT.unregister(list);
                    
                    // This should be called or not called when collapse 
                    // depending on context, so we can't just do it here.
                    // Responsibility lies on the function doing the collapsing.
                    // internals.focus_collapsed_target.call(this);
                }

            }
        },

        'filterable': {
            get: function () {
                return this.hasAttribute(ATTR.FILTERABLE);
            },
            set: function (value) {
                var filterable = value ? true : false;

                if (filterable)
                    this.setAttribute(ATTR.FILTERABLE, '');
                else
                    this.removeAttribute(ATTR.FILTERABLE);
            }
        }

    });

    document.registerElement(PICKLE, { prototype: pickle });
    
    ///////////////////////////////////////////////////////////////////////////
    //
    // pick-le-style
    //
    ///////////////////////////////////////////////////////////////////////////
    
    let transform = function () {
        if (SHADOWDOM_SUPPORTED || this._transformed) return;
        
        this.textContent = this.textContent
            // Kind of pointless because it doesn't pick up in time
            //.replace(/:unresolved/g, '[unresolved] .content')
            .replace(/::shadow \./g, ' .pick-le.shadow .pick-le.');
        
        this._transformed = true;
    };
    
    document.registerElement('pick-le-style', { 
        extends: 'style',
        prototype: Object.create(HTMLStyleElement.prototype, {        
            'createdCallback': { value: transform },        
            'attachedCallback': { value: transform }        
        })
    });
})();