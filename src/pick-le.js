(function () {
    'use strict';

    const shadowDomPolyfilled = window.shadowDomPolyfilled || window.ShadyDOM;

    const FRAG = strings => {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('div');

        template.innerHTML = strings[0];

        while (template.firstChild) {
            fragment.appendChild(template.firstChild);
        }

        return fragment;
    };

    const TEMPLATE_SELECT = FRAG`inject(build/template.select.html)`;
    const TEMPLATE_OPTION = FRAG`inject(build/template.option.html)`;
    const STYLE_SELECT = `inject(build/style.select.css)`;
    const STYLE_OPTION = `inject(build/style.option.css)`;
    const STYLE_FALLBACK = `inject(build/style.fallback.css)`;

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

    function findFirstOption(control, predicate) {
        const elements = getOptionsContainer(control).children;
        const elementCount = elements.length;
        for (let i = 0; i < elementCount; i++) {
            const element = elements[i];
            if (element.className !== 'pickle-option') {
                continue;
            }
            if (predicate(element)) {
                return element;
            }
        }
    }

    function forEachOption(control, action) {
        const elements = getOptionsContainer(control).children;
        const elementCount = elements.length;
        for (let i = 0; i < elementCount; i++) {
            const element = elements[i];
            if (element.className !== 'pickle-option') {
                continue;
            }
            action(element);
        }
    }

    function getSelect(control) {
        const children = control.children;
        const childCount = control.children.length;
        for (let i = 0; i < childCount; i++) {
            const child = children[i];
            if (child.localName === 'select') {
                return child;
            }
        }
        return null;
    }

    function getOptionsContainer(control) {
        return control.shadowRoot.querySelector('.pickle-select-options');
    }

    function getFilterInput(control) {
        return control.shadowRoot.querySelector('.pickle-select-filter input');
    }

    function getFirstHighlightedOption(control) {
        return findFirstOption(control, option => option.hasAttribute('data-pickle-highlighted'));
    }

    function getFirstSelectedOption(control) {
        return findFirstOption(control, option => option.hasAttribute('data-pickle-selected'));
    }

    function getFirstVisibleOption(control) {
        return findFirstOption(control, option => !option.hasAttribute('data-pickle-filtered'));
    }

    function getToggleSlot(control) {
        return control.shadowRoot.querySelector('.pickle-select-toggle-slot');
    }

    function getPopup(control) {
        return control.shadowRoot.querySelector('.pickle-select-popup');
    }

    function scrollOptionIntoView(optionsContainer, option) {
        // focus() causes iOS (et al) to hide keyboard.

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
            option.removeAttribute('data-pickle-highlighted');

            if (filter && option.textContent.toLowerCase().indexOf(filter) === -1) {
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
            optionToHighlight.setAttribute('data-pickle-highlighted', '');
            scrollOptionIntoView(getOptionsContainer(control), optionToHighlight);
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
                firstVisibleOption.setAttribute('data-pickle-highlighted', '');
            }
            return;
        }

        let next = highlightedOption;
        while (next = getSibling(next)) {
            if (next.classList.contains('pickle-option') && !next.dataset.pickleFiltered) {
                highlightedOption.removeAttribute('data-pickle-highlighted');
                next.setAttribute('data-pickle-highlighted', '');
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

    function onExpanded(control) {
        renderOptions(control);

        const filterInput = getFilterInput(control);
        filterInput.value = null;
        filterInput.dataset.value = '';
        
        forEachOption(control, option => {
            option.removeAttribute('data-pickle-highlighted');
            option.removeAttribute('data-pickle-filtered');
        });

        let firstSelected = getFirstSelectedOption(control);
        if (firstSelected) {
            scrollOptionIntoView(getOptionsContainer(control), firstSelected);
        }

        getPopup(control).focus();
    }

    function handleOptionClick(event) {
        const wrapper = event.target.closest('.pickle-option');
        const select = getSelect(this);

        if (!wrapper || !select) {
            return;
        }

        const firstHighlightedOption = getFirstHighlightedOption(this);
        if (firstHighlightedOption) {
            firstHighlightedOption.removeAttribute('data-pickle-highlighted');
        }
        wrapper.setAttribute('data-pickle-highlighted', '');
        
        const option = wrapper.option;
        const oldSelected = option.selected;

        if (select.type === 'select-multiple') {
            option.selected = !oldSelected;
        }
        else {
            option.selected = true;
        }

        if (option.selected !== oldSelected) {
            renderOption(wrapper, option);
            if (select.type !== 'select-multiple') {
                forEachOption(this, other => {
                    if (wrapper !== other) {
                        // Necessary evil for browsers like IE
                        const option = other.option;
                        option.selected = false;
                        renderOption(other, option);
                    }
                });
            }
            const change = document.createEvent('event');
            change.initEvent('change', true, false);
            select.dispatchEvent(change);
        }
    }

    function renderOption(wrapper, option) {
        const label = option.getAttribute('label');
        if (label) {
            wrapper.querySelector('.pickle-option-label').textContent = label;
        }
            
        const text = option.text;
        if (text) {
            wrapper.querySelector('.pickle-option-text').textContent = text;
        }

        const selected = option.selected;
        if (selected) {
            wrapper.setAttribute('data-pickle-selected', '');
        }
        else {
            wrapper.removeAttribute('data-pickle-selected');
        }
    }

    function renderOptions(control) {
        const container = getOptionsContainer(control);
        let firstChild;
        while (firstChild = container.firstChild) {
            container.removeChild(firstChild);
        }
        const select = control.querySelector('select');
        if (!select) {
            return;
        }
        const selectChildren = select.children;
        const selectChildCount = selectChildren.length;
        const optionTemplate = document.importNode(TEMPLATE_OPTION.querySelector('.pickle-option'), true);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < selectChildCount; i++) {
            const selectChild = selectChildren[i];
            if (selectChild.localName === 'option') {
                const wrapper = optionTemplate.cloneNode(true);
                renderOption(wrapper, selectChild);
                wrapper.option = selectChild;
                fragment.appendChild(wrapper);
            }
            else if (selectChild.localName === 'optgroup') {
                const optgroup = document.createElement('div');
                optgroup.className = 'pickle-optgroup';
                optgroup.textContent = selectChild.label;
                fragment.appendChild(optgroup);
                const groupChildren = selectChild.children;
                const groupChildCount = groupChildren.length;
                for (let i = 0; i < groupChildCount; i++) {
                    const groupChild = groupChildren[i];
                    if (groupChild.localName === 'option') {
                        const wrapper = optionTemplate.cloneNode(true);
                        renderOption(wrapper, groupChild);
                        wrapper.option = groupChild;
                        fragment.appendChild(wrapper);
                    }
                }
            }
        }
        container.appendChild(fragment);
    }

    class PickleSelect extends HTMLElement {

        constructor() {
            super();

            this.attachShadow({ mode: 'open' });

            this.shadowRoot.appendChild(TEMPLATE_SELECT.cloneNode(true));

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
            filterInput.addEventListener('keydown', handleOptionsKeydown.bind(this));
            filterInput.addEventListener('input', event => {
                const oldValue = filterInput.dataset.value;
                const newValue = event.target.value;
                if (newValue !== oldValue) {
                    filterInput.dataset.value = newValue;
                    filterOptions(this, newValue);
                }
            });

            const popup = getPopup(this);
            popup.addEventListener('keydown', handleOptionsKeydown.bind(this));

            const container = getOptionsContainer(this);
            container.addEventListener('click', handleOptionClick.bind(this));
        }

        connectedCallback() {
            document.addEventListener('click', handleDocumentClick.bind(this));

            const title = this.shadowRoot.querySelector('.private-title');
            title.textContent = this.dataset.title;

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
                    onExpanded(this);
                }
                else {
                    this.removeAttribute('aria-expanded');
                }
            }
        }
    }

    customElements.define('pickle-select', PickleSelect);

})();