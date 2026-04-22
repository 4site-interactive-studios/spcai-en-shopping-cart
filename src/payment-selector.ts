/**
 * Payment Selector
 *
 * Initialises every `.payment-selector` block on the page.
 * For each block it:
 *   - hides the native radio input visually (CSS handles appearance)
 *   - reflects the selected value on `body.dataset.paymentType` so that
 *     conditional field visibility rules (e.g. show credit-card fields only
 *     when paymentType === "card") work out of the box.
 *
 * Usage in Engaging Networks:
 *   Add the class "payment-selector" (and optionally "bg-{name}") to the
 *   en__component--formblock that wraps the paymenttype radio field.
 *
 *   <div class="en__component en__component--formblock payment-selector bg-blue">
 *     ...paymenttype radio field...
 *   </div>
 */

/**
 * For every element that has a payment-type class (e.g. "ACH", "card"),
 * removes `hide` when its type matches `type` and adds `hide` otherwise.
 * Elements are expected to already have the `hide` class in the markup so
 * they are hidden at runtime but still visible in the page builder editor.
 */
function syncPaymentContainers(type: string): void {
  document
    .querySelectorAll<HTMLElement>(".payment-type-container")
    .forEach((el) => {
      el.classList.toggle("hide", !el.classList.contains(type));
    });
}

function syncPaymentType(value: string): void {
  document.body.dataset.paymentType = value;
  syncPaymentContainers(value);
}

function initPaymentSelectors(): void {
  // Event delegation: catches change events even when inputs are added to the
  // DOM dynamically (e.g. in Engaging Networks page builder).
  document.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    if (input.name === "transaction.paymenttype") {
      syncPaymentType(input.value);
    }
  });

  // Reflect any already-checked value on load.
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="transaction.paymenttype"]:checked'
  );
  if (checked) {
    syncPaymentType(checked.value);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPaymentSelectors);
} else {
  initPaymentSelectors();
}
