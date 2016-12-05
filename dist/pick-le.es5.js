'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['<div class="title"><span class="private-title"></span> <span class="pickle-select-close" aria-label="Close" role="button">&#x2716;&#xfe0e;</span></div><slot name="tool"></slot><div class="filter"><input type="search" autocomplete="off" tabindex="-1" data-value=""></div><div class="options-container"><slot class="options-slot"></slot></div>'], ['<div class="title"><span class="private-title"></span> <span class="pickle-select-close" aria-label="Close" role="button">&#x2716;&#xfe0e;</span></div><slot name="tool"></slot><div class="filter"><input type="search" autocomplete="off" tabindex="-1" data-value=""></div><div class="options-container"><slot class="options-slot"></slot></div>']),
    _templateObject2 = _taggedTemplateLiteral(['<input class="pickle-option-input" type="radio"> <span class="pickle-option-glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></span><div class="pickle-option-contents"><span class="pickle-option-label"></span> <span class="pickle-option-text"><slot></slot></span></div>'], ['<input class="pickle-option-input" type="radio"> <span class="pickle-option-glyph"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></span><div class="pickle-option-contents"><span class="pickle-option-label"></span> <span class="pickle-option-text"><slot></slot></span></div>']);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(function () {
    'use strict';

    var smallScreenMediaQuery = window.matchMedia('screen and (max-width: 767px)');
    var shadowDomPolyfilled = window.shadowDomPolyfilled;
    var nativeShadowDom = !shadowDomPolyfilled;
    var detailsElementPolyfilled = false;

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
    var STYLE_SELECT = ':host{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px}:host .filter,:host .title,:host slot[name=tool]::slotted(*){display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}:host .title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}:host .pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:14px;line-height:20px;color:#BBB}:host .pickle-select-close:hover{cursor:pointer;color:#111}:host .filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}:host .filter input:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}:host .options-container{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}:host(:focus){outline:0}:host-context(details[open]){display:block}@media screen and (max-width:767px){:host{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}:host .title{padding:15px 10px}:host .options-container{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}:host-context(details[open]){z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}}';
    var STYLE_OPTION = ':host{display:block;margin:0;padding:0}:host(:active),:host(:focus),:host(:hover),:host([data-pickle-highlight]){background-color:#f5f5f5;outline:0}:host([data-pickle-filtered]){display:none}:host>a,:host>label{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;border:none;border-bottom:1px solid #dcdcdc;padding:7px 25px 7px 0;position:relative;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}:host>a:active,:host>a:focus,:host>a:hover,:host>label:active,:host>label:focus,:host>label:hover{color:#111;text-decoration:none}.pickle-option-glyph{opacity:0;height:20px;width:25px;text-align:center;font-weight:700}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option-input:checked+.pickle-option-glyph{opacity:1}.pickle-option-label{display:none;font-weight:700}.pickle-option-label:not(:empty){display:block;margin-bottom:7px}';
    var STYLE_FALLBACK = 'pickle-select{display:none;position:absolute;top:100%;left:0;right:auto;bottom:auto;width:300px;z-index:3000;border:1px solid #dcdcdc;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.175);-ms-touch-action:manipulation;touch-action:manipulation;-webkit-transform:none!important;transform:none!important;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;color:#111;line-height:20px;font-size:14px}pickle-select .filter input,pickle-select .filter input:focus{box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}pickle-select .filter,pickle-select .title,pickle-select slot[name=tool]>*{display:block;padding:7px 10px;background-color:#f1f1f1;border-bottom:1px solid #dcdcdc;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;line-height:20px}pickle-select .title{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#111;font-weight:700}pickle-select .pickle-select-close{margin-left:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;display:inline-block;font-weight:700;font-size:14px;line-height:20px;color:#BBB}pickle-select .pickle-select-close:hover{cursor:pointer;color:#111}pickle-select .filter input{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857;color:inherit;background-color:#fff;background-image:none;border:1px solid #66afe9;border-radius:4px;-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}pickle-select .filter input:focus{border-color:#66afe9;outline:0}pickle-select .options-container{display:block;overflow-x:hidden;overflow-y:auto;max-height:340px;background-color:#fff;position:relative;-webkit-overflow-scrolling:touch}pickle-select:focus{outline:0}details[open] pickle-select{display:block}@media screen and (max-width:767px){pickle-select{position:fixed;width:auto;max-width:none;top:0;left:0!important;bottom:0;right:0!important;margin:0;border-radius:0;border-width:0}pickle-select .title{padding:15px 10px}pickle-select .options-container{max-height:none;height:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1}details[open] pickle-select{z-index:3000;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}}pickle-option{display:block;margin:0;padding:0}pickle-option:active,pickle-option:focus,pickle-option:hover,pickle-option[data-pickle-highlight]{background-color:#f5f5f5;outline:0}pickle-option[data-pickle-filtered]{display:none}pickle-option>a,pickle-option>label{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;border:none;border-bottom:1px solid #dcdcdc;padding:7px 25px 7px 0;position:relative;cursor:pointer;color:#111;text-decoration:none;line-height:20px;font-size:14px;font-weight:400;margin:0}pickle-option>a:active,pickle-option>a:focus,pickle-option>a:hover,pickle-option>label:active,pickle-option>label:focus,pickle-option>label:hover{color:#111;text-decoration:none}.pickle-option-glyph{opacity:0;height:20px;width:25px;text-align:center;font-weight:700}.pickle-option-glyph svg{display:inline-block;height:14px;width:14px;margin-top:3px;fill:currentColor}.pickle-option-input{display:none}.pickle-option-input:checked+.pickle-option-glyph{opacity:1}.pickle-option-label{display:none;font-weight:700}.pickle-option-label:not(:empty){display:block;margin-bottom:7px}';

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

    var ModalHelper = function () {

        var instances = 0;
        var capturedOverflow = '';
        var capturedScrollTop = 0;

        var HelperContext = function () {
            function HelperContext(element) {
                _classCallCheck(this, HelperContext);

                this.lastY = 0;
                this.element = element;
                element.addEventListener('touchstart', this.onTouchStart.bind(this));
                element.addEventListener('touchmove', this.onTouchMove.bind(this));
            }

            _createClass(HelperContext, [{
                key: 'onTouchStart',
                value: function onTouchStart(event) {
                    var currentY = event.touches[0].clientY;

                    this.lastY = currentY;
                }
            }, {
                key: 'onTouchMove',
                value: function onTouchMove(event) {
                    var currentY = event.touches[0].clientY;
                    var top = this.element.scrollTop;
                    var totalScroll = this.element.scrollHeight;
                    var currentScroll = top + this.element.offsetHeight;

                    var scrollingUp = currentY > this.lastY;
                    var scrollingDown = currentY < this.lastY;
                    var cannotScrollUp = top === 0;
                    var cannotScrollDown = currentScroll === totalScroll;

                    if (scrollingUp && cannotScrollUp || scrollingDown && cannotScrollDown) {
                        event.preventDefault();
                    }

                    this.lastY = currentY;
                }
            }]);

            return HelperContext;
        }();

        ;

        return {
            register: function register(element) {
                if (!element._modalHelperContext) {
                    var context = new HelperContext(element);
                    element._modalHelperContext = context;
                }
                instances++;
                if (instances === 1) {
                    capturedOverflow = document.documentElement.style.overflow;
                    document.documentElement.style.overflow = 'hidden';
                }
            },
            unregister: function unregister(element) {
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
    }();

    // Little polyfill for <details> if needed (IE...)
    if (!('HTMLDetailsElement' in window)) {
        (function () {
            var queueDetailsNotificationTask = function queueDetailsNotificationTask(details) {
                if (details._notificationTaskQueued) {
                    return;
                }
                details._notificationTaskQueued = true;
                setTimeout(function () {
                    details._notificationTaskQueued = false;
                    details.open = !details.open;
                    var toggle = document.createEvent('event');
                    toggle.initEvent('toggle', true, false);
                    details.dispatchEvent(toggle);
                });
            };

            detailsElementPolyfilled = true;

            var detailsStyle = document.createElement('style');
            detailsStyle.textContent = '\n            details:not([open]) > :not(summary) {\n                display: none;\n            }\n        ';
            document.head.insertBefore(detailsStyle, document.head.firstChild);

            Object.defineProperty(HTMLUnknownElement.prototype, 'open', {
                get: function get() {
                    return this.hasAttribute('open');
                },
                set: function set(value) {
                    if (value === false) {
                        this.removeAttribute('open');
                    } else {
                        this.setAttribute('open', '');
                    }
                }
            });

            document.addEventListener('click', function (event) {
                var summary = event.target.closest('summary');
                if (summary) {
                    queueDetailsNotificationTask(summary.parentNode);
                }
            });

            document.addEventListener('keydown', function (event) {
                var summary = event.target.closest('summary');
                if (summary) {
                    switch (event.key || event.which || event.keyCode) {
                        case ' ':case 'Spacebar':case 32:
                        case 'Enter':case 13:
                            queueDetailsNotificationTask(summary.parentNode);
                            event.preventDefault();
                            break;
                    }
                }
            });
        })();
    }

    function isPickleOption(node) {
        return node.nodeType === Node.ELEMENT_NODE && node.localName === 'pickle-option';
    }

    function findFirstOption(control, predicate) {
        var assignedNodes = getOptionsSlot(control).assignedNodes();
        var assignedNodesCount = assignedNodes.length;
        for (var i = 0; i < assignedNodesCount; i++) {
            var assignedNode = assignedNodes[i];
            if (!isPickleOption(assignedNode)) {
                continue;
            }
            if (predicate(assignedNode)) {
                return assignedNode;
            }
        }
    }

    function forEachOption(control, action) {
        var assignedNodes = getOptionsSlot(control).assignedNodes();
        var assignedNodesCount = assignedNodes.length;
        for (var i = 0; i < assignedNodesCount; i++) {
            var assignedNode = assignedNodes[i];
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
        return findFirstOption(control, function (option) {
            return option.hasAttribute('data-pickle-highlight');
        });
    }

    function getFirstSelectedOption(control) {
        return findFirstOption(control, function (option) {
            return option.selected;
        });
    }

    function getFirstVisibleOption(control) {
        return findFirstOption(control, function (option) {
            return !option.hasAttribute('data-pickle-filtered');
        });
    }

    function getFocusTarget(control) {
        return getFilterInput(control);
    }

    function scrollOptionIntoView(optionsContainer, option) {
        // focus() causes iOS (et al) to hide keyboard.
        // our scroll logic has constraints: no height: 100% on body

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
            option.removeAttribute('data-pickle-highlight');

            var filtered = false;
            if (filter) {
                var label = option.label.toLowerCase();
                var text = option.text.toLowerCase();
                if (label.indexOf(filter) === -1 && text.indexOf(filter) === -1) {
                    filtered = true;
                }
            }

            if (filtered) {
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
            optionToHighlight.setAttribute('data-pickle-highlight', '');
        }
    }

    function focusCollapsedTarget(control) {
        var details = getAncestorDetails(control);
        if (details) {
            var summary = details.querySelector('summary');
            if (summary) {
                summary.focus();
            }
        }
    }

    function respondToXsMediaQuery(query) {
        var optionsContainer = getOptionsContainer(this);

        if (query.matches) {
            ModalHelper.register(optionsContainer);
        } else {
            ModalHelper.unregister(optionsContainer);
        }
    }

    function handleKeyNavigation(control, event, getSibling) {
        var highlightedOption = getFirstHighlightedOption(control) || getFirstSelectedOption(control);

        if (!highlightedOption) {
            var firstVisibleOption = getFirstVisibleOption(control);
            if (firstVisibleOption) {
                firstVisibleOption.setAttribute('data-pickle-highlight', '');
            }
            return;
        }

        var next = highlightedOption;
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
                    getAncestorDetails(this).open = false;
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
                getAncestorDetails(this).open = false;
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
        var details = getAncestorDetails(this);
        if (details.open && event.composedPath().indexOf(this) === -1) {
            getFilterInput(this).blur();
            details.open = false;
        }
    }

    function handleDetailsToggle(event) {
        var details = event.target;

        if (details.open) {
            var filterInput = getFilterInput(this);
            var listener = respondToXsMediaQuery.bind(this);
            filterInput.value = null;
            filterInput.dataset.value = '';
            filterOptions(this, null);
            listener(smallScreenMediaQuery);
            smallScreenMediaQuery.addListener(listener);

            var firstChecked = getFirstSelectedOption(this);
            if (firstChecked) {
                scrollOptionIntoView(getOptionsContainer(this), firstChecked);
            }

            if (!this.hasAttribute('tabindex')) {
                this.setAttribute('tabindex', 0);
            }

            this.focus();
        } else {
            var _listener = respondToXsMediaQuery.bind(this);
            _listener(smallScreenMediaQuery);
            smallScreenMediaQuery.removeListener(_listener);
            ModalHelper.unregister(getOptionsContainer(this));
        }
    }

    function handleOptionClick(event) {
        var _this = this;

        var ancestorSelect = getAncestorSelect(this);
        if (ancestorSelect) {
            var firstHighlightedOption = getFirstHighlightedOption(ancestorSelect);
            if (firstHighlightedOption) {
                firstHighlightedOption.removeAttribute('data-pickle-highlight');
            }
        }
        this.setAttribute('data-pickle-highlight');

        var input = this.shadowRoot.querySelector('input');
        switch (ancestorSelect.type) {
            case 'checkbox':
                input.checked = !input.checked;
                break;
            case 'radio':
            case 'navigation':
                input.checked = true;
                if (nativeShadowDom || ancestorSelect.type === 'navigation') {
                    forEachOption(ancestorSelect, function (option) {
                        if (option !== _this) {
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
        var select = getAncestorSelect(option);
        var contents = document.importNode(TEMPLATE_OPTION, true);

        var input = contents.querySelector('.pickle-option-input');
        input.checked = option.selected;
        input.value = option.value;

        var label = contents.querySelector('.pickle-option-label');
        label.textContent = option.label;
        label.normalize();

        var wrapper = null;
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
        var existing = option.shadowRoot.firstElementChild;
        if (existing) {
            option.shadowRoot.replaceChild(wrapper, existing);
        } else {
            option.shadowRoot.appendChild(wrapper);
        }
    }

    function registerOptionForFormParticipation(option) {
        // This is here until there is a more 'blessed' way of
        // participating in form submission.
        // See: https://github.com/w3c/webcomponents/issues/187
        var proxyInput = document.createElement('input');
        proxyInput.type = 'hidden';
        document.addEventListener('submit', function (event) {
            var ancestorSelect = getAncestorSelect(option);
            var participated = false;
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

    var PickleSelect = function (_HTMLElement) {
        _inherits(PickleSelect, _HTMLElement);

        function PickleSelect() {
            _classCallCheck(this, PickleSelect);

            var _this2 = _possibleConstructorReturn(this, (PickleSelect.__proto__ || Object.getPrototypeOf(PickleSelect)).call(this));

            _this2.attachShadow({ mode: 'open' });

            _this2.shadowRoot.appendChild(TEMPLATE_SELECT.cloneNode(true));

            _this2.addEventListener('keydown', handleKeydown.bind(_this2));

            _this2.shadowRoot.querySelector('.pickle-select-close').addEventListener('click', function (event) {
                getAncestorDetails(_this2).open = false;
                focusCollapsedTarget(_this2);
            });

            var filterInput = getFilterInput(_this2);

            filterInput.addEventListener('input', function (event) {
                var oldValue = filterInput.dataset.value;
                var newValue = event.target.value;

                if (newValue !== oldValue) {
                    filterInput.dataset.value = newValue;
                    filterOptions(_this2, newValue);
                }
            });

            filterInput.addEventListener('keydown', handleKeydown.bind(_this2));
            return _this2;
        }

        _createClass(PickleSelect, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                var details = this.closest('details');
                if (details) {
                    if (detailsElementPolyfilled) {
                        var summary = details.querySelector('summary');
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
        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                document.removeEventListener('click', handleDocumentClick.bind(this));
            }
        }, {
            key: 'type',
            get: function get() {
                var value = this.getAttribute('type');
                switch (value) {
                    case 'radio':
                    case 'checkbox':
                    case 'navigation':
                        return value;
                    default:
                        return 'radio';
                }
            },
            set: function set(value) {
                this.setAttribute('type', value);
            }
        }, {
            key: 'name',
            get: function get() {
                var value = this.getAttribute('name');
                if (value !== null) {
                    return value.trim();
                }
                return '';
            },
            set: function set(value) {
                if (value == null) {
                    this.removeAttribute('name');
                } else {
                    this.setAttribute('name', value);
                }
            }
        }]);

        return PickleSelect;
    }(HTMLElement);

    var PickleOption = function (_HTMLElement2) {
        _inherits(PickleOption, _HTMLElement2);

        function PickleOption() {
            _classCallCheck(this, PickleOption);

            var _this3 = _possibleConstructorReturn(this, (PickleOption.__proto__ || Object.getPrototypeOf(PickleOption)).call(this));

            _this3.attachShadow({ mode: 'open' });

            _this3.addEventListener('click', handleOptionClick.bind(_this3));

            if (nativeShadowDom) {
                registerOptionForFormParticipation(_this3);
            }
            return _this3;
        }

        _createClass(PickleOption, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                renderOption(this);

                // Simulate the :defined pseudo-class
                this.setAttribute('defined', '');
            }
        }, {
            key: 'value',
            get: function get() {
                return this.getAttribute('value');
            },
            set: function set(value) {
                this.setAttribute('value', value);
            }
        }, {
            key: 'selected',
            get: function get() {
                return this.hasAttribute('selected');
            },
            set: function set(value) {
                if (new Boolean(value) == true) {
                    this.setAttribute('selected', '');
                } else {
                    this.removeAttribute('selected');
                }
            }
        }, {
            key: 'label',
            get: function get() {
                var value = this.getAttribute('label');
                if (value !== null) {
                    return value.trim();
                }
                return '';
            },
            set: function set(value) {
                if (value == null) {
                    this.removeAttribute('label');
                } else {
                    this.setAttribute('label', value);
                }
            }
        }, {
            key: 'text',
            get: function get() {
                return this.textContent.replace(/\s+/, ' ').trim();
            },
            set: function set(value) {
                this.textContent = value;
            }
        }]);

        return PickleOption;
    }(HTMLElement);

    customElements.define('pickle-select', PickleSelect);

    customElements.define('pickle-option', PickleOption);
})();