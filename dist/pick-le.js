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
    const TEMPLATE_MAIN = FRAG`<slot name="toggle"></slot><div class="anchor shady-shadow"><div class="popup" tabindex="-1"><div class="title"><span class="private-title"></span> <span class="close" aria-label="Close" role="button">&#x2716;&#xfe0e;</span></div><slot name="tool"></slot><div class="filter"><input type="search" autocomplete="off" aria-label="Filter options" tabindex="-1" data-value=""></div><div class="items-container"><slot name="items"></slot></div></div></div>`;
    const STYLE_SHADOW = `.close,.filter,.items-container,.popup,.title,slot[name=tool]::slotted(*){background-clip:border-box;background-color:inherit;box-sizing:border-box;color:#111;display:block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;line-height:20px;font-size:14px;font-weight:400;height:auto;margin:0;opacity:1;padding:0;text-align:left;text-decoration:none;text-shadow:none;text-transform:inherit;-webkit-transform:none;transform:none;width:auto}.close,.title{font-weight:700}:host{position:relative;display:inline-block}slot[name=items]::slotted(*){display:block;border:none;border-bottom:1px solid #dcdcdc;padding:7px 10px;position:relative;cursor:pointer;color:#111!important;text-decoration:none!important}.popup,slot[name=items]::slotted([data-pick-le-filtered]){display:none}.anchor,.popup{position:absolute}slot[name=items]::slotted(:active),slot[name=items]::slotted(:focus),slot[name=items]::slotted(:hover),slot[name=items]::slotted([data-pick-le-highlight=true]){background-color:#f5f5f5!important;outline:0!important}.anchor{top:0;left:0;bottom:0;right:auto;width:0}:host(.pick-le-right) .anchor{right:0;left:auto}.popup{top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important}.filter input,.filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}:host([aria-expanded=true]) .popup{display:block}:host(.pick-le-right) .popup{right:0;left:auto}:host(.pick-le-top) .popup{top:auto;bottom:100%}@media screen and (max-width:767px){:host([aria-expanded=true]) .popup{z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.popup{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}}.filter,.title,slot[name=tool]::slotted(*){display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}.title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111}@media screen and (max-width:767px){.title{padding:15px 10px}}.close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-size:20px;line-height:20px;color:#BBB}.filter input,.items-container{display:block;background-color:#fff}.close:hover{cursor:pointer;color:#111}.filter input{width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.filter input:focus{border-color:#66afe9;outline:0}.items-container{overflow-x:hidden;overflow-y:auto;max-height:340px;position:relative;-webkit-overflow-scrolling:touch}@media screen and (max-width:767px){.items-container{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}}`;
    const STYLE_SHADY = `.pick-le.close,.pick-le.filter,.pick-le.list,.pick-le.popup,.pick-le.title,slot.pick-le[name=pick-le-tool]>*{background-clip:border-box;background-color:inherit;box-sizing:border-box;color:inherit;display:block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;line-height:20px;font-size:14px;font-weight:400;height:auto;margin:0;opacity:1;padding:0;text-align:left;text-decoration:none;text-shadow:none;text-transform:inherit;-webkit-transform:none;transform:none;width:auto}pick-le{position:relative;display:inline-block}slot[name=items]::slotted(*){display:block;border:none;border-bottom:1px solid #dcdcdc;padding:7px;position:relative;cursor:pointer}slot[name=items]::slotted(:active),slot[name=items]::slotted(:focus),slot[name=items]::slotted(:hover),slot[name=items]::slotted([data-pick-le-highlight=true]){background-color:#f5f5f5;text-decoration:none;color:#111;outline:0}slot[name=items]::slotted([data-pick-le-match=false]){display:none}.pick-le.anchor{position:absolute;top:0;left:0;bottom:0;right:auto;width:0}pick-le.pick-le-right .pick-le.anchor{right:0;left:auto}.pick-le.popup{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important}.pick-le.filter input,.pick-le.filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}pick-le[aria-expanded=true] .pick-le.popup{display:block}pick-le.pick-le-right .pick-le.popup{right:0;left:auto}pick-le.pick-le-top .pick-le.popup{top:auto;bottom:100%}@media screen and (max-width:767px){pick-le[aria-expanded=true] .pick-le.popup{z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.pick-le.popup{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}}.pick-le.list,pick-le .pick-le.shadow{position:relative}.pick-le.filter,.pick-le.title,slot.pick-le[name=pick-le-tool]>*{display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px;vertical-align:bottom}.pick-le.title{color:#111;font-weight:700;vertical-align:middle}.pick-le.title::after{display:inline-block;width:0;height:0;font-size:0;content:"";clear:both}.pick-le.close{display:inline-block;font-weight:700;font-size:20px;line-height:20px;color:#b7b7b7;float:right}.pick-le.close:hover{cursor:pointer;color:#111}.pick-le.close svg{width:15px;height:15px;display:inline-block;fill:currentColor}.pick-le.filter input,.pick-le.list{display:block;background-color:#fff}@media screen and (max-width:767px){.pick-le.title{padding:15px 10px}.pick-le.close svg{width:20px;height:20px}}.pick-le.filter input{width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.pick-le.filter input:focus{border-color:#66afe9;outline:0}.pick-le.list{overflow-x:hidden;overflow-y:auto;max-height:340px;-webkit-overflow-scrolling:touch}@media screen and (max-width:767px){.pick-le.list{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}}slot[name=pick-le-tool]{-ms-flex-negative:0;flex-shrink:0}`;

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

    const ModalHelper = (() => {

        let instances = 0;
        let capturedOverflow = '';
        let capturedScrollTop = 0;

        class HelperContext {

            constructor(element) {
                this.lastY = 0;
                this.element = element;
                element.addEventListener('touchstart', this.onTouchStart.bind(this));
                element.addEventListener('touchmove', this.onTouchMove.bind(this));
            }

            onTouchStart(event) {
                const currentY = event.touches[0].clientY;

                this.lastY = currentY;
            }

            onTouchMove(event) {
                const currentY = event.touches[0].clientY;
                const top = this.element.scrollTop;
                const totalScroll = this.element.scrollHeight;
                const currentScroll = top + this.element.offsetHeight;

                const scrollingUp = (currentY > this.lastY);
                const scrollingDown = (currentY < this.lastY);
                const cannotScrollUp = (top === 0);
                const cannotScrollDown = (currentScroll === totalScroll);

                if ((scrollingUp && cannotScrollUp) || (scrollingDown && cannotScrollDown)) {
                    event.preventDefault();
                }

                this.lastY = currentY;
            }

        };

        return {

            register(element) {
                if (!element._modalHelperContext) {
                    const context = new HelperContext(element);
                    element._modalHelperContext = context;
                }
                instances++;
                if (instances === 1) {
                    capturedOverflow = document.documentElement.style.overflow;
                    document.documentElement.style.overflow = 'hidden';
                }
            },

            unregister(element) {
                if (instances === 0) {
                    return;
                }
                instances--;
                if (instances === 0) {
                    document.documentElement.style.overflow = capturedOverflow;
                    capturedOverflow = '';
                }
            }

        };

    })();

    function getItemsContainer(control) {
        return control.shadowRoot.querySelector('.items-container');
    }

    function getFilterInput(control) {
        return control.shadowRoot.querySelector(SELECTOR.FILTER_INPUT);
    }

    function scrollItemIntoView(itemsContainer, item) {
        // focus() causes iOS (et al) to hide keyboard.
        // our scroll logic has constraints: no height: 100% on body

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
            ModalHelper.register(list);
        }
        else {
            ModalHelper.unregister(list);
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

            setTitleText(this, this.dataset.title);

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
                ModalHelper.unregister(getItemsContainer(this));
                this.setAttribute(ATTR.ARIA_EXPANDED, FALSE_STRING);
            }
        }

    }

    customElements.define('pick-le', pickle);

})();