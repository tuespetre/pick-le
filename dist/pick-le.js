(function () {
    'use strict';

    const smallScreenMediaQuery = window.matchMedia('screen and (max-width: 767px)');
    const shadowDomPolyfilled = window.shadowDomPolyfilled;
    const nativeShadowDom = !shadowDomPolyfilled;
    let detailsElementPolyfilled = false;

    const FRAG = strings => {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('div');

        template.innerHTML = strings[0];

        while (template.firstChild) {
            fragment.appendChild(template.firstChild);
        }

        return fragment;
    };

    const TEMPLATE_SELECT = FRAG`<div class="title"><span class="private-title"></span> <span class="pickle-select-close" aria-label="Close" role="button">&#x2716;&#xfe0e;</span></div><slot name="tool"></slot><div class="filter"><input type="search" autocomplete="off" tabindex="-1" data-value=""></div><div class="options-container"><slot class="options-slot"></slot></div>`;
    const TEMPLATE_OPTION = FRAG`<input class="pickle-option-input" type="radio"> <span class="pickle-option-glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></span><div class="pickle-option-contents"><span class="pickle-option-label"></span> <span class="pickle-option-text"><slot></slot></span></div>`;
    const STYLE_SELECT = `:host{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px}:host .filter,:host .title,:host slot[name=tool]::slotted(*){display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}:host .title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}:host .pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:14px;line-height:20px;color:#BBB}:host .pickle-select-close:hover{cursor:pointer;color:#111}:host .filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}:host .filter input:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}:host .options-container{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}:host(:focus){outline:0}:host-context(details[open]){display:block}@media screen and (max-width:767px){:host{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}:host .title{padding:15px 10px}:host .options-container{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}:host-context(details[open]){z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}}`;
    const STYLE_OPTION = `:host{display:block;margin:0;padding:0}:host(:active),:host(:focus),:host(:hover),:host([data-pickle-highlight]){background-color:#f5f5f5;outline:0}:host([data-pickle-filtered]){display:none}:host>a,:host>label{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;border:none;border-bottom:1px solid #dcdcdc;padding:7px 25px 7px 0;position:relative;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}:host>a:active,:host>a:focus,:host>a:hover,:host>label:active,:host>label:focus,:host>label:hover{color:#111;text-decoration:none}.pickle-option-glyph{opacity:0;height:20px;width:25px;text-align:center;font-weight:700}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option-input:checked+.pickle-option-glyph{opacity:1}.pickle-option-label{display:none;font-weight:700}.pickle-option-label:not(:empty){display:block;margin-bottom:7px}`;
    const STYLE_FALLBACK = `pickle-select{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px}pickle-select .filter input,pickle-select .filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}pickle-select .filter,pickle-select .title,pickle-select slot[name=tool]>*{display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}pickle-select .title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}pickle-select .pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:14px;line-height:20px;color:#BBB}pickle-select .pickle-select-close:hover{cursor:pointer;color:#111}pickle-select .filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}pickle-select .filter input:focus{border-color:#66afe9;outline:0}pickle-select .options-container{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}pickle-select:focus{outline:0}details[open] pickle-select{display:block}@media screen and (max-width:767px){pickle-select{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}pickle-select .title{padding:15px 10px}pickle-select .options-container{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}details[open] pickle-select{z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}}pickle-option{display:block;margin:0;padding:0}pickle-option:active,pickle-option:focus,pickle-option:hover,pickle-option[data-pickle-highlight]{background-color:#f5f5f5;outline:0}pickle-option[data-pickle-filtered]{display:none}pickle-option>a,pickle-option>label{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;border:none;border-bottom:1px solid #dcdcdc;padding:7px 25px 7px 0;position:relative;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}pickle-option>a:active,pickle-option>a:focus,pickle-option>a:hover,pickle-option>label:active,pickle-option>label:focus,pickle-option>label:hover{color:#111;text-decoration:none}.pickle-option-glyph{opacity:0;height:20px;width:25px;text-align:center;font-weight:700}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option-input:checked+.pickle-option-glyph{opacity:1}.pickle-option-label{display:none;font-weight:700}.pickle-option-label:not(:empty){display:block;margin-bottom:7px}`;

    if (shadowDomPolyfilled) {
        const fallbackStyles = document.createElement('style');
        fallbackStyles.textContent = STYLE_FALLBACK;
        document.head.insertBefore(fallbackStyles, document.head.firstChild);
    } 
    else {
        const selectStyles = document.createElement('style');
        selectStyles.textContent = STYLE_SELECT;
        TEMPLATE_SELECT.insertBefore(selectStyles, TEMPLATE_SELECT.firstChild);
        const optionStyles = document.createElement('style');
        optionStyles.textContent = STYLE_OPTION;
        TEMPLATE_OPTION.insertBefore(optionStyles, TEMPLATE_OPTION.firstChild);
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

    // Little polyfill for <details> if needed (IE...)
    if (!('HTMLDetailsElement' in window)) {
        detailsElementPolyfilled = true;

        const detailsStyle = document.createElement('style');
        detailsStyle.textContent = `
            details:not([open]) > :not(summary) {
                display: none;
            }
        `;
        document.head.insertBefore(detailsStyle, document.head.firstChild);

        Object.defineProperty(HTMLUnknownElement.prototype, 'open', {
            get: function () {
                return this.hasAttribute('open');
            },
            set: function (value) {
                if (value === false) {
                    this.removeAttribute('open');
                }
                else {
                    this.setAttribute('open', '');
                }
            }
        });

        function queueDetailsNotificationTask(details) {
            if (details._notificationTaskQueued) {
                return;
            }
            details._notificationTaskQueued = true;
            setTimeout(function () {
                details._notificationTaskQueued = false;
                details.open = !details.open;
                const toggle = document.createEvent('event');
                toggle.initEvent('toggle', true, false);
                details.dispatchEvent(toggle);
            });
        }

        document.addEventListener('click', function (event) {
            const summary = event.target.closest('summary');
            if (summary) {
                queueDetailsNotificationTask(summary.parentNode);
            }
        });

        document.addEventListener('keydown', function (event) {
            const summary = event.target.closest('summary');
            if (summary) {
                switch (event.key || event.which || event.keyCode) {
                    case ' ': case 'Spacebar': case 32:
                    case 'Enter': case 13:
                        queueDetailsNotificationTask(summary.parentNode);
                        event.preventDefault();
                        break;
                }
            }
        });
    }

    function isPickleOption(node) {
        return node.nodeType === Node.ELEMENT_NODE
            && node.localName === 'pickle-option';
    }

    function findFirstOption(control, predicate) {
        const assignedNodes = getOptionsSlot(control).assignedNodes();
        const assignedNodesCount = assignedNodes.length;
        for (let i = 0; i < assignedNodesCount; i++) {
            const assignedNode = assignedNodes[i];
            if (!isPickleOption(assignedNode)) {
                continue;
            }
            if (predicate(assignedNode)) {
                return assignedNode;
            }
        }
    }

    function forEachOption(control, action) {
        const assignedNodes = getOptionsSlot(control).assignedNodes();
        const assignedNodesCount = assignedNodes.length;
        for (let i = 0; i < assignedNodesCount; i++) {
            const assignedNode = assignedNodes[i];
            if (!isPickleOption(assignedNode)) {
                continue;
            }
            action(assignedNode);
        }
    }

    function getAncestorDetails(control) {
        return control.closest('details');
    }

    function getAncestorSelect(option) {
        return option.closest('pickle-select');
    }

    function getTitleElement(control) {
        return control.shadowRoot.querySelector('.private-title');
    }

    function getOptionsContainer(control) {
        return control.shadowRoot.querySelector('.options-container');
    }

    function getOptionsSlot(control) {
        return control.shadowRoot.querySelector('.options-slot');
    }

    function getFilterInput(control) {
        return control.shadowRoot.querySelector('.filter input');
    }

    function getFirstHighlightedOption(control) {
        return findFirstOption(control, option => option.hasAttribute('data-pickle-highlight'));
    }

    function getFirstSelectedOption(control) {
        return findFirstOption(control, option => option.selected);
    }

    function getFirstVisibleOption(control) {
        return findFirstOption(control, option => !option.hasAttribute('data-pickle-filtered'));
    }

    function getFocusTarget(control) {
        return getFilterInput(control);
    }

    function scrollOptionIntoView(optionsContainer, option) {
        // focus() causes iOS (et al) to hide keyboard.
        // our scroll logic has constraints: no height: 100% on body

        let documentRect = null;
        let containerRect = optionsContainer.getBoundingClientRect();
        let optionRect = option.getBoundingClientRect();

        if (optionRect.bottom > containerRect.bottom) {
            optionsContainer.scrollTop += optionRect.bottom - containerRect.bottom;
        }
        else if (optionRect.top < containerRect.top) {
            optionsContainer.scrollTop -= containerRect.top - optionRect.top;
        }

        optionRect = option.getBoundingClientRect();
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

    function filterOptions(control, filter) {
        if (filter) {
            filter = filter.trim().toLowerCase();
        }

        forEachOption(control, option => {
            option.removeAttribute('data-pickle-highlight');

            let filtered = false;
            if (filter) {
                const label = option.label.toLowerCase();
                const text = option.text.toLowerCase();
                if (label.indexOf(filter) === -1 && text.indexOf(filter) === -1) {
                    filtered = true;
                }
            }

            if (filtered) {
                option.setAttribute('data-pickle-filtered', '');
            }
            else {
                option.removeAttribute('data-pickle-filtered');
            }
        });

        let optionToHighlight = getFirstSelectedOption(control);

        if (!optionToHighlight || optionToHighlight.hasAttribute('data-pickle-filtered')) {
            optionToHighlight = getFirstVisibleOption(control);
        }

        if (optionToHighlight) {
            optionToHighlight.setAttribute('data-pickle-highlight', '');
        }
    }

    function focusCollapsedTarget(control) {
        const details = getAncestorDetails(control);
        if (details) {
            const summary = details.querySelector('summary');
            if (summary) {
                summary.focus();
            }
        }
    }

    function respondToXsMediaQuery(query) {
        const optionsContainer = getOptionsContainer(this);

        if (query.matches) {
            ModalHelper.register(optionsContainer);
        }
        else {
            ModalHelper.unregister(optionsContainer);
        }
    }

    function handleKeyNavigation(control, event, getSibling) {
        let highlightedOption = getFirstHighlightedOption(control)
            || getFirstSelectedOption(control);

        if (!highlightedOption) {
            const firstVisibleOption = getFirstVisibleOption(control);
            if (firstVisibleOption) {
                firstVisibleOption.setAttribute('data-pickle-highlight', '');
            }
            return;
        }

        let next = highlightedOption;
        while (next = getSibling(next)) {
            if (isPickleOption(next) && !next.dataset.pickleFiltered) {
                highlightedOption.removeAttribute('data-pickle-highlight');
                next.setAttribute('data-pickle-highlight', '');
                scrollOptionIntoView(getOptionsContainer(control), next);
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

            case 'Escape': case 'Esc': case 27: {
                getAncestorDetails(this).open = false;
                focusCollapsedTarget(this);
                event.preventDefault();
                event.stopPropagation();
                break;
            }

            case ' ': case 'Spacebar': case 32:
                getFilterInput(this).focus();
                break;

            case 'Enter': case 13:
                var highlighted = getFirstHighlightedOption(this);
                if (highlighted) {
                    highlighted.click();
                }
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Tab': case 9:
                getAncestorDetails(this).open = false;
                focusCollapsedTarget(this);
                event.preventDefault();
                event.stopPropagation();
                break;

            default: {
                const filterInput = getFilterInput(this);
                if (event.currentTarget !== filterInput) {
                    filterInput.focus();
                }
                else {
                    event.stopPropagation();
                }
                break;
            }
        }
    }

    function handleDocumentClick(event) {
        const details = getAncestorDetails(this);
        if (details.open && event.composedPath().indexOf(this) === -1) {
            getFilterInput(this).blur();
            details.open = false;
        }
    }

    function handleDetailsToggle(event) {
        const details = event.target;

        if (details.open) {
            const filterInput = getFilterInput(this);
            const listener = respondToXsMediaQuery.bind(this);
            filterInput.value = null;
            filterInput.dataset.value = '';
            filterOptions(this, null);
            listener(smallScreenMediaQuery);
            smallScreenMediaQuery.addListener(listener);

            let firstChecked = getFirstSelectedOption(this);
            if (firstChecked) {
                scrollOptionIntoView(getOptionsContainer(this), firstChecked);
            }

            if (!this.hasAttribute('tabindex')) {
                this.setAttribute('tabindex', 0);
            }

            this.focus();
        }
        else {
            const listener = respondToXsMediaQuery.bind(this);
            listener(smallScreenMediaQuery);
            smallScreenMediaQuery.removeListener(listener);
            ModalHelper.unregister(getOptionsContainer(this));
        }
    }

    function handleOptionClick(event) {
        const ancestorSelect = getAncestorSelect(this);
        if (ancestorSelect) {
            const firstHighlightedOption = getFirstHighlightedOption(ancestorSelect);
            if (firstHighlightedOption) {
                firstHighlightedOption.removeAttribute('data-pickle-highlight');
            }
        }
        this.setAttribute('data-pickle-highlight', '');
        
        const input = this.shadowRoot.querySelector('input');
        switch (ancestorSelect.type) {
            case 'checkbox':
                input.checked = !input.checked;
                break;
            case 'radio':
            case 'navigation':
                input.checked = true;
                if (nativeShadowDom || ancestorSelect.type === 'navigation') {
                    forEachOption(ancestorSelect, option => {
                        if (option !== this) {
                            option.selected = false;
                            option.shadowRoot.querySelector('input').checked = false;
                        }
                    });
                }
                break;
        }
        this.selected = input.checked;
    }

    function renderOption(option) {
        const select = getAncestorSelect(option);
        const contents = document.importNode(TEMPLATE_OPTION, true);

        const input = contents.querySelector('.pickle-option-input');
        input.checked = option.selected;
        input.value = option.value;
        
        const label = contents.querySelector('.pickle-option-label');
        label.textContent = option.label;
        label.normalize();

        let wrapper = null;        
        switch (select.type) {
            case 'radio':
            case 'checkbox':
                input.type = select.type;
                input.name = select.name;
                wrapper = document.createElement('label');
                break;
            case 'navigation':
                input.type = 'radio';
                wrapper = document.createElement('a');
                wrapper.href = option.value;
                break;
        }

        wrapper.appendChild(contents);
        const existing = option.shadowRoot.firstElementChild;
        if (existing) {
            option.shadowRoot.replaceChild(wrapper, existing);
        }
        else {
            option.shadowRoot.appendChild(wrapper);
        }
    }

    function registerOptionForFormParticipation(option) {
        // This is here until there is a more 'blessed' way of
        // participating in form submission.
        // See: https://github.com/w3c/webcomponents/issues/187
        const proxyInput = document.createElement('input');
        proxyInput.type = 'hidden';
        document.addEventListener('submit', event => {
            const ancestorSelect = getAncestorSelect(option);
            let participated = false;
            if (ancestorSelect && ancestorSelect.type !== 'navigation' && option.selected) {
                proxyInput.name = ancestorSelect.name;
                proxyInput.value = option.value;
                if (event.target.contains(option)) {
                    event.target.appendChild(proxyInput);
                    participated = true;
                }
            }
            if (!participated && proxyInput.parentNode) {
                proxyInput.parentNode.removeChild(proxyInput);
            }
        }, true);
    }

    class PickleSelect extends HTMLElement {

        constructor() {
            super();

            this.attachShadow({ mode: 'open' });

            this.shadowRoot.appendChild(TEMPLATE_SELECT.cloneNode(true));

            this.addEventListener('keydown', handleKeydown.bind(this));

            this.shadowRoot.querySelector('.pickle-select-close').addEventListener('click', event => {
                getAncestorDetails(this).open = false;
                focusCollapsedTarget(this);
            });

            const filterInput = getFilterInput(this);

            filterInput.addEventListener('input', event => {
                const oldValue = filterInput.dataset.value;
                const newValue = event.target.value;

                if (newValue !== oldValue) {
                    filterInput.dataset.value = newValue;
                    filterOptions(this, newValue);
                }
            });

            filterInput.addEventListener('keydown', handleKeydown.bind(this));
        }

        connectedCallback() {
            const details = this.closest('details');
            if (details) {
                if (detailsElementPolyfilled) {
                    const summary = details.querySelector('summary');
                    if (summary) {
                        summary.setAttribute('tabindex', '0');
                    }
                }
                details.addEventListener('toggle', handleDetailsToggle.bind(this));
            }

            document.addEventListener('click', handleDocumentClick.bind(this));

            getTitleElement(this).textContent = this.dataset.title;

            // Simulate the :defined pseudo-class
            this.setAttribute('defined', '');
        }

        disconnectedCallback() {
            document.removeEventListener('click', handleDocumentClick.bind(this));
        }

        get type() {
            const value = this.getAttribute('type');
            switch (value) {
                case 'radio':
                case 'checkbox':
                case 'navigation':
                    return value;
                default:
                    return 'radio';
            }
        }

        set type(value) {
            this.setAttribute('type', value);
        }

        get name() {
            const value = this.getAttribute('name');
            if (value !== null) {
                return value.trim();
            }
            return '';
        }

        set name(value) {
            if (value == null) {
                this.removeAttribute('name');
            }
            else {
                this.setAttribute('name', value);
            }
        }
    }

    class PickleOption extends HTMLElement {

        constructor() {
            super();

            this.attachShadow({ mode: 'open' });

            this.addEventListener('click', handleOptionClick.bind(this));

            if (nativeShadowDom) {
                registerOptionForFormParticipation(this);
            }
        }

        connectedCallback() {
            renderOption(this);

            // Simulate the :defined pseudo-class
            this.setAttribute('defined', '');
        }

        get value() {
            return this.getAttribute('value');
        }

        set value(value) {
            this.setAttribute('value', value);
        }

        get selected() {
            return this.hasAttribute('selected');
        }

        set selected(value) {
            if (new Boolean(value) == true) {
                this.setAttribute('selected', '');
            }
            else {
                this.removeAttribute('selected');
            }
        }

        get label() {
            const value = this.getAttribute('label');
            if (value !== null) {
                return value.trim();
            }
            return '';
        }

        set label(value) {
            if (value == null) {
                this.removeAttribute('label');
            }
            else {
                this.setAttribute('label', value);
            }
        }

        get text() {
            return this.textContent.replace(/\s+/, ' ').trim();
        }

        set text(value) {
            this.textContent = value;
        }

    }

    customElements.define('pickle-select', PickleSelect);

    customElements.define('pickle-option', PickleOption);

})();