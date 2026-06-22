# Shopping Cart like experience for Engaging Networks Donation pages

This package turns an Engaging Networks donation page into a shopping-cart-style experience. Supporters can add "items" to their cart, adjust quantities, choose one-time or monthly giving, and enter a custom amount before submitting a single donation.

## How to use it

The Shopping Cart page will try to use the currency code from the `transaction.paycurrency` hidden field. You can override or control the currency symbol by adding one of these classes to a card or the Other Amount block: `usd`, `dollar`, `eur`, `euro`, `gbp`, `pound`, `cad`, `canadian`, `aud`, `australian`.

You can set the currency code position to the right of the amount by adding the `currency-right` class to either the card's row (global) or the card's container (specific).

## Creating the Header

Add an advanced row with the class `sc-header`. The row should contain:

1. A **Copy Block** with:
   - An optional small label paragraph.
   - An `h1` headline.
   - A short body paragraph.
2. An **Image Block** with the header image.

The text content is positioned on the left and the image fills the right column.

## Available themes

Apply a theme by adding one of these classes to a card, the header, or an information component:

- **bg-navy**: `#163F58` — white text, navy amount circle
- **bg-red**: `#E22028` — white text, navy amount circle
- **bg-gradient**: linear gradient from `#163F58` to `#E22028` — white text

## Creating a Card

Each card is a Copy Block inside an advanced row with the class `sc-cards`. Build a card with this structure:

1. First paragraph: the card image (optional).
2. A heading (`h1`, `h2`, or `h3`) with the card title.
3. The next paragraph must contain the card amount (for example, `25`). The script reads this value automatically.
4. Add any theme class such as `bg-navy` or `bg-red` to the Copy Block.

The script injects the quantity controls and the circular amount badge for each card.

## Adding the Other Amount Block & Theming Cards

To let supporters enter a custom amount:

1. Add a Copy Block inside `sc-cards` with the class `block-other`.
2. Add a heading and an optional image. The custom amount input is generated automatically.
3. Apply a theme class to match the surrounding cards.

## Creating the Information Row

Add an advanced row with the class `sc-info`. The row typically contains:

1. An optional **Image Block** for an icon or photo.
2. A **Copy Block** with an `info-title` class and a heading.
3. A **Checkbox** inside a Copy Block with the class `monthly-checkbox` to let supporters toggle monthly giving.

## Live Variables `TOTAL` & `FREQUENCY`

You can reference the running cart total and the selected frequency anywhere in a Copy Block, Code Block, or button label by using:

- `[[TOTAL]]` — the current sum of selected card quantities and the other amount.
- `[[FREQUENCY]]` — the selected frequency label when monthly giving is active (empty for one-time).

The script replaces these placeholders live as the supporter makes selections.

## Using the flip image

To show a second image when a card is selected, place two images in the first paragraph of the card. When the card's quantity is greater than zero, the card flips to reveal the second image.

## Debugging

If you need to troubleshoot your page, add `?debug=true` to your URL. This will enable verbose `console.log` outputs from the script and visually highlight hidden form fields (like the generated `transaction.comments` text area) in light red.

## Development

- Clone the repository
- Run `npm install`
- Make changes to the `src` folder
- Run `npm run build` to compile the changes
- Deploy the content of the `dist` folder to Engaging Networks

*NB: On windows you may also need to install the node_env npm package:*

    npm install -g win-node-env
