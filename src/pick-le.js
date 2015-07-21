(function () {

    const PICKLE_PERF_LOGGING = () => window.PICKLE_PERF_LOGGING || false,
          SHADOWDOM_SUPPORTED = 'createShadowRoot' in document.createElement('div'),
          SCREEN_XS_MAX       = window.matchMedia('screen and (max-width: 767px)');
    
    // http://stackoverflow.com/a/1349426/1030925
    const MAKEID = () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var i = 0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };
    
    const PERF = (label, unit) => {
        let start = performance.now();
        
        unit();
        
        let finish = performance.now();
        
        if (!PICKLE_PERF_LOGGING()) return;
        console.log(`${label}: ${(finish - start).toFixed(0)}ms elapsed`);
    };

    const FRAG = strings => {
        let fragment = document.createDocumentFragment();
        
        PERF('frag start', () => {
            let template = document.createElement('div');
            
            template.innerHTML = strings[0];
            
            while (template.firstChild) {
                fragment.appendChild(template.firstChild);
            }
        });
        
        return fragment;
    };

    const KEY = Object.freeze({
        UP:     'ArrowUp',
        DOWN:   'ArrowDown',
        SPACE:  ' ',
        ESCAPE: 'Escape',
        ENTER:  'Enter',
        TAB:    'Tab'
    });

    const KEY_MAP = Object.freeze({

        // Standard 'key' values, see: http://www.w3.org/TR/DOM-Level-3-Events-key/

        'ArrowUp':   KEY.UP,
        'ArrowDown': KEY.DOWN,
        ' ':         KEY.SPACE,
        'Escape':    KEY.ESCAPE,
        'Enter':     KEY.ENTER,
        'Tab':       KEY.TAB,

        // Nonstandard 'key' values, used in IE and older Gecko
        // see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

        'Up':        KEY.UP,
        'Down':      KEY.DOWN,
        'Spacebar':  KEY.SPACE,
        'Esc':       KEY.ESCAPE,

        // deprecated 'which' and 'keyCode' values

        38:          KEY.UP,
        40:          KEY.DOWN,
        32:          KEY.SPACE,
        27:          KEY.ESCAPE,
        13:          KEY.ENTER,
        9:           KEY.TAB

    });

    const CLASS = Object.freeze({
        CONTENT:         'shady-content',
        SHADOW:          'shady-shadow',
        JS_TEXT:         'pick-le-text',
        JS_PICKLE_FOCUS: 'pick-le-focus',
        PRIVATE_LIST:    'private-list',
        POPUP:           'popup',
        TITLE_TEXT:      'title-text',
        CLOSE:           'close',
        FILTER:          'filter',
        LIST:            'list',
        OPTION:          'option',
        SHADY:           'shady-' + MAKEID(),
        SCOPE:           'pick-le',
        HIGHLIGHTED:     'highlighted',
        SELECTED:        'selected',
        DISABLED:        'disabled'
    });
    
    const SELECTOR = Object.freeze({
        PICK_LE_FOCUS:    '.pick-le-focus',
        PICK_LE_TEXT:     '.pick-le-text',
        PRIVATE_TITLE:    '.private-title',
        CLOSE:            '.close',
        FILTER:           '.filter',
        FILTER_INPUT:     '.filter input',
        POPUP:            '.popup',
        LIST:             '.list',
        PRIVATE_LIST:     '.private-list',
        OPTION:           '.option',
        SELECTED_VISIBLE: '.option.selected:not([hidden])',
        VISIBLE:          '.option:not([hidden])'
    });

    const EVENT = Object.freeze({
        CLICK:   'click',
        KEYDOWN: 'keydown',
        INPUT:   'input',
		CHANGE:  'change'
    });

    const ATTR = Object.freeze({
        ROLE:                  'role',
        ARIA_EXPANDED:         'aria-expanded',
        ARIA_SELECTED:         'aria-selected',
        ARIA_HIDDEN:           'aria-hidden',
        ARIA_HASPOPUP:         'aria-haspopup',
        ARIA_DISABLED:         'aria-disabled',
        ARIA_ACTIVEDESCENDANT: 'aria-activedescendant',
        ARIA_MULTISELECTABLE:  'aria-multiselectable',
        DATA_INDEX:            'data-index',
        DATA_LABEL:            'data-label',
        DATA_TEXT:             'data-text',
        DATA_VALUE:            'data-value',
        DATA_HIDDEN:           'data-hidden',
        TITLE:                 'title',
        LIST:                  'list',
        FILTERABLE:            'filterable',
        MODE:                  'mode',
        LABEL:                 'label',
        VALUE:                 'value',
        HREF:                  'href',
        TABINDEX:              'tabindex',
        PLACEHOLDER:           'placeholder',
        ID:                    'id',
        HIDDEN:                'hidden',
        SELECT:                'select',
		NAVIGATIONAL:          'navigational'
    });
    
    const TAG = Object.freeze({
        DIV:     'div',
        CONTENT: 'content'
    });

    const TRUE            = 'true',
          FALSE           = 'false',
          HASH            = '#',
          PICKLE          = 'pick-le',
          SELECT_MULTIPLE = 'select-multiple',
          LISTBOX         = 'listbox',
          TEMPLATE_MAIN   = FRAG `inject(build/template.main.html)`,
          TEMPLATE_OPTION = FRAG `inject(build/template.option.html)`,    
          TEMPLATE_LINK   = FRAG `inject(build/template.link.html)`,
          STYLE_SHADOW    = `inject(build/pick-le.css)`,
          STYLE_SHADY     = `inject(build/pick-le.shady.css)`;
    
    ///////////////////////////////////////////////////////////////////////
    //
    // Set up templates according to whether or not native shadow DOM
    // is supported
    //
    ///////////////////////////////////////////////////////////////////////
    
    {
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
    }
    
    ///////////////////////////////////////////////////////////////////////
    //
    // Deal with fixed position stuffs        
    //
    ///////////////////////////////////////////////////////////////////////
    
    const overlayContext = new function() { 
        let container       = () => document.documentElement,
            map             = new WeakMap(),
            length          = 0,
            cachedStyle     = {},
            cachedScroll    = 0,
            overlayStyle    = {
                'overflow': 'hidden',
                'position': 'fixed'
            };
            
        const applyStyles = (currentStyles, newStyles) => {
            for (var prop in NEW_STYLE) {
                currentStyles[prop] = newStyles[prop];
            }
        }
        
        const touchContext = {
            startY: 0,
            moveY:  0,
            top:    false,
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
            context.top    = element.scrollTop > 0;
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
        
            register: function (element) { 
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
            
            unregister: function (element) {
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
    };
    
    ///////////////////////////////////////////////////////////////////////
    //
    // <pick-le>       
    //
    ///////////////////////////////////////////////////////////////////////

    const internals = Object.freeze({

        create_option: function (option, newNode, addHref) {
            let opt = newNode;

            let vals = {
                index:    option.index,
                value:    option.value,
                label:    option.getAttribute(ATTR.LABEL),
                text:     option.textContent.trim(),
                selected: option.selected,
                disabled: option.disabled
            };

            let elems = {
                label:    opt.children[1],
                text:     opt.children[2]
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
        
        /* 
            Executes a function against each option within a cloned list
            of all options within pick-le; replaces the existing list of
            options with the operated-on close
        */
        each_option: function (func) {
            var oldContainer, newContainer, options;
        
            PERF('each option', () => {
                    
                PERF('each option clone', () => {
                    oldContainer = this.shadowRoot.querySelector(SELECTOR.PRIVATE_LIST);
                    newContainer = oldContainer.cloneNode(true);
                    options = newContainer.querySelectorAll(SELECTOR.OPTION);
                });
                
                PERF('each option loop start', () => {
                    for (var i = 0; i < options.length; i++) {
                        func(options[i]);
                    }
                });
                
                PERF('each option replace', () => {
                    newContainer.className = oldContainer.className;
                    oldContainer.parentNode.replaceChild(newContainer, oldContainer);            
                });
                
            });
        },
        
        scroll_option_into_view: function (option) {				
            // Focusing the option is no bueno.
            // Causes iOS (et al) to hide keyboard
            // if the filter was focused
            // option.focus();
            // Since the goal was to get the highlighted
            // link into view (and because scrollIntoView sucks)
            // we'll just have to adjust the scrollTop ourselves.
            // This requires some certain CSS constraints on
            // the <html> and <body> elements to work cross-browser.
            let menu   = this.shadowRoot.querySelector(SELECTOR.LIST),
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
		
		apply_highlight: function (option, highlighted) {
			if (highlighted) {				
				this.setAttribute(ATTR.ARIA_ACTIVEDESCENDANT, option.id);
				option.classList.add(CLASS.HIGHLIGHTED);
			}
			else {
				option.classList.remove(CLASS.HIGHLIGHTED);
			}
		},

        apply_filter: function (value) {
            let allWereHidden   = true,
				highlightedOne  = false,
                firstVisible    = undefined,
                applyHighlight  = (option, highlighted) => internals.apply_highlight.call(this, option, highlighted),
                getFirstVisible = () => internals.get_first_visible_prefer_selected.call(this);
			
            internals.each_option.call(this, option => {
                let match     = internals.match_filter(option, value),
                    display   = match && !option.hasAttribute(ATTR.DATA_HIDDEN),
                    selected  = option.classList.contains(CLASS.SELECTED),
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

        match_filter: function (option, filter) {
            if (!filter) return true;

            filter = filter.toLowerCase();

            let label        = option.getAttribute(ATTR.DATA_LABEL),
                text         = option.getAttribute(ATTR.DATA_TEXT),
                matchesLabel = label && label.toLowerCase().indexOf(filter) > -1,
                matchesText  = text && text.toLowerCase().indexOf(filter) > -1,
                matches      = matchesLabel || matchesText;

            return matches;
        },

        toggle_option: function (option) {
            let disabled = option.getAttribute(ATTR.ARIA_DISABLED) === TRUE,
                list     = this.list || {},
                multiple = (list.type === SELECT_MULTIPLE),
                cloned   = undefined;
            
            if (disabled) return;            
            
            internals.each_option.call(this, opt => {
                let index      = opt.getAttribute(ATTR.DATA_INDEX),
                    listOption = list[opt.getAttribute(ATTR.DATA_INDEX)],
                    identical  = opt.id === option.id,
                    selected   = multiple
                        ? (identical ? !listOption.selected : listOption.selected)
                        : identical;
                            
                // IE10 and IE11 and some Android do not support
                // the second parameter for 'toggle'
				listOption.selected = selected;
                opt.classList[selected ? 'add' : 'remove'](CLASS.SELECTED);
                opt.setAttribute(ATTR.ARIA_SELECTED, selected ? TRUE : FALSE);
                internals.apply_highlight.call(this, opt, identical);
                identical && (cloned = opt);
            });
            
            internals.scroll_option_into_view.call(this, cloned);
            
            if (!multiple) internals.set_display_text.call(this, cloned);
            
            // 'change' only fires naturally when the user is the one
            // doing the changing. // 'change' only fires naturally when the user is the one
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
		
		get_focus_target: function () {
            return this.filterable
                ? this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT)
                : this.shadowRoot.querySelector(SELECTOR.POPUP);
		},

        focus_collapsed_target: function () {
            let target = this.querySelector(SELECTOR.PICK_LE_FOCUS) || this;
            
            target.focus();
        },

        get_highlighted_option: function () {
            let id = this.getAttribute(ATTR.ARIA_ACTIVEDESCENDANT);
            
            return this.shadowRoot.getElementById(id);
        },

        set_display_text: function (option) {
            let elem  = this.querySelector(SELECTOR.PICK_LE_TEXT),
                value = option
                    ? option.getAttribute(ATTR.DATA_LABEL) 
                        || option.getAttribute(ATTR.DATA_TEXT)
                    : null;
            
            if (elem) elem.textContent = value;
        },
        
        respond_xs_media_query: function (query) {    
            let list = this.shadowRoot.querySelector(SELECTOR.LIST);
            
            if (query.matches) {
                overlayContext.register(list);
            }
            else {
                overlayContext.unregister(list);
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
            var modifier = SHADOWDOM_SUPPORTED ? '' : '.' + CLASS.SHADY;
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
            if (!originalId) this.id = MAKEID();
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
            let elem = this.shadowRoot.querySelector(SELECTOR.PRIVATE_TITLE);
            
            if (elem) elem.textContent = text;
        },
        
        get_first_visible_prefer_selected: function () {
            let list = this.shadowRoot.querySelector(SELECTOR.LIST);
            
            return list.querySelector(SELECTOR.SELECTED_VISIBLE) 
                || list.querySelector(SELECTOR.VISIBLE);
        }

    });

    const handlers = Object.freeze({

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
            switch (KEY_MAP[e.key || e.which || e.keyCode]) {
                case KEY.UP:
                    handlers.key_up_down.call(this, e, t => t.previousElementSibling);
                    break;
                case KEY.DOWN:
                    handlers.key_up_down.call(this, e, t => t.nextElementSibling);
                    break;
                case KEY.ESCAPE:
                    handlers.key_escape.call(this, e);
                    break;
                case KEY.SPACE:
                    handlers.key_space.call(this, e);
                    break;
                case KEY.ENTER:
                    handlers.key_enter.call(this, e);
                    break;
                case KEY.TAB:
                    handlers.key_tab.call(this, e);
                    break;
                default:
                    handlers.key_other.call(this, e);
                    break;
            }
        },

        key_up_down: function (e, getSibling) {
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
        
        key_escape: function (e) {
            if (this.expanded) {
                this.expanded = false;
                internals.focus_collapsed_target.call(this)
                e.preventDefault();
                e.stopPropagation();
            }
        },
        
        key_space: function (e) {
            if (!this.expanded) {
                this.expanded = true;
                e.preventDefault();
                e.stopPropagation();
            }
        },
        
        key_enter: function (e) {            
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
					}
                }
            }
            
            e.preventDefault();
            e.stopPropagation();
        },
        
        key_tab: function (e) {
            if (this.expanded) {
                this.expanded = false;
                internals.focus_collapsed_target.call(this);
                e.preventDefault();
                e.stopPropagation();
            }
        },
        
        key_other: function (e) {
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
        
        menu_click: function (e) {
            e.stopPropagation();
        },

        close_click: function (e) {            
            this.expanded = false;
            internals.focus_collapsed_target.call(this);
        },

        filter_input: function (e) {
            let input = this.shadowRoot.querySelector(SELECTOR.FILTER_INPUT),
                last  = input.getAttribute(ATTR.DATA_VALUE),
                next  = e.target.value;

            if (last != next) {
                input.setAttribute(ATTR.DATA_VALUE, next);
                internals.apply_filter.call(this, next);
            }
        },

        option_click: function (e) {
            let target = e.target,			
				isList = target => target.classList && target.classList.contains(CLASS.LIST),
                isContainer = target => target.classList && target.classList.contains(CLASS.PRIVATE_LIST),
				isOption = target => target.classList && target.classList.contains(CLASS.OPTION);
            
            if (isList(target) || isContainer(target)) return;
			while (!isOption(target) && target.parentNode) target = target.parentNode;
            if (!isOption(target)) return; // then what happened?
            
			if (!this.navigational) {
				e.preventDefault();
				internals.toggle_option.call(this, target);
				internals.get_focus_target.call(this).focus();
				// toggle_option causes the list to be replaced,
				// and we lost focus, so need to regain it for
				// keyboard operations to continue to work
			}
			e.stopPropagation();
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
                if (!alreadyHadAnId) e.target.setAttribute(ATTR.ID, 'temp-' + MAKEID());
                isFromMe = this.querySelector(HASH + e.target.id) ? true : false;
                if (!alreadyHadAnId) e.target.removeAttribute(ATTR.ID);
            }
            
            if (!isFromMe && this.expanded) {
                internals.get_focus_target.call(this).blur();
                this.expanded = false;
            }
        }

    });

    const pickle = Object.create(HTMLElement.prototype, {

        'createdCallback': {
            value: function () {
                PERF('createdCallback', () => {                
                    internals.prepare_shadow_dom.call(this);
                    
                    let select = s => this.shadowRoot.querySelector(s),
                        menu   = select(SELECTOR.POPUP),
                        close  = select(SELECTOR.CLOSE),
                        filter = select(SELECTOR.FILTER_INPUT),
                        list   = select(SELECTOR.LIST);
                        
                    let handlerMap = [
                        [ this,     EVENT.CLICK,   handlers.pickle_click   ],
                        [ this,     EVENT.KEYDOWN, handlers.pickle_keydown ],
                        [ menu,     EVENT.CLICK,   handlers.menu_click     ],
                        [ close,    EVENT.CLICK,   handlers.close_click    ],
                        [ filter,   EVENT.INPUT,   handlers.filter_input   ],
                        [ filter,   EVENT.KEYDOWN, handlers.pickle_keydown ],
                        [ list,     EVENT.CLICK,   handlers.option_click   ],
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
                    select(SELECTOR.FILTER).setAttribute(ATTR.ARIA_HIDDEN, hidden);

                    // init first selected item
                    let firstSelected = list.querySelector(SELECTOR.SELECTED_VISIBLE);
                    firstSelected && internals.set_display_text.call(this, firstSelected);

                    // init accessibility attributes
                    this.setAttribute(ATTR.ROLE, LISTBOX);
                    this.setAttribute(ATTR.ARIA_HASPOPUP, TRUE);
                    
                    // init unresolved attribute
                    this.removeAttribute('unresolved');                
                });
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
                    case ATTR.NAVIGATIONAL:
                        this.list = this.list;
                        break;
                    case ATTR.FILTERABLE:
                        let filterable = (newValue === null),
                            filter = this.shadowRoot.querySelector(SELECTOR.FILTER);
                            
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

        'navigational': {
            get: function () {
                return this.hasAttribute(ATTR.NAVIGATIONAL);
            },
            set: function (value) {
                let navigational = value ? true : false;

                if (navigational) {
                    this.setAttribute(ATTR.NAVIGATIONAL, '');
				}
                else {
                    this.removeAttribute(ATTR.NAVIGATIONAL);
				}
            }
        },

        'list': {
            get: function () {
                let id = this.getAttribute(ATTR.LIST);
                return document.getElementById(id);
            },
            set: function (list) {                
                let oldContainer = this.shadowRoot.querySelector(SELECTOR.PRIVATE_LIST),
                    newContainer = document.createElement(TAG.DIV),
                    set          = (name, value) => this.setAttribute(name, value),
                    remove       = (name) => this.removeAttribute(name);
                
                if (list && list.constructor === HTMLSelectElement) {
                    set(ATTR.LIST, list.id);
                    set(ATTR.ARIA_MULTISELECTABLE, list.type === SELECT_MULTIPLE);
                    
                    let options  = list.options,
                        addHref  = (this.navigational),
                        template = addHref ? TEMPLATE_LINK : TEMPLATE_OPTION,
                        shell    = template.querySelector(SELECTOR.OPTION);
                    
                    PERF('options creation loop', () => {
                        for (var i = 0; i < options.length; i++) {
                            let option = internals.create_option(options[i], shell.cloneNode(true), addHref);
                            newContainer.appendChild(option);
                        }
                    });
					
					let selected = newContainer.querySelector(SELECTOR.SELECTED_VISIBLE);
					selected && internals.set_display_text.call(this, selected);
                }
                else {
                    remove(ATTR.LIST);
                    remove(ATTR.ARIA_MULTISELECTABLE);
                    internals.set_display_text.call(this, null);
                }
                
                PERF('created options attachment', () => {
                    newContainer.className = oldContainer.className;
                    oldContainer.parentNode.replaceChild(newContainer, oldContainer);
                });
            }
        },

        'expanded': {
            get: function () {
                return this.getAttribute(ATTR.ARIA_EXPANDED) === TRUE;
            },
            set: function (value) {
                let current  = this.expanded,
                    expanded = value === true,
                    attr     = val => this.setAttribute(ATTR.ARIA_EXPANDED, val),
                    select   = s => this.shadowRoot.querySelector(s),
                    list     = select(SELECTOR.LIST),
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
                    attr(TRUE);
                    
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
                    attr(FALSE);
                    
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
                let filterable = value ? true : false;

                if (filterable) {
                    this.setAttribute(ATTR.FILTERABLE, '');
				}
                else {
                    this.removeAttribute(ATTR.FILTERABLE);
				}
            }
        }

    });

    document.registerElement(PICKLE, { prototype: pickle });
    
    ///////////////////////////////////////////////////////////////////////////
    //
    // <style is="pick-le-style">
    //
    ///////////////////////////////////////////////////////////////////////////
    
    const transform = function () {
        if (SHADOWDOM_SUPPORTED || this._transformed) return;
        
        this.textContent = this.textContent
            // Kind of pointless because it doesn't pick up in time
            //.replace(/:unresolved/g, '[unresolved] .content')
            .replace(/::shadow \./g, ' .pick-le.shady-shadow .pick-le.');
        
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