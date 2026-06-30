# For restaurant owners

You don't need to touch any code to keep your website up to date. Everything that changes regularly — your menu, your opening hours, your press mentions, your "what's on" — lives in **Sanity Studio**, a browser tool your developer will set up once.

## Logging in

Your developer will give you a URL like:

> `https://<your-restaurant>.sanity.studio`

Log in with the email they invited. You don't need a password — Sanity sends you a magic link.

## What you can edit

| | |
|---|---|
| **Restaurant** | Your name, tagline, hero image, address, phone, opening hours, social links, OpenTable ID. |
| **Menus** | Dinner, brunch, tasting — anything you want. Drag to reorder. Allergens per item. |
| **Events** | Wine pairings, supper clubs, residencies. Anything dated. |
| **Press** | The Guardian, Time Out, Eater — pull quotes + links. |
| **Pages** | Free-text marketing pages (e.g. "Private hire"). |

## Publishing a change

1. Edit the document.
2. Click **Publish** in the bottom bar.
3. Your website rebuilds itself within ~2 minutes — no further action needed.

## What you can NOT edit (by design)

- The page layout, fonts, colours, button styles — those are part of the design and live in code.
- The structure of the navigation menu.
- Anything to do with the booking widget itself (use the OpenTable dashboard for that).

If you ever need any of those changed, ask your developer — it's a 10-minute task and they redeploy from Git.

## Mistakes are easy to fix

- Every change creates a **version history** in Sanity. Click the clock icon to see and restore earlier versions.
- Every site deploy is **immutable**. If a bad publish ever breaks something, your developer can roll back to the previous version of the entire site in 30 seconds.

## Tips

- **Allergens** — use the chip list per menu item; the website renders them automatically.
- **Opening hours** — mark a day "Closed" rather than leaving the times blank.
- **Press quotes** — keep them under 15 words; longer pulls don't fit the card layout.
- **Images** — upload the highest-resolution version you have; Sanity resizes for every device.

## Help

Anything that confuses you, write to your developer with a screenshot. They can usually answer in one line.
