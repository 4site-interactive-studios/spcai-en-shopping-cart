/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/sass/style.scss":
/*!*****************************!*\
  !*** ./src/sass/style.scss ***!
  \*****************************/
/***/ (() => {

// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.cardsNode = document.querySelectorAll(".sc-cards > div");
        this.total = 0;
        this.currencies = {
            USD: "$",
            EUR: "€",
            GBP: "£",
            CAD: "$",
            AUD: "$",
        };
        this.additionalComments = document.querySelector("[name='transaction.comments']");
        this.cartItems = "";
        this.isMonthly = false;
        this.log("Shopping Cart: Debug mode is on");
        if (!this.shouldRun()) {
            this.log("Shopping Cart Not Running");
            return;
        }
        // Check for Additional Comments, if not found, create it
        if (!this.additionalComments) {
            // Create Additional Comments field
            this.createAdditionalComments();
        }
        // Document Load
        if (document.readyState !== "loading") {
            this.run();
        }
        else {
            document.addEventListener("DOMContentLoaded", function () {
                _this.run();
            });
        }
    }
    App.prototype.shouldRun = function () {
        return this.cardsNode.length > 0;
    };
    App.prototype.run = function () {
        var _this = this;
        while (!this.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "setFieldValue")) {
            this.log("SPCAI Shopping Cart - Waiting for EngagingNetworks");
            window.setTimeout(function () {
                _this.run();
            }, 10);
            return;
        }
        this.setCardsAtttributes();
        this.createCardsAmounts();
        this.createCardsQuantity();
        this.createCardsImageFlip();
        this.watchForQuantityChanges();
        this.setQuantityClickEvent();
        this.addLiveVariables();
        this.addCustomAmountBlock();
        this.checkDebug();
        var monthlyStored = localStorage.getItem("sc-cards-".concat(this.getPageId(), "-monthly")) ||
            window.EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay");
        if (monthlyStored === "Y") {
            this.updateFrequency("monthly");
            var monthlyCheckbox = document.querySelector("#sc-monthly");
            if (monthlyCheckbox) {
                monthlyCheckbox.checked = true;
            }
        }
        else {
            this.updateFrequency("onetime");
        }
        this.renderMonthly();
        this.renderMonthlyMobile();
        this.initStickyInfo();
        this.initDonateButton();
        this.initPaymentMethodSelection();
        window.setTimeout(function () {
            _this.updateTotal();
        }, 500);
    };
    App.prototype.renderMonthlyMobile = function () {
        var containers = document.querySelectorAll('.monthly-checkbox-container-mobile');
        containers.forEach(function (container) {
            var label = container.querySelector('label');
            var heading = label === null || label === void 0 ? void 0 : label.querySelector('h1, h2, h3');
            var suffixP = container.querySelector('p');
            if (!label || !heading || !suffixP)
                return;
            var textWrapper = document.createElement('span');
            textWrapper.classList.add('monthly-text');
            textWrapper.innerHTML = "<strong>".concat(heading.innerHTML, "</strong> ").concat(suffixP.innerHTML);
            heading.remove();
            suffixP.remove();
            label.appendChild(textWrapper);
        });
    };
    App.prototype.initStickyInfo = function () {
        var _a;
        var scInfo = document.querySelector(".sc-info");
        var scCards = document.querySelector(".sc-cards");
        if (!scInfo || !scCards)
            return;
        var infoNaturalTop = scInfo.getBoundingClientRect().top + window.scrollY;
        var infoHeight = scInfo.offsetHeight;
        var spacer = document.createElement("div");
        spacer.style.height = "".concat(infoHeight, "px");
        spacer.style.display = "none";
        (_a = scInfo.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(spacer, scInfo.nextSibling);
        var update = function () {
            var cardsBottom = scCards.getBoundingClientRect().bottom;
            if (window.scrollY < infoNaturalTop || cardsBottom <= 0) {
                // Before sticky or fully scrolled past
                scInfo.classList.remove("sc-info--sticky");
                scInfo.style.top = "";
                spacer.style.display = "none";
            }
            else if (cardsBottom >= infoHeight) {
                // Fully sticky at top
                scInfo.classList.add("sc-info--sticky");
                scInfo.style.top = "0px";
                spacer.style.display = "block";
            }
            else {
                // Being pushed out: sc-cards bottom is crossing the bar
                scInfo.classList.add("sc-info--sticky");
                scInfo.style.top = "".concat(cardsBottom - infoHeight, "px");
                spacer.style.display = "block";
            }
        };
        window.addEventListener("scroll", update, { passive: true });
    };
    App.prototype.initDonateButton = function () {
        var donateButton = document.querySelector(".donate-button");
        var reviewCart = document.querySelector(".review-cart");
        if (!donateButton || !reviewCart)
            return;
        donateButton.addEventListener("click", function () {
            var top = reviewCart.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top, behavior: "smooth" });
        });
    };
    App.prototype.renderMonthly = function () {
        var _this = this;
        var monthlyCheckboxes = document.querySelectorAll(".monthly-checkbox");
        var recurrpay = window.EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay");
        if (monthlyCheckboxes.length === 0)
            return;
        var isMonthlyChecked = recurrpay === "Y";
        var radioInputs = [];
        monthlyCheckboxes.forEach(function (monthlyCheckbox, index) {
            var inputId = "frequency-monthly-".concat(index);
            var monthlyText = monthlyCheckbox.innerText;
            var input = "\n          <input id=\"".concat(inputId, "\" name=\"").concat(inputId, "\" type=\"radio\" value=\"monthly\" ").concat(isMonthlyChecked ? "checked" : "", " />\n          <label for=\"").concat(inputId, "\">\n            <h2>").concat(monthlyText, "</h2>\n          </label>\n        ");
            monthlyCheckbox.innerHTML = input;
            var radioInput = monthlyCheckbox.querySelector("#".concat(inputId));
            if (radioInput) {
                radioInput.dataset.wasChecked = isMonthlyChecked ? "true" : "false";
                radioInputs.push(radioInput);
            }
        });
        radioInputs.forEach(function (radioInput) {
            radioInput.addEventListener("click", function () {
                var willBeChecked = radioInput.dataset.wasChecked !== "true";
                var newState = willBeChecked ? "true" : "false";
                var frequency = willBeChecked ? "monthly" : "onetime";
                radioInputs.forEach(function (input) {
                    input.checked = willBeChecked;
                    input.dataset.wasChecked = newState;
                });
                var storageValue = willBeChecked ? "Y" : "N";
                localStorage.setItem("sc-cards-".concat(_this.getPageId(), "-monthly"), storageValue);
                monthlyCheckboxes.forEach(function (container) {
                    if (willBeChecked) {
                        container.setAttribute("data-selected", "true");
                    }
                    else {
                        container.removeAttribute("data-selected");
                    }
                });
                _this.updateFrequency(frequency);
                _this.updateTotal();
                var freqButtons = document.querySelectorAll(".frequency-buttons input");
                freqButtons.forEach(function (button) {
                    button.checked =
                        (button.value === "onetime" && storageValue === "N") ||
                            (button.value === "monthly" && storageValue === "Y");
                });
            });
        });
    };
    App.prototype.initPaymentMethodSelection = function () {
        var container = document.querySelector(".payment-buttons-container");
        if (!container)
            return;
        var radios = container.querySelectorAll('input[name="transaction.giveBySelect"]');
        var items = container.querySelectorAll(".en__field__item");
        var updateSelected = function () {
            var _a;
            items.forEach(function (item) { return item.classList.remove("selected"); });
            var checked = container.querySelector('input[name="transaction.giveBySelect"]:checked');
            if (checked) {
                (_a = checked.closest(".en__field__item")) === null || _a === void 0 ? void 0 : _a.classList.add("selected");
            }
        };
        radios.forEach(function (radio) {
            radio.addEventListener("change", updateSelected);
            radio.addEventListener("click", updateSelected);
        });
        items.forEach(function (item) {
            item.addEventListener("click", updateSelected);
            item.addEventListener("mouseenter", function () {
                item.classList.add("hover");
                if (!item.classList.contains("hover")) {
                    setTimeout(function () { return item.classList.add("hover"); }, 0);
                }
            });
            item.addEventListener("mouseleave", function () {
                item.classList.remove("hover");
                if (item.classList.contains("hover")) {
                    setTimeout(function () { return item.classList.remove("hover"); }, 0);
                }
            });
        });
        var paymentTypeField = document.querySelector("#en__field_transaction_paymenttype");
        if (paymentTypeField) {
            new MutationObserver(updateSelected).observe(paymentTypeField, {
                attributes: true,
                attributeFilter: ["value"],
            });
            paymentTypeField.addEventListener("change", updateSelected);
            paymentTypeField.addEventListener("input", updateSelected);
        }
        updateSelected();
    };
    App.prototype.setCardsAtttributes = function () {
        var _this = this;
        var storedCards = JSON.parse(localStorage.getItem("sc-cards-".concat(this.getPageId())) || "[]");
        this.cardsNode.forEach(function (card, index) {
            var amountNode = card.querySelector("h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p");
            if (amountNode) {
                var amount = amountNode.innerText;
                var amountRegex = amount.match(/(\d+)([,.](\d{1,2}))?/);
                var amountNumber = amountRegex
                    ? parseFloat(amountRegex[1] + "." + (amountRegex[3] || "0"))
                    : 0;
                var quantity = storedCards[index] || 0;
                if (amountNumber > 0) {
                    card.setAttribute("data-amount", amountNumber.toFixed(2));
                    card.setAttribute("data-quantity", quantity.toString());
                    card.setAttribute("data-card", index.toString());
                    card.setAttribute("data-currency-symbol", _this.getCurrencySymbol(card));
                    card.setAttribute("data-currency-position", _this.getCurrencyPosition(card));
                    card.setAttribute("data-currency-code", _this.getCurrencyCode(card));
                    if (quantity > 0) {
                        card.setAttribute("data-selected", "true");
                    }
                    amountNode.remove();
                }
            }
        });
    };
    App.prototype.createCardsImageFlip = function () {
        this.cardsNode.forEach(function (card) {
            var cardImageContainer = card.querySelector("p:first-child");
            if (cardImageContainer) {
                var cardImage = cardImageContainer.querySelectorAll("img");
                if (cardImage.length > 1) {
                    var cardImageInner = document.createElement("div");
                    cardImageInner.classList.add("sc-card-image-inner");
                    cardImageContainer.classList.add("sc-card-image-flip");
                    cardImage[0].classList.add("sc-card-image-front");
                    cardImage[1].classList.add("sc-card-image-back");
                    cardImageInner.appendChild(cardImage[0]);
                    cardImageInner.appendChild(cardImage[1]);
                    cardImageContainer.innerHTML = "";
                    cardImageContainer.appendChild(cardImageInner);
                    card.setAttribute("data-flip", "true");
                }
            }
        });
    };
    App.prototype.createCardsAmounts = function () {
        var _this = this;
        this.cardsNode.forEach(function (card) {
            var amount = _this.getCardAmount(card);
            var amountHTML = "";
            // check if amount is an int number
            if (amount % 1 === 0) {
                amountHTML = amount.toString();
            }
            else {
                // Separate the decimal part
                var decimalPart = amount.toString().split(".")[1];
                // If decimal part is only one digit, add a 0
                if (decimalPart.length === 1) {
                    decimalPart += "0";
                }
                // Add a span to the decimal part, with 2 decimals
                amountHTML = "".concat(amount.toString().split(".")[0], "<span class=\"decimal\">").concat(decimalPart, "</span>");
            }
            var currency = _this.getCurrencySymbol(card);
            var position = _this.getCurrencyPosition(card);
            var div = document.createElement("div");
            div.classList.add("sc-cards-amount");
            div.classList.add("position-".concat(position));
            div.innerHTML = "<span class=\"currency\">".concat(currency, "</span><span class=\"amount\">").concat(amountHTML, "</span>");
            card.appendChild(div);
        });
    };
    App.prototype.createCardsQuantity = function () {
        var _this = this;
        this.cardsNode.forEach(function (card) {
            var amountDiv = card.querySelector(".sc-cards-amount");
            var quantity = _this.getCardQuantity(card);
            var div = document.createElement("div");
            div.classList.add("sc-cards-quantity");
            div.innerHTML = "\n        <div class=\"decrease\"></div>\n        <div class=\"quantity-container\">\n        <div class=\"quantity\">".concat(quantity, "</div>\n        <small>Quantity</small>\n        </div>\n\n        <div class=\"increase\"></div>\n      ");
            if (amountDiv) {
                amountDiv.parentNode.insertBefore(div, amountDiv.nextSibling);
            }
            else {
                card.appendChild(div);
            }
        });
    };
    App.prototype.increaseQuantity = function (card) {
        var quantity = this.getCardQuantity(card);
        var newQuantity = quantity + 1;
        card.setAttribute("data-quantity", newQuantity.toString());
        card.setAttribute("data-selected", "true");
    };
    App.prototype.decreaseQuantity = function (card) {
        var quantity = this.getCardQuantity(card);
        if (quantity > 0) {
            var newQuantity = quantity - 1;
            card.setAttribute("data-quantity", newQuantity.toString());
            if (newQuantity === 0) {
                card.removeAttribute("data-selected");
            }
        }
    };
    App.prototype.getCardAmount = function (card) {
        var amount = card.getAttribute("data-amount");
        if (amount) {
            return parseFloat(amount);
        }
        return 0;
    };
    App.prototype.getCardTitle = function (card) {
        var title = card.querySelector("h1, h2, h3, h4, h5, h6");
        if (title) {
            return title.innerText;
        }
        return "";
    };
    App.prototype.getCurrencySymbol = function (card) {
        if (card) {
            var currency_1 = card.getAttribute("data-currency-symbol");
            if (currency_1) {
                return currency_1;
            }
            if (card.classList.contains("euro") || card.classList.contains("eur")) {
                return this.currencies.EUR;
            }
            if (card.classList.contains("pound") || card.classList.contains("gbp")) {
                return this.currencies.GBP;
            }
            if (card.classList.contains("dollar") || card.classList.contains("usd")) {
                return this.currencies.USD;
            }
            if (card.classList.contains("canadian") ||
                card.classList.contains("cad")) {
                return this.currencies.CAD;
            }
            if (card.classList.contains("australian") ||
                card.classList.contains("aud")) {
                return this.currencies.AUD;
            }
        }
        var currency = document.querySelector('[name="transaction.paycurrency"]');
        if (currency && currency.value in this.currencies) {
            return this.currencies[currency.value];
        }
        return "$";
    };
    App.prototype.getCurrencyCode = function (card) {
        var currency = card.getAttribute("data-currency-code");
        if (currency) {
            return currency;
        }
        if (card.classList.contains("euro") || card.classList.contains("eur")) {
            return "EUR";
        }
        if (card.classList.contains("pound") || card.classList.contains("gbp")) {
            return "GBP";
        }
        if (card.classList.contains("dollar") || card.classList.contains("usd")) {
            return "USD";
        }
        if (card.classList.contains("canadian") || card.classList.contains("cad")) {
            return "CAD";
        }
        if (card.classList.contains("australian") ||
            card.classList.contains("aud")) {
            return "AUD";
        }
        var currencyCode = document.querySelector('[name="transaction.paycurrency"]');
        if (currencyCode && currencyCode.value in this.currencies) {
            return currencyCode.value;
        }
        return "USD";
    };
    App.prototype.getCurrencyPosition = function (card) {
        var position = card.getAttribute("data-currency-position");
        if (position) {
            return position;
        }
        // Try to get the currency position from the card class (local)
        if (card.classList.contains("currency-right")) {
            return "right";
        }
        // Try to get the currency position from the row class (global)
        var row = card.closest(".sc-cards");
        if (row.classList.contains("currency-right")) {
            return "right";
        }
        // Default position
        return "left";
    };
    App.prototype.getCardQuantity = function (card) {
        var quantity = card.getAttribute("data-quantity");
        if (quantity) {
            return parseInt(quantity, 10);
        }
        return 0;
    };
    App.prototype.watchForQuantityChanges = function () {
        var _this = this;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes") {
                    var card = mutation.target;
                    var quantityElement = card.querySelector(".sc-cards-quantity .quantity");
                    if (quantityElement) {
                        quantityElement.innerText = _this.getCardQuantity(card).toString();
                    }
                    _this.rememberQuantity();
                    _this.updateTotal();
                }
            });
        });
        this.cardsNode.forEach(function (card) {
            observer.observe(card, {
                attributes: true,
                attributeFilter: ["data-quantity"],
            });
        });
    };
    App.prototype.addCustomAmountBlock = function () {
        var _this = this;
        var customAmountBlock = document.querySelector(".custom-amount-block");
        if (customAmountBlock) {
            var otherStored = localStorage.getItem("sc-cards-".concat(this.getPageId(), "-other")) || "";
            if (otherStored !== "0") {
                customAmountBlock.setAttribute("data-selected", "true");
            }
            var customAmountInput = document.createElement("div");
            customAmountInput.classList.add("custom-amount-input");
            customAmountInput.innerHTML = "\n      <span class=\"custom-amount-label\">Custom Amount</span>\n      <input id=\"sc-other-amount\" aria-label=\"Enter your custom donation amount\" name=\"transaction.donationAmt.other-standin\" type=\"text\" inputmode=\"decimal\" data-lpignore=\"true\" autocomplete=\"off\" value=\"".concat(otherStored, "\" tabindex=\"1\" placeholder=\"$\" />\n      <span class=\"custom-amount-helper\">I want my gift to go wherever it\u2019s needed most.</span>\n      ");
            customAmountBlock.appendChild(customAmountInput);
            var input = customAmountBlock.querySelector("input");
            if (input) {
                input.addEventListener("input", function (e) {
                    var value = e.target.value || "0";
                    localStorage.setItem("sc-cards-".concat(_this.getPageId(), "-other"), value);
                    if (value === "0") {
                        customAmountBlock.removeAttribute("data-selected");
                    }
                    else {
                        customAmountBlock.setAttribute("data-selected", "true");
                    }
                    _this.updateTotal();
                });
                input.addEventListener("focus", function (e) {
                    if (e.target.value === "0") {
                        e.target.value = "";
                    }
                });
            }
        }
    };
    App.prototype.addLiveVariables = function () {
        var _this = this;
        var textComponents = document.querySelectorAll(".en__component--copyblock, .en__component--codeblock, .submit-button button");
        if (textComponents.length > 0) {
            textComponents.forEach(function (component) {
                _this.injectLiveVariableSpans(component);
            });
        }
        var submitButtons = document.querySelectorAll(".submit-button button, .en__submit button");
        submitButtons.forEach(function (btn) {
            var observer = new MutationObserver(function () {
                var needsSpanReinject = btn.innerHTML.includes("[[");
                var needsMonthlyReinject = _this.isMonthly && !btn.querySelector(".donate-button-frequency");
                if (needsSpanReinject || needsMonthlyReinject) {
                    observer.disconnect();
                    if (needsSpanReinject) {
                        _this.injectLiveVariableSpans(btn);
                        var value = _this.total % 1 !== 0
                            ? _this.total.toFixed(2)
                            : _this.total.toString();
                        _this.updateLiveVariables("TOTAL", value);
                    }
                    if (needsMonthlyReinject) {
                        _this.updateDonateButtonFrequency(true);
                    }
                    observer.observe(btn, {
                        childList: true,
                        subtree: true,
                        characterData: true,
                    });
                }
            });
            observer.observe(btn, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        });
    };
    App.prototype.injectLiveVariableSpans = function (component) {
        if (!component.innerHTML.includes("[["))
            return;
        var liveVariables = component.innerHTML.match(/\[\[(.*?)\]\]/g);
        if (!liveVariables)
            return;
        liveVariables.forEach(function (variable) {
            var variableName = variable.replace(/\[\[/g, "").replace(/\]\]/g, "");
            component.innerHTML = component.innerHTML.replace("[[".concat(variableName, "]]"), "<span class='sc-live-variable' data-variable='".concat(variableName, "'></span>"));
        });
    };
    App.prototype.updateLiveVariables = function (variableName, value) {
        var liveVariables = document.querySelectorAll(".sc-live-variable[data-variable='" + variableName + "']");
        if (liveVariables.length > 0) {
            liveVariables.forEach(function (variable) {
                variable.innerText = value;
            });
        }
        if (variableName === "FREQUENCY") {
            var freqElements = document.querySelectorAll('[class*="show-frequency-"]');
            var freq_1 = value === "" ? "single" : "monthly";
            freqElements.forEach(function (element) {
                if (element.classList.contains("show-frequency-".concat(freq_1))) {
                    element.classList.remove("spcai-hide");
                }
                else {
                    element.classList.add("spcai-hide");
                }
            });
        }
    };
    App.prototype.updateTotal = function () {
        var _this = this;
        this.total = 0;
        this.cartItems = "";
        this.cardsNode.forEach(function (card) {
            var amount = _this.getCardAmount(card);
            var quantity = _this.getCardQuantity(card);
            var title = _this.getCardTitle(card);
            if (quantity > 0) {
                _this.cartItems = "['".concat(quantity, "','").concat(title, "','").concat(amount.toFixed(2), "'] \r\n").concat(_this.cartItems);
            }
            _this.total += amount * quantity;
        });
        var otherAmount = document.querySelector("#sc-other-amount");
        if (otherAmount) {
            var otherAmountValue = parseFloat(parseFloat(otherAmount.value).toFixed(2));
            if (otherAmountValue > 0) {
                this.cartItems = "['1','Other','".concat(otherAmountValue.toFixed(2), "'] \r\n").concat(this.cartItems);
                this.total += otherAmountValue;
            }
        }
        this.log("Shopping Cart Total:", this.total);
        var otherField = document.querySelector("[name='transaction.donationAmt.other']");
        if (otherField) {
            otherField.value = this.total.toString();
        }
        window.EngagingNetworks.require._defined.enjs.setFieldValue("donationAmt", this.total);
        var otherAmountField = document.querySelector('input[name="transaction.donationAmt.other"]');
        if (otherAmountField && otherAmountField.value !== "") {
            var keyUpEvent = new Event("keyup");
            otherAmountField.dispatchEvent(keyUpEvent);
        }
        else {
            var donationAmountCheckbox = document.querySelector('input[name="transaction.donationAmt"]:checked');
            if (donationAmountCheckbox) {
                var clickEvent = new Event("click");
                donationAmountCheckbox.dispatchEvent(clickEvent);
            }
        }
        if (this.total % 1 !== 0) {
            this.updateLiveVariables("TOTAL", this.total.toFixed(2));
        }
        else {
            this.updateLiveVariables("TOTAL", this.total.toString());
        }
        if (this.total > 0) {
            document.querySelector("body").setAttribute("data-item-selected", "true");
        }
        else {
            document.querySelector("body").removeAttribute("data-item-selected");
        }
        this.additionalComments.value = this.cartItems;
        return this.total;
    };
    App.prototype.updateFrequency = function (freq) {
        if (freq === void 0) { freq = ""; }
        var monthlyInput = document.querySelector("#sc-monthly");
        var isMonthly = false;
        if (monthlyInput && monthlyInput.checked) {
            isMonthly = true;
        }
        if (freq === "monthly") {
            isMonthly = true;
        }
        else if (freq === "onetime") {
            isMonthly = false;
        }
        var monthly = isMonthly ? "Y" : "N";
        window.EngagingNetworks.require._defined.enjs.setFieldValue("recurrpay", monthly);
        var recurrpay = document.querySelectorAll('input[name="transaction.recurrpay"]');
        if (recurrpay.length > 0) {
            recurrpay.forEach(function (input) {
                if (input.value === monthly) {
                    input.dispatchEvent(new Event("change"));
                }
            });
        }
        if (monthly === "Y") {
            window.EngagingNetworks.require._defined.enjs.setFieldValue("recurrfreq", "MONTHLY");
        }
        var frequency = window.EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay");
        if (frequency === "Y") {
            var monthlyLabel = document.querySelector("[name='transaction.recurrpay'][value='Y'] + label");
            if (monthlyLabel) {
                this.updateLiveVariables("FREQUENCY", monthlyLabel.innerText);
            }
            else {
                this.updateLiveVariables("FREQUENCY", "Monthly");
            }
        }
        else {
            this.updateLiveVariables("FREQUENCY", "");
        }
        this.updateDonateButtonFrequency(monthly === "Y");
    };
    App.prototype.updateDonateButtonFrequency = function (isMonthly) {
        this.isMonthly = isMonthly;
        var donateButtons = document.querySelectorAll(".donate-button, .submit-button .en__submit button");
        donateButtons.forEach(function (donateButton) {
            var label = donateButton.querySelector(".donate-button-frequency");
            if (isMonthly) {
                if (!label) {
                    label = document.createElement("span");
                    label.classList.add("donate-button-frequency");
                    donateButton.appendChild(label);
                }
                label.innerText = "Monthly";
            }
            else if (label) {
                label.remove();
            }
        });
    };
    App.prototype.setQuantityClickEvent = function () {
        var _this = this;
        this.cardsNode.forEach(function (card) {
            var increase = card.querySelector(".sc-cards-quantity > .increase");
            var decrease = card.querySelector(".sc-cards-quantity > .decrease");
            if (increase && decrease) {
                increase.addEventListener("click", function () {
                    _this.increaseQuantity(card);
                    _this.flashButton(increase);
                });
                decrease.addEventListener("click", function () {
                    _this.decreaseQuantity(card);
                    _this.flashButton(decrease);
                });
            }
        });
    };
    App.prototype.flashButton = function (el, duration) {
        if (duration === void 0) { duration = 200; }
        el.classList.add("clicking");
        window.setTimeout(function () {
            el.classList.remove("clicking");
        }, duration);
    };
    App.prototype.rememberQuantity = function () {
        var _this = this;
        var cards = [];
        this.cardsNode.forEach(function (card, index) {
            cards[index] = _this.getCardQuantity(card);
        });
        localStorage.setItem("sc-cards-".concat(this.getPageId()), JSON.stringify(cards));
    };
    App.prototype.getPageId = function () {
        var _a;
        if ("pageJson" in window)
            return (_a = window === null || window === void 0 ? void 0 : window.pageJson) === null || _a === void 0 ? void 0 : _a.campaignPageId;
        return 0;
    };
    App.prototype.isDebug = function () {
        var regex = new RegExp("[\\?&]debug=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null
            ? ""
            : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    App.prototype.checkDebug = function () {
        if (this.isDebug()) {
            document.querySelector("body").setAttribute("data-debug", "true");
        }
    };
    App.prototype.checkNested = function (obj) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < args.length; i++) {
            if (!obj || !Object.getOwnPropertyDescriptor(obj, args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    };
    App.prototype.createAdditionalComments = function () {
        var _a;
        var formBlock = document.createElement("div");
        formBlock.classList.add("en__component", "en__component--formblock", "hide");
        var textField = document.createElement("div");
        textField.classList.add("en__field", "en__field--text");
        var textElement = document.createElement("div");
        textElement.classList.add("en__field__element", "en__field__element--text");
        var inputField = document.createElement("textarea");
        inputField.classList.add("en__field__input", "en__field__input--textarea", "foursite-shopping-cart-added-input");
        inputField.setAttribute("name", "transaction.comments");
        inputField.setAttribute("value", "");
        if (this.isDebug()) {
            inputField.style.width = "100%";
            inputField.setAttribute("placeholder", "Additional Comments (Debug Mode)");
        }
        textElement.appendChild(inputField);
        textField.appendChild(textElement);
        formBlock.appendChild(textField);
        var submitElement = document.querySelector(".en__submit");
        if (submitElement) {
            var lastFormComponent = submitElement.closest(".en__component");
            if (lastFormComponent) {
                // Insert the new field after the submit button
                (_a = lastFormComponent.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(formBlock, lastFormComponent.nextSibling);
            }
        }
        else {
            var form = document.querySelector("form");
            if (form) {
                form.appendChild(formBlock);
            }
        }
        this.additionalComments = inputField;
    };
    App.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.isDebug()) {
            console.log(message, optionalParams);
        }
    };
    return App;
}());



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/* harmony import */ var _sass_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sass/style.scss */ "./src/sass/style.scss");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");


new _app__WEBPACK_IMPORTED_MODULE_1__.App();

/******/ })()
;
//# sourceMappingURL=en-shopping-cart.js.map