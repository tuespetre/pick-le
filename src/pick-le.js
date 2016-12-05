(function () {
    'use strict';

    const smallScreenMediaQuery = window.matchMedia('screen and (max-width: 767px)');

    const FRAG = strings => {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('div');

        template.innerHTML = strings[0];

        while (template.firstChild) {
            fragment.appendChild(template.firstChild);
        }

        return fragment;
    };

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
        ITEMS: 'slot[name=items]',
        PRIVATE_LIST: '.private-list',
        OPTION: '.option',
        SELECTED_VISIBLE: '.option.selected:not([hidden])',
        VISIBLE: '.option:not([hidden])'
    });

    const ATTR_ROLE = 'role';

    const ATTR = Object.freeze({
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
        SELECT: 'select'
    });

    const TRUE_STRING = 'true';
    const FALSE_STRING = 'false';
    const LISTBOX = 'listbox';
    const TEMPLATE_MAIN = FRAG`inject(build/template.main.html)`;
    const STYLE_SHADOW = `inject(build/pick-le.css)`;
    const STYLE_SHADY = `inject(build/pick-le.shady.css)`;

    // TODO: This is kind of a hack that should probably go away somehow.
    if (!window.shadowDomPolyfilled) {
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

    const overlayContext = new (function () {
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
            allowY: function (context) {
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
    });

    ///////////////////////////////////////////////////////////////////////
    //
    // <pick-le>       
    //
    ///////////////////////////////////////////////////////////////////////

    function getItemsContainer(control) {
        return control.shadowRoot.querySelector('.items-container');
    }

    function getFilterInput(control) {
        return control.shadowRoot.querySelector(SELECTOR.FILTER_INPUT);
    }

    function scrollItemIntoView(itemsContainer, item) {
        // Focusing the option is no bueno.
        // Causes iOS (et al) to hide keyboard
        // if the filter was focused
        // option.focus();

        // Since the goal was to get the highlighted
        // link into view (and because scrollIntoView sucks)
        // we'll just have to adjust the scrollTop ourselves.
        // This requires some certain CSS constraints on
        // the <html> and <body> elements to work cross-browser.
        let documentRect = null;
        let listRect = itemsContainer.getBoundingClientRect();
        let optionRect = item.getBoundingClientRect();

        if (optionRect.bottom > listRect.bottom) {
            itemsContainer.scrollTop += optionRect.bottom - listRect.bottom;
        }
        else if (optionRect.top < listRect.top) {
            itemsContainer.scrollTop -= listRect.top - optionRect.top;
        }

        optionRect = item.getBoundingClientRect();
        documentRect = document.documentElement.getBoundingClientRect();

        if (optionRect.bottom > documentRect.height) {
            const diff = optionRect.bottom - documentRect.height;
            document.body.scrollTop += diff;
            document.documentElement.scrollTop += diff;
        }
        else if (optionRect.top < 0) {
            const diff = 0 - optionRect.top;
            document.body.scrollTop -= diff;
            document.documentElement.scrollTop -= diff;
        }
    }

    function filterItems(control, filter) {
        if (filter) {
            filter = filter.trim().toLowerCase();
        }

        const children = control.children;
        const childCount = children.length;
        for (let i = 0; i < childCount; i++) {
            const child = children[i];
            if (child.slot !== 'items') {
                continue;
            }
            delete child.dataset.pickLeHighlight;
            if (filter && child.textContent.toLowerCase().indexOf(filter) === -1) {
                child.dataset.pickLeFiltered = true;
            }
            else {
                delete child.dataset.pickLeFiltered;
            }
        }

        let itemToHighlight = getFirstCheckedItem(control);

        if (!itemToHighlight || itemToHighlight.dataset.pickLeFiltered) {
            itemToHighlight = getFirstVisibleItem(control);
        }

        if (itemToHighlight) {
            itemToHighlight.dataset.pickLeHighlight = true;
        }
    }

    function getFocusTarget(control) {
        return control.shadowRoot.querySelector(SELECTOR.FILTER_INPUT);
    }

    function focusCollapsedTarget(control) {
        let target = control.querySelector(SELECTOR.PICK_LE_FOCUS) || control;
        target.focus();
    }

    function getFirstHighlightedItem(control) {
        return control.querySelector('[slot=items][data-pick-le-highlight=true]');
    }

    function setDisplayText(control, option) {
        let value = null;

        if (option) {
            value = option.getAttribute(ATTR.DATA_LABEL) || option.getAttribute(ATTR.DATA_TEXT);
        }

        const displayTextElement = control.querySelector(SELECTOR.PICK_LE_TEXT);

        if (displayTextElement) {
            displayTextElement.textContent = value;
        }
    }

    function respondToXsMediaQuery(query) {
        let list = this.shadowRoot.querySelector(SELECTOR.ITEMS);

        if (query.matches) {
            overlayContext.register(list);
        }
        else {
            overlayContext.unregister(list);
        }
    }

    function setTitleText(control, text) {
        let titleTextElement = control.shadowRoot.querySelector(SELECTOR.PRIVATE_TITLE);

        if (titleTextElement) {
            titleTextElement.textContent = text;
        }
    }

    function getFirstCheckedItem(control) {
        const children = control.children;
        const childCount = children.length;
        for (let i = 0; i < childCount; i++) {
            const child = children[i];
            if (child.slot !== 'items') {
                continue;
            }
            if (child.control && child.control.checked) {
                return child;
            }
        }
    }

    function getFirstVisibleItem(control) {
        const children = control.children;
        const childCount = children.length;
        for (let i = 0; i < childCount; i++) {
            const child = children[i];
            if (child.slot !== 'items') {
                continue;
            }
            if (!child.dataset.pickLeFiltered) {
                return child;
            }
        }
    }

    function handleKeyNavigation(control, event, getSibling) {
        let highlightedItem = getFirstHighlightedItem(control) 
            || getFirstCheckedItem(control);

        if (!highlightedItem) {
            const firstVisibleItem = getFirstVisibleItem(control);
            firstVisibleItem.dataset.pickLeHighlight = true;
            return;
        }

        if (!control.expanded) {
            control.expanded = true;
            return;
        }

        let next = highlightedItem;
        while (next = getSibling(next)) {
            if (next.slot === 'items') {
                highlightedItem.dataset.pickLeHighlight = false;
                next.dataset.pickLeHighlight = true;
                scrollItemIntoView(getItemsContainer(control), next);
                break;
            }
        }

        event.preventDefault();
        event.stopPropagation();
    }

    function handleKeydown(event) {
        switch (event.key || event.which || event.keyCode) {
            case 'ArrowUp': case 'Up': case 38:
                handleKeyNavigation(this, event, t => t.previousElementSibling);
                break;

            case 'ArrowDown': case 'Down': case 40:
                handleKeyNavigation(this, event, t => t.nextElementSibling);
                break;

            case 'Escape': case 'Esc': case 27:
                if (this.expanded) {
                    this.expanded = false;
                    focusCollapsedTarget(this);
                    event.preventDefault();
                    event.stopPropagation();
                }
                break;

            case ' ': case 'Spacebar': case 32:
                if (!this.expanded) {
                    this.expanded = true;
                    event.preventDefault();
                    event.stopPropagation();
                }
                else {                    
                    getFocusTarget(this).focus();
                }
                break;

            case 'Enter': case 13:
                if (!this.expanded) {
                    this.expanded = true;
                }
                else {
                    var highlighted = getFirstHighlightedItem(this);
                    if (highlighted) {
                        highlighted.click();
                    }
                }
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Tab': case 9:
                if (this.expanded) {
                    this.expanded = false;
                    focusCollapsedTarget(this);
                    event.preventDefault();
                    event.stopPropagation();
                }
                break;

            default:
                if (!this.expanded) {
                    return;
                }
                else if (event.currentTarget !== getFilterInput(this)) {
                    getFocusTarget(this).focus();
                }
                else {
                    event.stopPropagation();
                }
                break;
        }
    }

    function handleDocumentClick(event) {
        if (this.expanded && event.composedPath().indexOf(this) === -1) {
            getFocusTarget(this).blur();
            this.expanded = false;
        }
    }

    class pickle extends HTMLElement {

        constructor() {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(TEMPLATE_MAIN.cloneNode(true));

            this.addEventListener('click', event => {
                if (!this.expanded) {
                    this.expanded = true;
                }
                else {
                    this.expanded = false;
                    focusCollapsedTarget(this);
                }
            });

            this.addEventListener('keydown', handleKeydown.bind(this));

            this.shadowRoot.querySelector(SELECTOR.POPUP).addEventListener('click', event => {
                event.stopPropagation();
            });

            this.shadowRoot.querySelector(SELECTOR.CLOSE).addEventListener('click', event => {
                this.expanded = false;
                focusCollapsedTarget(this);
            });

            const filterInput = getFilterInput(this);

            filterInput.addEventListener('input', event => {
                const oldValue = filterInput.getAttribute(ATTR.DATA_VALUE);
                const newValue = event.target.value;

                if (newValue !== oldValue) {
                    filterInput.setAttribute(ATTR.DATA_VALUE, newValue);
                    filterItems(this, newValue);
                }
            });

            filterInput.addEventListener('keydown', handleKeydown.bind(this));
        }

        connectedCallback() {
            document.addEventListener('click', handleDocumentClick.bind(this));

            // init title
            setTitleText(this, this.dataset.title);

            // init accessibility attributes
            this.setAttribute(ATTR_ROLE, LISTBOX);
            this.setAttribute(ATTR.ARIA_HASPOPUP, TRUE_STRING);
        }

        disconnectedCallback() {
            document.removeEventListener('click', handleDocumentClick.bind(this));
        }

        get expanded() {
            return this.getAttribute(ATTR.ARIA_EXPANDED) === TRUE_STRING;
        }

        set expanded(value) {
            const expanded = value === true;

            if (this.expanded === expanded) {
                return;
            }
            else if (expanded) {
                const filterInput = getFilterInput(this);
                const listener = respondToXsMediaQuery.bind(this);
                filterInput.value = null;
                filterInput.setAttribute(ATTR.DATA_VALUE, '');
                filterItems(this, null);
                listener(smallScreenMediaQuery);
                smallScreenMediaQuery.addListener(listener);
                this.setAttribute(ATTR.ARIA_EXPANDED, TRUE_STRING);

                let firstChecked = getFirstCheckedItem(this);
                if (firstChecked) {
                    scrollItemIntoView(getItemsContainer(this), firstChecked);
                }
            }
            else {
                const listener = respondToXsMediaQuery.bind(this);
                listener(smallScreenMediaQuery);
                smallScreenMediaQuery.removeListener(listener);
                overlayContext.unregister(getItemsContainer(this));
                this.setAttribute(ATTR.ARIA_EXPANDED, FALSE_STRING);
            }
        }

    }

    customElements.define('pick-le', pickle);

})();