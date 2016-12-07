(function () {
    'use strict';

    const shadowDomPolyfilled = window.shadowDomPolyfilled;
    const nativeShadowDom = !shadowDomPolyfilled;

    const FRAG = strings => {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('div');

        template.innerHTML = strings[0];

        while (template.firstChild) {
            fragment.appendChild(template.firstChild);
        }

        return fragment;
    };

    const TEMPLATE_SELECT = FRAG`<slot name="toggle" class="pickle-select-toggle-slot"></slot><div class="pickle-select-anchor"><div class="pickle-select-popup" tabindex="-1"><div class="pickle-select-title"><span class="private-title"></span> <span class="pickle-select-close"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg></span></div><slot name="tool"></slot><div class="pickle-select-filter"><input type="search" autocomplete="off" tabindex="-1" data-value=""></div><div class="pickle-select-options"><slot class="pickle-select-options-slot"></slot></div></div></div>`;
    const TEMPLATE_OPTION = FRAG`<div class="pickle-option-wrapper" tabindex="-1"><input class="pickle-option-input" type="radio"> <span class="pickle-option-glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></span><div class="pickle-option-contents"><slot></slot></div></div>`;
    const STYLE_SELECT = `:host{position:relative;display:inline-block}.pickle-select-anchor{position:absolute;top:0;left:0;bottom:0;right:auto;width:0}.pickle-select-popup{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px;outline:0}.pickle-select-filter input,.pickle-select-filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}:host([aria-expanded=true]) .pickle-select-popup{display:block}:host([no-filter]) .pickle-select-filter{display:none}.pickle-select-filter,.pickle-select-title,slot[name=tool]::slotted(*){display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}.pickle-select-title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}.pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:20px;line-height:20px;color:#BBB}.pickle-select-close:hover{color:#111;cursor:pointer}.pickle-select-close svg{width:15px;height:15px;display:inline-block;fill:currentColor}.pickle-select-filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.pickle-select-filter input:focus{border-color:#66afe9;outline:0}.pickle-select-options{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}@media screen and (max-width:767px){:host{display:block}.pickle-select-anchor,.pickle-select-popup{position:absolute;top:100%;left:0;right:0;width:auto;bottom:auto;margin:0}.pickle-select-title{padding:15px 10px}.pickle-select-close svg{width:20px;height:20px}}@media screen and (min-width:768px){:host([align-right]) .pickle-select-anchor,:host([align-right]) .pickle-select-popup{left:auto;right:0}}`;
    const STYLE_OPTION = `:host{display:block;margin:0;padding:0}:host([data-pickle-highlight]){background-color:#f5f5f5}:host([data-pickle-filtered]){display:none}.pickle-option-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;border:none;border-bottom:1px solid #dcdcdc;padding:7px;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}.pickle-option-glyph{opacity:0;height:20px;width:14px;margin-right:7px;text-align:center;font-weight:700;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option-input:checked+.pickle-option-glyph{opacity:1}.pickle-option-contents{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}@media (min-width:768px){.pickle-option-wrapper:hover{background-color:#f5f5f5}}`;
    const STYLE_FALLBACK = `pickle-select{position:relative;display:inline-block}.pickle-select-anchor{position:absolute;top:0;left:0;bottom:0;right:auto;width:0}.pickle-select-popup{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px;outline:0}.pickle-select-filter input,.pickle-select-filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}pickle-select[aria-expanded=true] .pickle-select-popup{display:block}pickle-select[no-filter] .pickle-select-filter{display:none}.pickle-select-filter,.pickle-select-title,slot[name=tool]>*{display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}.pickle-select-title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}.pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:20px;line-height:20px;color:#BBB}.pickle-select-close:hover{color:#111;cursor:pointer}.pickle-select-close svg{width:15px;height:15px;display:inline-block;fill:currentColor}.pickle-select-filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.pickle-select-filter input:focus{border-color:#66afe9;outline:0}.pickle-select-options{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}@media screen and (max-width:767px){pickle-select{display:block}.pickle-select-anchor,.pickle-select-popup{position:absolute;top:100%;left:0;right:0;width:auto;bottom:auto;margin:0}.pickle-select-title{padding:15px 10px}.pickle-select-close svg{width:20px;height:20px}}@media screen and (min-width:768px){pickle-select[align-right] .pickle-select-anchor,pickle-select[align-right] .pickle-select-popup{left:auto;right:0}}pickle-option{display:block;margin:0;padding:0}pickle-option[data-pickle-highlight]{background-color:#f5f5f5}pickle-option[data-pickle-filtered]{display:none}.pickle-option-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;border:none;border-bottom:1px solid #dcdcdc;padding:7px;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}.pickle-option-glyph{opacity:0;height:20px;width:14px;margin-right:7px;text-align:center;font-weight:700;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option-input:checked+.pickle-option-glyph{opacity:1}.pickle-option-contents{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}@media (min-width:768px){.pickle-option-wrapper:hover{background-color:#f5f5f5}}`;

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

    function getAncestorSelect(option) {
        return option.closest('pickle-select');
    }

    function getTitleElement(control) {
        return control.shadowRoot.querySelector('.private-title');
    }

    function getOptionsContainer(control) {
        return control.shadowRoot.querySelector('.pickle-select-options');
    }

    function getOptionsSlot(control) {
        return control.shadowRoot.querySelector('.pickle-select-options-slot');
    }

    function getFilterInput(control) {
        return control.shadowRoot.querySelector('.pickle-select-filter input');
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

    function getToggleSlot(control) {
        return control.shadowRoot.querySelector('.pickle-select-toggle-slot');
    }

    function getPopup(control) {
        return control.shadowRoot.querySelector('.pickle-select-popup');
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
            if (filter && option.text.toLowerCase().indexOf(filter) === -1) {
                filtered = true;
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
        const toggleSlot = getToggleSlot(control);
        const assignedNodes = toggleSlot.assignedNodes();
        if (assignedNodes.length) {
            assignedNodes[0].focus();
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

    function handleOptionsKeydown(event) {
        switch (event.key || event.which || event.keyCode) {
            case 'ArrowUp': case 'Up': case 38:
                handleKeyNavigation(this, event, t => t.previousElementSibling);
                break;

            case 'ArrowDown': case 'Down': case 40:
                handleKeyNavigation(this, event, t => t.nextElementSibling);
                break;

            case 'Escape': case 'Esc': case 27: {
                this.expanded = false;
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
                this.expanded = false;
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
        if (this.expanded && event.composedPath().indexOf(this) === -1) {
            getFilterInput(this).blur();
            this.expanded = false;
        }
    }

    function onExpandedChanged(control) {
        if (control.expanded) {
            const filterInput = getFilterInput(control);
            filterInput.value = null;
            filterInput.dataset.value = '';
            filterOptions(control, null);

            let firstChecked = getFirstSelectedOption(control);
            if (firstChecked) {
                scrollOptionIntoView(getOptionsContainer(control), firstChecked);
            }

            getPopup(control).focus();
        }
    }

    function ensureOneSelectedOption(control) {
        if (!control.isConnected) {
            return;
        }

        let lastSelected = null;
        forEachOption(control, option => {
            if (option.selected) {
                if (lastSelected !== null) {
                    lastSelected.selected = false;
                }
                lastSelected = option;
            }
        });
    }

    function setOptionSelectedAttribute(option, selected) {
        if (selected) {
            option.setAttribute('selected', '');
        }
        else {
            option.removeAttribute('selected');
        }
    }

    function changeOptionSelected(option, selected = null) {
        const ancestorSelect = getAncestorSelect(option);    
        const input = option.shadowRoot.querySelector('input');
        const oldState = input.checked;
        let newState;

        switch (ancestorSelect.type) {
            case 'checkbox':
                newState = (selected === null) ? !input.checked : selected;
                input.checked = newState;
                break;
            case 'radio':
            case 'navigation':
                newState = (selected === null) ? true : selected;
                input.checked = newState;
                if (newState === true) {
                    forEachOption(ancestorSelect, other => {
                        if (other !== option) {
                            other.removeAttribute('selected');
                            other.shadowRoot.querySelector('input').checked = false;
                        }
                    });
                }
                break;
        }

        setOptionSelectedAttribute(option, newState);

        return newState != oldState;
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
        
        if (changeOptionSelected(this)) {
            const change = document.createEvent('event');
            change.initEvent('change', true, false);
            this.dispatchEvent(change);
        }

        // This is kind of like 'activation behavior' in HTML
        switch (ancestorSelect.type) {
            case 'navigation':                
                if (event.composedPath()[0] === this) {
                    window.location.href = this.value;
                }
                break;
        }
    }

    function renderOption(option) {
        const select = getAncestorSelect(option);
        const contents = option.shadowRoot;
        const wrapper = contents.querySelector('.pickle-option-wrapper');
        const input = contents.querySelector('.pickle-option-input');
        input.checked = option.selected;
        input.value = option.value;
        input.name = select.name;

        switch (select.type) {
            case 'checkbox':
            case 'radio':
                input.type = select.type;
                break;
            case 'navigation':
                input.type = 'radio';
                break;
        }
    }

    function registerOptionForFormParticipation(option) {
        // This is here until there is a more 'blessed' way of
        // participating in form submission.
        // See: https://github.com/w3c/webcomponents/issues/187
        const proxyInput = document.createElement('input');
        proxyInput.type = 'hidden';
        
        const handler = event => {
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
        }

        document.addEventListener('submit', handler, true);
    }

    class PickleSelect extends HTMLElement {

        constructor() {
            super();

            this.attachShadow({ mode: 'open' });

            this.shadowRoot.appendChild(TEMPLATE_SELECT.cloneNode(true));

            const popup = getPopup(this);
            popup.addEventListener('keydown', handleOptionsKeydown.bind(this));

            const optionsObserver = new MutationObserver(records => {
                if (this.type === 'checkbox') {
                    return;
                }
                ensureOneSelectedOption(this);
            });
            optionsObserver.observe(this, { childList: true });

            const toggleSlot = getToggleSlot(this);
            toggleSlot.addEventListener('click', event => {
                this.expanded = !this.expanded;
                event.preventDefault();
            });

            const closeButton = this.shadowRoot.querySelector('.pickle-select-close');
            closeButton.addEventListener('click', event => {
                this.expanded = false;
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

            filterInput.addEventListener('keydown', handleOptionsKeydown.bind(this));
        }

        connectedCallback() {
            document.addEventListener('click', handleDocumentClick.bind(this));

            getTitleElement(this).textContent = this.dataset.title;

            ensureOneSelectedOption(this);

            // Simulate the :defined pseudo-class
            this.setAttribute('defined', '');
        }

        disconnectedCallback() {
            document.removeEventListener('click', handleDocumentClick.bind(this));
        }

        get expanded() {
            return this.getAttribute('aria-expanded') === 'true';
        }

        set expanded(value) {
            const oldValue = this.expanded;
            const newValue = new Boolean(value);
            if (oldValue != newValue) {
                if (newValue == true) {
                    this.setAttribute('aria-expanded', 'true');
                }
                else {
                    this.removeAttribute('aria-expanded');
                }
                onExpandedChanged(this);
            }
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

            this.shadowRoot.appendChild(document.importNode(TEMPLATE_OPTION, true));

            this.addEventListener('click', handleOptionClick.bind(this));
        }

        connectedCallback() {
            renderOption(this);

            if (nativeShadowDom) {
                registerOptionForFormParticipation(this);
            }

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
            if (this.isConnected) {
                changeOptionSelected(this, new Boolean(value) == true);
            }
            else {
                setOptionSelectedAttribute(this, new Boolean(value) == true);
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