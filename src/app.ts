export class App {
  private cardsNode = document.querySelectorAll(
    ".sc-cards > div"
  ) as NodeListOf<HTMLDivElement>;

  private total = 0;

  private currencies: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "$",
    AUD: "$",
  };

  private additionalComments: HTMLTextAreaElement | null =
    document.querySelector("[name='transaction.comments']");

  private cartItems = "";

  private isMonthly = false;

  constructor() {
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
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.run();
      });
    }
  }

  private shouldRun() {
    return this.cardsNode.length > 0;
  }

  private run() {
    while (
      !this.checkNested(
        (window as any).EngagingNetworks,
        "require",
        "_defined",
        "enjs",
        "setFieldValue"
      )
    ) {
      this.log("SPCAI Shopping Cart - Waiting for EngagingNetworks");
      window.setTimeout(() => {
        this.run();
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
    const monthlyStored =
      localStorage.getItem(`sc-cards-${this.getPageId()}-monthly`) ||
      (window as any).EngagingNetworks.require._defined.enjs.getFieldValue(
        "recurrpay"
      );
    if (monthlyStored === "Y") {
      this.updateFrequency("monthly");
      const monthlyCheckbox = document.querySelector(
        "#sc-monthly"
      ) as HTMLInputElement;
      if (monthlyCheckbox) {
        monthlyCheckbox.checked = true;
      }
    } else {
      this.updateFrequency("onetime");
    }
    this.renderMonthly();
    this.renderMonthlyMobile();
    this.initStickyInfo();
    this.initDonateButton();
    this.initPaymentMethodSelection();

    window.setTimeout(() => {
      this.updateTotal();
    }, 500);
  }

  private renderMonthlyMobile() {
    const containers = document.querySelectorAll(
      '.monthly-checkbox-container-mobile'
    ) as NodeListOf<HTMLDivElement>;

    containers.forEach((container) => {
      const label = container.querySelector('label');
      const heading = label?.querySelector('h1, h2, h3');
      const suffixP = container.querySelector('p');

      if (!label || !heading || !suffixP) return;

      const textWrapper = document.createElement('span');
      textWrapper.classList.add('monthly-text');
      textWrapper.innerHTML = `<strong>${heading.innerHTML}</strong> ${suffixP.innerHTML}`;

      heading.remove();
      suffixP.remove();
      label.appendChild(textWrapper);
    });
  }

  private initStickyInfo() {
    const scInfo = document.querySelector(".sc-info") as HTMLElement;
    const scCards = document.querySelector(".sc-cards") as HTMLElement;

    if (!scInfo || !scCards) return;

    const infoNaturalTop = scInfo.getBoundingClientRect().top + window.scrollY;
    const infoHeight = scInfo.offsetHeight;

    const spacer = document.createElement("div");
    spacer.style.height = `${infoHeight}px`;
    spacer.style.display = "none";
    scInfo.parentNode?.insertBefore(spacer, scInfo.nextSibling);

    const update = () => {
      const cardsBottom = scCards.getBoundingClientRect().bottom;

      if (window.scrollY < infoNaturalTop || cardsBottom <= 0) {
        // Before sticky or fully scrolled past
        scInfo.classList.remove("sc-info--sticky");
        scInfo.style.top = "";
        spacer.style.display = "none";
      } else if (cardsBottom >= infoHeight) {
        // Fully sticky at top
        scInfo.classList.add("sc-info--sticky");
        scInfo.style.top = "0px";
        spacer.style.display = "block";
      } else {
        // Being pushed out: sc-cards bottom is crossing the bar
        scInfo.classList.add("sc-info--sticky");
        scInfo.style.top = `${cardsBottom - infoHeight}px`;
        spacer.style.display = "block";
      }
    };

    window.addEventListener("scroll", update, { passive: true });
  }

  private initDonateButton() {
    const donateButton = document.querySelector(".donate-button") as HTMLElement;
    const reviewCart = document.querySelector(".review-cart") as HTMLElement;

    if (!donateButton || !reviewCart) return;

    donateButton.addEventListener("click", () => {
      const top = reviewCart.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  private renderMonthly() {
    const monthlyCheckboxes = document.querySelectorAll(
      ".monthly-checkbox"
    ) as NodeListOf<HTMLDivElement>;

    const recurrpay = (
      window as any
    ).EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay");

    if (monthlyCheckboxes.length === 0) return;

    const isMonthlyChecked = recurrpay === "Y";
    const radioInputs: HTMLInputElement[] = [];

    monthlyCheckboxes.forEach((monthlyCheckbox, index) => {
      const inputId = `frequency-monthly-${index}`;
      const monthlyText = monthlyCheckbox.innerText;
      const input = `
          <input id="${inputId}" name="${inputId}" type="radio" value="monthly" ${isMonthlyChecked ? "checked" : ""
        } />
          <label for="${inputId}">
            <h2>${monthlyText}</h2>
          </label>
        `;
      monthlyCheckbox.innerHTML = input;

      const radioInput = monthlyCheckbox.querySelector(
        `#${inputId}`
      ) as HTMLInputElement;
      if (radioInput) {
        radioInput.dataset.wasChecked = isMonthlyChecked ? "true" : "false";
        radioInputs.push(radioInput);
      }
    });

    radioInputs.forEach((radioInput) => {
      radioInput.addEventListener("click", () => {
        const willBeChecked = radioInput.dataset.wasChecked !== "true";
        const newState = willBeChecked ? "true" : "false";
        const frequency = willBeChecked ? "monthly" : "onetime";

        radioInputs.forEach((input) => {
          input.checked = willBeChecked;
          input.dataset.wasChecked = newState;
        });

        const storageValue = willBeChecked ? "Y" : "N";
        localStorage.setItem(
          `sc-cards-${this.getPageId()}-monthly`,
          storageValue
        );

        monthlyCheckboxes.forEach((container) => {
          if (willBeChecked) {
            container.setAttribute("data-selected", "true");
          } else {
            container.removeAttribute("data-selected");
          }
        });

        this.updateFrequency(frequency);
        this.updateTotal();

        const freqButtons = document.querySelectorAll(
          ".frequency-buttons input"
        ) as NodeListOf<HTMLInputElement>;
        freqButtons.forEach((button) => {
          button.checked =
            (button.value === "onetime" && storageValue === "N") ||
            (button.value === "monthly" && storageValue === "Y");
        });
      });
    });
  }

  private initPaymentMethodSelection() {
    const container = document.querySelector(".payment-buttons-container") as HTMLElement;
    if (!container) return;

    const radios = container.querySelectorAll(
      'input[name="transaction.giveBySelect"]'
    ) as NodeListOf<HTMLInputElement>;

    const items = container.querySelectorAll(
      ".en__field__item"
    ) as NodeListOf<HTMLElement>;

    const updateSelected = () => {
      items.forEach((item) => item.classList.remove("selected"));
      const checked = container.querySelector(
        'input[name="transaction.giveBySelect"]:checked'
      ) as HTMLInputElement | null;
      if (checked) {
        checked.closest(".en__field__item")?.classList.add("selected");
      }
    };

    radios.forEach((radio) => {
      radio.addEventListener("change", updateSelected);
      radio.addEventListener("click", updateSelected);
    });
    items.forEach((item) => {
      item.addEventListener("click", updateSelected);
      item.addEventListener("mouseenter", function () {
        item.classList.add("hover");
        if (!item.classList.contains("hover")) {
          setTimeout(() => item.classList.add("hover"), 0);
        }
      });
      item.addEventListener("mouseleave", function () {
        item.classList.remove("hover");
        if (item.classList.contains("hover")) {
          setTimeout(() => item.classList.remove("hover"), 0);
        }
      });
    });

    const paymentTypeField = document.querySelector(
      "#en__field_transaction_paymenttype"
    ) as HTMLInputElement | null;
    if (paymentTypeField) {
      new MutationObserver(updateSelected).observe(paymentTypeField, {
        attributes: true,
        attributeFilter: ["value"],
      });
      paymentTypeField.addEventListener("change", updateSelected);
      paymentTypeField.addEventListener("input", updateSelected);
    }

    updateSelected();
  }

  private setCardsAtttributes() {
    const storedCards = JSON.parse(
      localStorage.getItem(`sc-cards-${this.getPageId()}`) || "[]"
    );
    this.cardsNode.forEach((card, index) => {
      const amountNode = card.querySelector(
        "h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p"
      ) as HTMLParagraphElement;
      if (amountNode) {
        const amount = amountNode.innerText;
        const amountRegex = amount.match(/(\d+)([,.](\d{1,2}))?/);
        const amountNumber = amountRegex
          ? parseFloat(amountRegex[1] + "." + (amountRegex[3] || "0"))
          : 0;
        const quantity = storedCards[index] || 0;
        if (amountNumber > 0) {
          card.setAttribute("data-amount", amountNumber.toFixed(2));
          card.setAttribute("data-quantity", quantity.toString());
          card.setAttribute("data-card", index.toString());
          card.setAttribute(
            "data-currency-symbol",
            this.getCurrencySymbol(card)
          );
          card.setAttribute(
            "data-currency-position",
            this.getCurrencyPosition(card)
          );
          card.setAttribute("data-currency-code", this.getCurrencyCode(card));
          if (quantity > 0) {
            card.setAttribute("data-selected", "true");
          }
          amountNode.remove();
        }
      }
    });
  }
  private createCardsImageFlip() {
    this.cardsNode.forEach((card) => {
      const cardImageContainer = card.querySelector(
        "p:first-child"
      ) as HTMLParagraphElement;
      if (cardImageContainer) {
        const cardImage = cardImageContainer.querySelectorAll(
          "img"
        ) as NodeListOf<HTMLImageElement>;
        if (cardImage.length > 1) {
          const cardImageInner = document.createElement("div");
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
  }

  private createCardsAmounts() {
    this.cardsNode.forEach((card) => {
      const amount = this.getCardAmount(card);
      let amountHTML = "";
      // check if amount is an int number
      if (amount % 1 === 0) {
        amountHTML = amount.toString();
      } else {
        // Separate the decimal part
        let decimalPart = amount.toString().split(".")[1];
        // If decimal part is only one digit, add a 0
        if (decimalPart.length === 1) {
          decimalPart += "0";
        }
        // Add a span to the decimal part, with 2 decimals
        amountHTML = `${amount.toString().split(".")[0]
          }<span class="decimal">${decimalPart}</span>`;
      }

      const currency = this.getCurrencySymbol(card);
      const position = this.getCurrencyPosition(card);
      const div = document.createElement("div");
      div.classList.add("sc-cards-amount");
      div.classList.add(`position-${position}`);
      div.innerHTML = `<span class="currency">${currency}</span><span class="amount">${amountHTML}</span>`;
      card.appendChild(div);
    });
  }
  private createCardsQuantity() {
    this.cardsNode.forEach((card) => {
      const amountDiv = card.querySelector(
        ".sc-cards-amount"
      ) as HTMLDivElement;
      const quantity = this.getCardQuantity(card);
      const div = document.createElement("div");
      div.classList.add("sc-cards-quantity");
      div.innerHTML = `
        <div class="decrease"></div>
        <div class="quantity-container">
        <div class="quantity">${quantity}</div>
        <small>Quantity</small>
        </div>

        <div class="increase"></div>
      `;
      if (amountDiv) {
        amountDiv.parentNode.insertBefore(div, amountDiv.nextSibling);
      } else {
        card.appendChild(div);
      }
    });
  }

  private increaseQuantity(card: HTMLElement) {
    const quantity = this.getCardQuantity(card);
    const newQuantity = quantity + 1;
    card.setAttribute("data-quantity", newQuantity.toString());
    card.setAttribute("data-selected", "true");
  }

  private decreaseQuantity(card: HTMLElement) {
    const quantity = this.getCardQuantity(card);
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      card.setAttribute("data-quantity", newQuantity.toString());
      if (newQuantity === 0) {
        card.removeAttribute("data-selected");
      }
    }
  }

  private getCardAmount(card: HTMLElement) {
    const amount = card.getAttribute("data-amount");
    if (amount) {
      return parseFloat(amount);
    }
    return 0;
  }
  private getCardTitle(card: HTMLElement) {
    const title = card.querySelector("h1, h2, h3, h4, h5, h6") as HTMLElement;
    if (title) {
      return title.innerText;
    }
    return "";
  }
  private getCurrencySymbol(card: HTMLElement | null) {
    if (card) {
      const currency = card.getAttribute("data-currency-symbol");
      if (currency) {
        return currency;
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
      if (
        card.classList.contains("canadian") ||
        card.classList.contains("cad")
      ) {
        return this.currencies.CAD;
      }
      if (
        card.classList.contains("australian") ||
        card.classList.contains("aud")
      ) {
        return this.currencies.AUD;
      }
    }
    const currency = document.querySelector(
      '[name="transaction.paycurrency"]'
    ) as HTMLInputElement;
    if (currency && currency.value in this.currencies) {
      return this.currencies[currency.value];
    }
    return "$";
  }

  private getCurrencyCode(card: HTMLElement) {
    const currency = card.getAttribute("data-currency-code");
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
    if (
      card.classList.contains("australian") ||
      card.classList.contains("aud")
    ) {
      return "AUD";
    }
    const currencyCode = document.querySelector(
      '[name="transaction.paycurrency"]'
    ) as HTMLInputElement;
    if (currencyCode && currencyCode.value in this.currencies) {
      return currencyCode.value;
    }
    return "USD";
  }

  private getCurrencyPosition(card: HTMLElement) {
    const position = card.getAttribute("data-currency-position");
    if (position) {
      return position;
    }
    // Try to get the currency position from the card class (local)
    if (card.classList.contains("currency-right")) {
      return "right";
    }
    // Try to get the currency position from the row class (global)
    const row = card.closest(".sc-cards") as HTMLElement;
    if (row.classList.contains("currency-right")) {
      return "right";
    }
    // Default position
    return "left";
  }

  private getCardQuantity(card: HTMLElement) {
    const quantity = card.getAttribute("data-quantity");
    if (quantity) {
      return parseInt(quantity, 10);
    }
    return 0;
  }

  private watchForQuantityChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const card = mutation.target as HTMLElement;
          const quantityElement = card.querySelector(
            ".sc-cards-quantity .quantity"
          ) as HTMLDivElement;
          if (quantityElement) {
            quantityElement.innerText = this.getCardQuantity(card).toString();
          }
          this.rememberQuantity();
          this.updateTotal();
        }
      });
    });
    this.cardsNode.forEach((card) => {
      observer.observe(card, {
        attributes: true,
        attributeFilter: ["data-quantity"],
      });
    });
  }
  private addCustomAmountBlock() {
    const customAmountBlock = document.querySelector(".custom-amount-block") as HTMLDivElement;
    if (customAmountBlock) {
      const otherStored =
        localStorage.getItem(`sc-cards-${this.getPageId()}-other`) || "";
      if (otherStored !== "0") {
        customAmountBlock.setAttribute("data-selected", "true");
      }
      const customAmountInput = document.createElement("div");
      customAmountInput.classList.add("custom-amount-input");
      customAmountInput.innerHTML = `
      <span class="custom-amount-label">Custom Amount</span>
      <input id="sc-other-amount" aria-label="Enter your custom donation amount" name="transaction.donationAmt.other-standin" type="text" inputmode="decimal" data-lpignore="true" autocomplete="off" value="${otherStored}" tabindex="1" placeholder="$" />
      <span class="custom-amount-helper">I want my gift to go wherever it’s needed most.</span>
      `;
      customAmountBlock.appendChild(customAmountInput);
      const input = customAmountBlock.querySelector("input") as HTMLInputElement;
      if (input) {
        input.addEventListener("input", (e) => {
          const value = (e.target as HTMLInputElement).value || "0";
          localStorage.setItem(`sc-cards-${this.getPageId()}-other`, value);
          if (value === "0") {
            customAmountBlock.removeAttribute("data-selected");
          } else {
            customAmountBlock.setAttribute("data-selected", "true");
          }
          this.updateTotal();
        });
        input.addEventListener("focus", function (e) {
          if ((e.target as HTMLInputElement).value === "0") {
            (e.target as HTMLInputElement).value = "";
          }
        });
      }
    }
  }
  private addLiveVariables() {
    const textComponents = document.querySelectorAll(
      ".en__component--copyblock, .en__component--codeblock, .submit-button button"
    ) as NodeListOf<HTMLDivElement>;
    if (textComponents.length > 0) {
      textComponents.forEach((component) => {
        this.injectLiveVariableSpans(component);
      });
    }

    const submitButtons = document.querySelectorAll(
      ".submit-button button, .en__submit button"
    ) as NodeListOf<HTMLElement>;
    submitButtons.forEach((btn) => {
      const observer = new MutationObserver(() => {
        const needsSpanReinject = btn.innerHTML.includes("[[");
        const needsMonthlyReinject =
          this.isMonthly && !btn.querySelector(".donate-button-frequency");
        if (needsSpanReinject || needsMonthlyReinject) {
          observer.disconnect();
          if (needsSpanReinject) {
            this.injectLiveVariableSpans(btn);
            const value =
              this.total % 1 !== 0
                ? this.total.toFixed(2)
                : this.total.toString();
            this.updateLiveVariables("TOTAL", value);
          }
          if (needsMonthlyReinject) {
            this.updateDonateButtonFrequency(true);
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
  }

  private injectLiveVariableSpans(component: HTMLElement) {
    if (!component.innerHTML.includes("[[")) return;
    const liveVariables = component.innerHTML.match(/\[\[(.*?)\]\]/g);
    if (!liveVariables) return;
    liveVariables.forEach((variable) => {
      const variableName = variable.replace(/\[\[/g, "").replace(/\]\]/g, "");
      component.innerHTML = component.innerHTML.replace(
        `[[${variableName}]]`,
        `<span class='sc-live-variable' data-variable='${variableName}'></span>`
      );
    });
  }
  private updateLiveVariables(variableName: string, value: string) {
    const liveVariables = document.querySelectorAll(
      ".sc-live-variable[data-variable='" + variableName + "']"
    ) as NodeListOf<HTMLDivElement>;
    if (liveVariables.length > 0) {
      liveVariables.forEach((variable) => {
        variable.innerText = value;
      });
    }
    if (variableName === "FREQUENCY") {
      const freqElements = document.querySelectorAll(
        '[class*="show-frequency-"]'
      ) as NodeListOf<HTMLDivElement>;
      const freq = value === "" ? "single" : "monthly";
      freqElements.forEach((element) => {
        if (element.classList.contains(`show-frequency-${freq}`)) {
          element.classList.remove("spcai-hide");
        } else {
          element.classList.add("spcai-hide");
        }
      });
    }
  }
  private updateTotal() {
    this.total = 0;
    this.cartItems = "";
    this.cardsNode.forEach((card) => {
      const amount = this.getCardAmount(card);
      const quantity = this.getCardQuantity(card);
      const title = this.getCardTitle(card);
      if (quantity > 0) {
        this.cartItems = `['${quantity}','${title}','${amount.toFixed(
          2
        )}'] \r\n${this.cartItems}`;
      }
      this.total += amount * quantity;
    });
    const otherAmount = document.querySelector(
      "#sc-other-amount"
    ) as HTMLInputElement;
    if (otherAmount) {
      const otherAmountValue = parseFloat(
        parseFloat(otherAmount.value).toFixed(2)
      );
      if (otherAmountValue > 0) {
        this.cartItems = `['1','Other','${otherAmountValue.toFixed(2)}'] \r\n${this.cartItems
          }`;
        this.total += otherAmountValue;
      }
    }
    this.log("Shopping Cart Total:", this.total);
    const otherField = document.querySelector(
      "[name='transaction.donationAmt.other']"
    ) as HTMLInputElement;
    if (otherField) {
      otherField.value = this.total.toString();
    }
    (window as any).EngagingNetworks.require._defined.enjs.setFieldValue(
      "donationAmt",
      this.total
    );
    const otherAmountField = document.querySelector(
      'input[name="transaction.donationAmt.other"]'
    ) as HTMLInputElement;
    if (otherAmountField && otherAmountField.value !== "") {
      const keyUpEvent = new Event("keyup");
      otherAmountField.dispatchEvent(keyUpEvent);
    } else {
      const donationAmountCheckbox = document.querySelector(
        'input[name="transaction.donationAmt"]:checked'
      ) as HTMLInputElement;
      if (donationAmountCheckbox) {
        const clickEvent = new Event("click");
        donationAmountCheckbox.dispatchEvent(clickEvent);
      }
    }
    if (this.total % 1 !== 0) {
      this.updateLiveVariables("TOTAL", this.total.toFixed(2));
    } else {
      this.updateLiveVariables("TOTAL", this.total.toString());
    }
    if (this.total > 0) {
      document.querySelector("body").setAttribute("data-item-selected", "true");
    } else {
      document.querySelector("body").removeAttribute("data-item-selected");
    }

    this.additionalComments.value = this.cartItems;

    return this.total;
  }
  private updateFrequency(freq = "") {
    const monthlyInput = document.querySelector(
      "#sc-monthly"
    ) as HTMLInputElement;
    let isMonthly = false;
    if (monthlyInput && monthlyInput.checked) {
      isMonthly = true;
    }
    if (freq === "monthly") {
      isMonthly = true;
    } else if (freq === "onetime") {
      isMonthly = false;
    }
    const monthly = isMonthly ? "Y" : "N";
    (window as any).EngagingNetworks.require._defined.enjs.setFieldValue(
      "recurrpay",
      monthly
    );
    const recurrpay = document.querySelectorAll(
      'input[name="transaction.recurrpay"]'
    ) as NodeListOf<HTMLInputElement>;
    if (recurrpay.length > 0) {
      recurrpay.forEach((input) => {
        if (input.value === monthly) {
          input.dispatchEvent(new Event("change"));
        }
      });
    }
    if (monthly === "Y") {
      (window as any).EngagingNetworks.require._defined.enjs.setFieldValue(
        "recurrfreq",
        "MONTHLY"
      );
    }
    const frequency = (
      window as any
    ).EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay");
    if (frequency === "Y") {
      const monthlyLabel = document.querySelector(
        "[name='transaction.recurrpay'][value='Y'] + label"
      ) as HTMLLabelElement;
      if (monthlyLabel) {
        this.updateLiveVariables("FREQUENCY", monthlyLabel.innerText);
      } else {
        this.updateLiveVariables("FREQUENCY", "Monthly");
      }
    } else {
      this.updateLiveVariables("FREQUENCY", "");
    }
    this.updateDonateButtonFrequency(monthly === "Y");
  }

  private updateDonateButtonFrequency(isMonthly: boolean) {
    this.isMonthly = isMonthly;
    const donateButtons = document.querySelectorAll(
      ".donate-button, .submit-button .en__submit button"
    ) as NodeListOf<HTMLElement>;
    donateButtons.forEach((donateButton) => {
      let label = donateButton.querySelector(
        ".donate-button-frequency"
      ) as HTMLElement | null;
      if (isMonthly) {
        if (!label) {
          label = document.createElement("span");
          label.classList.add("donate-button-frequency");
          donateButton.appendChild(label);
        }
        label.innerText = "Monthly";
      } else if (label) {
        label.remove();
      }
    });
  }
  private setQuantityClickEvent() {
    this.cardsNode.forEach((card) => {
      const increase = card.querySelector(
        ".sc-cards-quantity > .increase"
      ) as HTMLDivElement;
      const decrease = card.querySelector(
        ".sc-cards-quantity > .decrease"
      ) as HTMLDivElement;
      if (increase && decrease) {
        increase.addEventListener("click", () => {
          this.increaseQuantity(card);
          this.flashButton(increase);
        });
        decrease.addEventListener("click", () => {
          this.decreaseQuantity(card);
          this.flashButton(decrease);
        });
      }
    });
  }

  private flashButton(el: HTMLElement, duration = 200) {
    el.classList.add("clicking");
    window.setTimeout(() => {
      el.classList.remove("clicking");
    }, duration);
  }

  private rememberQuantity() {
    const cards: number[] = [];
    this.cardsNode.forEach((card, index) => {
      cards[index] = this.getCardQuantity(card);
    });
    localStorage.setItem(`sc-cards-${this.getPageId()}`, JSON.stringify(cards));
  }

  private getPageId() {
    if ("pageJson" in window) return (window as any)?.pageJson?.campaignPageId;
    return 0;
  }

  private isDebug() {
    const regex = new RegExp("[\\?&]debug=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  private checkDebug() {
    if (this.isDebug()) {
      document.querySelector("body").setAttribute("data-debug", "true");
    }
  }

  private checkNested(obj: any, ...args: string[]) {
    for (let i = 0; i < args.length; i++) {
      if (!obj || !Object.getOwnPropertyDescriptor(obj, args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  private createAdditionalComments() {
    const formBlock = document.createElement("div");
    formBlock.classList.add(
      "en__component",
      "en__component--formblock",
      "hide"
    );

    const textField = document.createElement("div");
    textField.classList.add("en__field", "en__field--text");

    const textElement = document.createElement("div");
    textElement.classList.add("en__field__element", "en__field__element--text");

    const inputField = document.createElement("textarea");
    inputField.classList.add(
      "en__field__input",
      "en__field__input--textarea",
      "foursite-shopping-cart-added-input"
    );
    inputField.setAttribute("name", "transaction.comments");
    inputField.setAttribute("value", "");
    if (this.isDebug()) {
      inputField.style.width = "100%";
      inputField.setAttribute(
        "placeholder",
        "Additional Comments (Debug Mode)"
      );
    }

    textElement.appendChild(inputField);
    textField.appendChild(textElement);
    formBlock.appendChild(textField);
    const submitElement = document.querySelector(
      ".en__submit"
    ) as HTMLDivElement;
    if (submitElement) {
      const lastFormComponent = submitElement.closest(".en__component");
      if (lastFormComponent) {
        // Insert the new field after the submit button
        lastFormComponent.parentNode?.insertBefore(
          formBlock,
          lastFormComponent.nextSibling
        );
      }
    } else {
      const form = document.querySelector("form");
      if (form) {
        form.appendChild(formBlock);
      }
    }
    this.additionalComments = inputField;
  }

  public log(message: any, ...optionalParams: any[]) {
    if (this.isDebug()) {
      console.log(message, optionalParams);
    }
  }
}
