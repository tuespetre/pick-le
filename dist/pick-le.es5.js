'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['<slot name="toggle" class="pickle-select-toggle-slot"></slot><div class="pickle-select-anchor"><div class="pickle-select-popup" tabindex="-1"><div class="pickle-select-title"><span class="private-title"></span> <span class="pickle-select-close"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg></span></div><slot name="tool"></slot><div class="pickle-select-filter"><input type="text" autocomplete="off" tabindex="-1" data-value=""></div><div class="pickle-select-options"></div></div></div><div class="pickle-default-slot"><slot></slot></div>'], ['<slot name="toggle" class="pickle-select-toggle-slot"></slot><div class="pickle-select-anchor"><div class="pickle-select-popup" tabindex="-1"><div class="pickle-select-title"><span class="private-title"></span> <span class="pickle-select-close"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg></span></div><slot name="tool"></slot><div class="pickle-select-filter"><input type="text" autocomplete="off" tabindex="-1" data-value=""></div><div class="pickle-select-options"></div></div></div><div class="pickle-default-slot"><slot></slot></div>']),
    _templateObject2 = _taggedTemplateLiteral(['<div class="pickle-option" onclick="void(0)"><span class="pickle-option-glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></span><div class="pickle-option-contents"><div class="pickle-option-label"></div><div class="pickle-option-text"></div></div></div>'], ['<div class="pickle-option" onclick="void(0)"><span class="pickle-option-glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></span><div class="pickle-option-contents"><div class="pickle-option-label"></div><div class="pickle-option-text"></div></div></div>']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(function () {
    'use strict';

    var shadowDomPolyfilled = window.shadowDomPolyfilled || window.ShadyDOM;

    var FRAG = function FRAG(strings) {
        var fragment = document.createDocumentFragment();
        var template = document.createElement('div');

        template.innerHTML = strings[0];

        while (template.firstChild) {
            fragment.appendChild(template.firstChild);
        }

        return fragment;
    };

    var TEMPLATE_SELECT = FRAG(_templateObject);
    var TEMPLATE_OPTION = FRAG(_templateObject2);
    var STYLE_SELECT = ':host{position:relative;display:inline-block}.pickle-default-slot{display:none!important}.pickle-select-anchor{position:absolute;top:0;left:0;bottom:0;right:auto;width:0}.pickle-select-popup{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px;outline:0}.pickle-select-filter input,.pickle-select-filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}:host([aria-expanded=true]) .pickle-select-popup{display:block}:host([no-filter]) .pickle-select-filter{display:none}.pickle-select-filter,.pickle-select-title,slot[name=tool]::slotted(*){display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}.pickle-select-title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}.pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:20px;line-height:20px;color:#BBB}.pickle-select-close:hover{color:#111;cursor:pointer}.pickle-select-close svg{width:15px;height:15px;display:inline-block;fill:currentColor}.pickle-select-filter input{display:block;box-sizing:border-box;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.pickle-select-filter input:focus{border-color:#66afe9;outline:0}.pickle-select-options{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}.pickle-optgroup{background-color:#f1f1f1;font-weight:700;padding:7px 7px 7px 28px;border-bottom:1px solid #dcdcdc}.pickle-option{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;border:none;border-bottom:1px solid #dcdcdc;padding:7px;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}.pickle-option[data-pickle-filtered]{display:none}.pickle-option:active,.pickle-option:focus,.pickle-option:hover{background-color:#f7f7f7;text-decoration:none;outline:0;color:#111}.pickle-option[data-pickle-highlighted]{background-color:#4682b4;color:#fff}.pickle-option-glyph{opacity:0;height:20px;width:14px;margin-right:7px;text-align:center;font-weight:700;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option[data-pickle-selected] .pickle-option-glyph{opacity:1}.pickle-option-contents{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.pickle-option-label:not(:empty){display:block;font-weight:700}.pickle-option-text:not(:empty){display:block}.pickle-option-label:not(:empty)+.pickle-option-text:not(:empty){margin-top:7px;color:#555}.pickle-option[data-pickle-highlighted] .pickle-option-label:not(:empty)+.pickle-option-text:not(:empty){color:#fff}@media screen and (max-width:767px){:host{display:block}.pickle-select-anchor,.pickle-select-popup{position:absolute;top:100%;left:0;right:0;width:auto;bottom:auto;margin:0}.pickle-select-title{padding:15px 10px}.pickle-select-close svg{width:20px;height:20px}}@media screen and (min-width:768px){:host([align-right]) .pickle-select-anchor,:host([align-right]) .pickle-select-popup{left:auto;right:0}}';
    var STYLE_OPTION = ':host{display:block;margin:0;padding:0}:host([data-pickle-highlight]){background-color:#f5f5f5}:host([data-pickle-filtered]){display:none}.pickle-option-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;border:none;border-bottom:1px solid #dcdcdc;padding:7px;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}.pickle-option-wrapper:active,.pickle-option-wrapper:focus,.pickle-option-wrapper:hover,.pickle-option-wrapper[data-pickle-highlighted]{background-color:#f5f5f5;text-decoration:none;outline:0;color:#111}.pickle-option-glyph{opacity:0;height:20px;width:14px;margin-right:7px;text-align:center;font-weight:700;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option-wrapper[data-pickle-selected] .pickle-option-glyph{opacity:1}.pickle-option-contents{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.pickle-option-label:not(:empty){display:block;font-weight:700}.pickle-option-text:not(:empty){display:block}.pickle-option-label:not(:empty)+.pickle-option-text:not(:empty){margin-top:7px;color:#777;font-size:90%}';
    var STYLE_FALLBACK = 'pickle-select{position:relative;display:inline-block}.pickle-default-slot{display:none!important}.pickle-select-anchor{position:absolute;top:0;left:0;bottom:0;right:auto;width:0}.pickle-select-popup{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px;outline:0}.pickle-select-filter input,.pickle-select-filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}pickle-select[aria-expanded=true] .pickle-select-popup{display:block}pickle-select[no-filter] .pickle-select-filter{display:none}.pickle-select-filter,.pickle-select-title,slot[name=tool]>*{display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}.pickle-select-title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}.pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:20px;line-height:20px;color:#BBB}.pickle-select-close:hover{color:#111;cursor:pointer}.pickle-select-close svg{width:15px;height:15px;display:inline-block;fill:currentColor}.pickle-select-filter input{display:block;box-sizing:border-box;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.pickle-select-filter input:focus{border-color:#66afe9;outline:0}.pickle-select-options{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}.pickle-optgroup{background-color:#f1f1f1;font-weight:700;padding:7px 7px 7px 28px;border-bottom:1px solid #dcdcdc}.pickle-option{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;border:none;border-bottom:1px solid #dcdcdc;padding:7px;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}.pickle-option[data-pickle-filtered]{display:none}.pickle-option:active,.pickle-option:focus,.pickle-option:hover{background-color:#f7f7f7;text-decoration:none;outline:0;color:#111}.pickle-option[data-pickle-highlighted]{background-color:#4682b4;color:#fff}.pickle-option-glyph{opacity:0;height:20px;width:14px;margin-right:7px;text-align:center;font-weight:700;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option[data-pickle-selected] .pickle-option-glyph{opacity:1}.pickle-option-contents{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.pickle-option-label:not(:empty){display:block;font-weight:700}.pickle-option-text:not(:empty){display:block}.pickle-option-label:not(:empty)+.pickle-option-text:not(:empty){margin-top:7px;color:#555}.pickle-option[data-pickle-highlighted] .pickle-option-label:not(:empty)+.pickle-option-text:not(:empty){color:#fff}@media screen and (max-width:767px){pickle-select{display:block}.pickle-select-anchor,.pickle-select-popup{position:absolute;top:100%;left:0;right:0;width:auto;bottom:auto;margin:0}.pickle-select-title{padding:15px 10px}.pickle-select-close svg{width:20px;height:20px}}@media screen and (min-width:768px){pickle-select[align-right] .pickle-select-anchor,pickle-select[align-right] .pickle-select-popup{left:auto;right:0}}';

    if (shadowDomPolyfilled) {
        var fallbackStyles = document.createElement('style');
        fallbackStyles.textContent = STYLE_FALLBACK;
        document.head.insertBefore(fallbackStyles, document.head.firstChild);
    } else {
        var selectStyles = document.createElement('style');
        selectStyles.textContent = STYLE_SELECT;
        TEMPLATE_SELECT.insertBefore(selectStyles, TEMPLATE_SELECT.firstChild);
        var optionStyles = document.createElement('style');
        optionStyles.textContent = STYLE_OPTION;
        TEMPLATE_OPTION.insertBefore(optionStyles, TEMPLATE_OPTION.firstChild);
    }

    function findFirstOption(control, predicate) {
        var elements = getOptionsContainer(control).children;
        var elementCount = elements.length;
        for (var i = 0; i < elementCount; i++) {
            var element = elements[i];
            if (element.className !== 'pickle-option') {
                continue;
            }
            if (predicate(element)) {
                return element;
            }
        }
    }

    function forEachOption(control, action) {
        var elements = getOptionsContainer(control).children;
        var elementCount = elements.length;
        for (var i = 0; i < elementCount; i++) {
            var element = elements[i];
            if (element.className !== 'pickle-option') {
                continue;
            }
            action(element);
        }
    }

    function getSelect(control) {
        var children = control.children;
        var childCount = control.children.length;
        for (var i = 0; i < childCount; i++) {
            var child = children[i];
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
        return findFirstOption(control, function (option) {
            return option.hasAttribute('data-pickle-highlighted');
        });
    }

    function getFirstSelectedOption(control) {
        return findFirstOption(control, function (option) {
            return option.hasAttribute('data-pickle-selected');
        });
    }

    function getFirstVisibleOption(control) {
        return findFirstOption(control, function (option) {
            return !option.hasAttribute('data-pickle-filtered');
        });
    }

    function getToggleSlot(control) {
        return control.shadowRoot.querySelector('.pickle-select-toggle-slot');
    }

    function getPopup(control) {
        return control.shadowRoot.querySelector('.pickle-select-popup');
    }

    function scrollOptionIntoView(optionsContainer, option) {
        // focus() causes iOS (et al) to hide keyboard.

        var documentRect = null;
        var containerRect = optionsContainer.getBoundingClientRect();
        var optionRect = option.getBoundingClientRect();

        if (optionRect.bottom > containerRect.bottom) {
            optionsContainer.scrollTop += optionRect.bottom - containerRect.bottom;
        } else if (optionRect.top < containerRect.top) {
            optionsContainer.scrollTop -= containerRect.top - optionRect.top;
        }

        optionRect = option.getBoundingClientRect();
        documentRect = document.documentElement.getBoundingClientRect();

        if (optionRect.bottom > documentRect.height) {
            var diff = optionRect.bottom - documentRect.height;
            document.body.scrollTop += diff;
            document.documentElement.scrollTop += diff;
        } else if (optionRect.top < 0) {
            var _diff = 0 - optionRect.top;
            document.body.scrollTop -= _diff;
            document.documentElement.scrollTop -= _diff;
        }
    }

    function filterOptions(control, filter) {
        if (filter) {
            filter = filter.trim().toLowerCase();
        }

        forEachOption(control, function (option) {
            option.removeAttribute('data-pickle-highlighted');

            if (filter && option.textContent.toLowerCase().indexOf(filter) === -1) {
                option.setAttribute('data-pickle-filtered', '');
            } else {
                option.removeAttribute('data-pickle-filtered');
            }
        });

        var optionToHighlight = getFirstSelectedOption(control);

        if (!optionToHighlight || optionToHighlight.hasAttribute('data-pickle-filtered')) {
            optionToHighlight = getFirstVisibleOption(control);
        }

        if (optionToHighlight) {
            optionToHighlight.setAttribute('data-pickle-highlighted', '');
            scrollOptionIntoView(getOptionsContainer(control), optionToHighlight);
        }
    }

    function focusCollapsedTarget(control) {
        var toggleSlot = getToggleSlot(control);
        var assignedNodes = toggleSlot.assignedNodes();
        if (assignedNodes.length) {
            assignedNodes[0].focus();
        }
    }

    function handleKeyNavigation(control, event, getSibling) {
        var highlightedOption = getFirstHighlightedOption(control) || getFirstSelectedOption(control);

        if (!highlightedOption) {
            var firstVisibleOption = getFirstVisibleOption(control);
            if (firstVisibleOption) {
                firstVisibleOption.setAttribute('data-pickle-highlighted', '');
            }
            return;
        }

        var next = highlightedOption;
        while (next = getSibling(next)) {
            if (next.classList.contains('pickle-option') && !next.hasAttribute('data-pickle-filtered')) {
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
            case 'ArrowUp':case 'Up':case 38:
                handleKeyNavigation(this, event, function (t) {
                    return t.previousElementSibling;
                });
                break;

            case 'ArrowDown':case 'Down':case 40:
                handleKeyNavigation(this, event, function (t) {
                    return t.nextElementSibling;
                });
                break;

            case 'Escape':case 'Esc':case 27:
                {
                    this.expanded = false;
                    focusCollapsedTarget(this);
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                }

            case ' ':case 'Spacebar':case 32:
                getFilterInput(this).focus();
                break;

            case 'Enter':case 13:
                var highlighted = getFirstHighlightedOption(this);
                if (highlighted) {
                    highlighted.click();
                }
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Tab':case 9:
                this.expanded = false;
                focusCollapsedTarget(this);
                event.preventDefault();
                event.stopPropagation();
                break;

            default:
                {
                    var filterInput = getFilterInput(this);
                    if (event.currentTarget !== filterInput) {
                        filterInput.focus();
                    } else {
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

        var filterInput = getFilterInput(control);
        filterInput.value = null;
        filterInput.dataset.value = '';

        forEachOption(control, function (option) {
            option.removeAttribute('data-pickle-highlighted');
            option.removeAttribute('data-pickle-filtered');
        });

        var firstSelected = getFirstSelectedOption(control);
        if (firstSelected) {
            scrollOptionIntoView(getOptionsContainer(control), firstSelected);
            firstSelected.setAttribute('data-pickle-highlighted', '');
        } else {
            var firstVisible = getFirstVisibleOption(control);
            if (firstVisible) {
                firstVisible.setAttribute('data-pickle-highlighted', '');
            }
        }

        getPopup(control).focus();
    }

    function handleOptionClick(event) {
        var wrapper = event.target.closest('.pickle-option');
        var select = getSelect(this);

        if (!wrapper || !select) {
            return;
        }

        var firstHighlightedOption = getFirstHighlightedOption(this);
        if (firstHighlightedOption) {
            firstHighlightedOption.removeAttribute('data-pickle-highlighted');
        }
        wrapper.setAttribute('data-pickle-highlighted', '');

        var option = wrapper.option;
        var oldSelected = option.selected;

        if (select.type === 'select-multiple') {
            option.selected = !oldSelected;
        } else {
            option.selected = true;
        }

        if (option.selected !== oldSelected) {
            renderOption(wrapper, option);
            if (select.type !== 'select-multiple') {
                forEachOption(this, function (other) {
                    if (wrapper !== other) {
                        // Necessary evil for browsers like IE
                        var _option = other.option;
                        _option.selected = false;
                        renderOption(other, _option);
                    }
                });
            }
            var change = document.createEvent('event');
            change.initEvent('change', true, false);
            select.dispatchEvent(change);
        }
    }

    function renderOption(wrapper, option) {
        var label = option.getAttribute('label');
        if (label) {
            wrapper.querySelector('.pickle-option-label').textContent = label;
        }

        var text = option.text;
        if (text) {
            wrapper.querySelector('.pickle-option-text').textContent = text;
        }

        var selected = option.selected;
        if (selected) {
            wrapper.setAttribute('data-pickle-selected', '');
        } else {
            wrapper.removeAttribute('data-pickle-selected');
        }
    }

    function renderOptions(control) {
        var container = getOptionsContainer(control);
        var firstChild = void 0;
        while (firstChild = container.firstChild) {
            container.removeChild(firstChild);
        }
        var select = control.querySelector('select');
        if (!select) {
            return;
        }
        var selectChildren = select.children;
        var selectChildCount = selectChildren.length;
        var optionTemplate = document.importNode(TEMPLATE_OPTION.querySelector('.pickle-option'), true);
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < selectChildCount; i++) {
            var selectChild = selectChildren[i];
            if (selectChild.localName === 'option') {
                var wrapper = optionTemplate.cloneNode(true);
                renderOption(wrapper, selectChild);
                wrapper.option = selectChild;
                fragment.appendChild(wrapper);
            } else if (selectChild.localName === 'optgroup') {
                var optgroup = document.createElement('div');
                optgroup.className = 'pickle-optgroup';
                optgroup.textContent = selectChild.label;
                fragment.appendChild(optgroup);
                var groupChildren = selectChild.children;
                var groupChildCount = groupChildren.length;
                for (var _i = 0; _i < groupChildCount; _i++) {
                    var groupChild = groupChildren[_i];
                    if (groupChild.localName === 'option') {
                        var _wrapper = optionTemplate.cloneNode(true);
                        renderOption(_wrapper, groupChild);
                        _wrapper.option = groupChild;
                        fragment.appendChild(_wrapper);
                    }
                }
            }
        }
        container.appendChild(fragment);
    }

    var PickleSelect = function (_HTMLElement) {
        _inherits(PickleSelect, _HTMLElement);

        function PickleSelect() {
            _classCallCheck(this, PickleSelect);

            var _this = _possibleConstructorReturn(this, (PickleSelect.__proto__ || Object.getPrototypeOf(PickleSelect)).call(this));

            _this.attachShadow({ mode: 'open' });

            _this.shadowRoot.appendChild(TEMPLATE_SELECT.cloneNode(true));

            var toggleSlot = getToggleSlot(_this);
            toggleSlot.addEventListener('click', function (event) {
                _this.expanded = !_this.expanded;
                event.preventDefault();
            });

            var closeButton = _this.shadowRoot.querySelector('.pickle-select-close');
            closeButton.addEventListener('click', function (event) {
                _this.expanded = false;
                focusCollapsedTarget(_this);
            });

            var filterInput = getFilterInput(_this);
            filterInput.addEventListener('keydown', handleOptionsKeydown.bind(_this));
            filterInput.addEventListener('input', function (event) {
                var oldValue = filterInput.dataset.value;
                var newValue = event.target.value;
                if (newValue !== oldValue) {
                    filterInput.dataset.value = newValue;
                    filterOptions(_this, newValue);
                }
            });

            var popup = getPopup(_this);
            popup.addEventListener('keydown', handleOptionsKeydown.bind(_this));

            var container = getOptionsContainer(_this);
            container.addEventListener('click', handleOptionClick.bind(_this));
            return _this;
        }

        _createClass(PickleSelect, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                document.addEventListener('click', handleDocumentClick.bind(this));

                var title = this.shadowRoot.querySelector('.private-title');
                title.textContent = this.dataset.title;

                // Simulate the :defined pseudo-class
                this.setAttribute('defined', '');
            }
        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                document.removeEventListener('click', handleDocumentClick.bind(this));
            }
        }, {
            key: 'expanded',
            get: function get() {
                return this.getAttribute('aria-expanded') === 'true';
            },
            set: function set(value) {
                var oldValue = this.expanded;
                var newValue = new Boolean(value);
                if (oldValue != newValue) {
                    if (newValue == true) {
                        this.setAttribute('aria-expanded', 'true');
                        onExpanded(this);
                    } else {
                        this.removeAttribute('aria-expanded');
                    }
                }
            }
        }]);

        return PickleSelect;
    }(HTMLElement);

    customElements.define('pickle-select', PickleSelect);
})();