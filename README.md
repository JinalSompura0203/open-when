# Unfolding Letters

A small website of "open when…" letters, kept in a wooden box with five volumes.

---

## Run it on your computer (Windows)

1. On GitHub, click the green **Code** button → **Download ZIP**.
2. Right-click the ZIP file → **Extract All**. (Do not run it from inside the ZIP.)
3. Open the extracted folder and **double-click `start-windows.bat`**.

The first time, it installs everything it needs (Node.js and the website's parts).
This can take a few minutes. If Windows asks *"Do you want to allow this app to make changes?"*, click **Yes**.

Then the website opens in your browser. Keep the black window open while you use it. Close it to stop.

> If the script says Node.js was just installed, close the window and double-click `start-windows.bat` again.

## Edit a letter

On GitHub, open the `letters` folder, click the letter file, then the ✏️ pencil icon.
Change the text and click **Commit changes**. The website updates in 1-2 minutes.
(On your computer: edit the file in Notepad and refresh the browser.)

## Add a new letter

**Easiest:** open the **write a letter** page (`write.html` on the website), fill the form, and click
*Send this letter to the website*. GitHub opens; click **Commit changes**. The website updates itself in 1-2 minutes.

**By hand:** add a text file to the `letters` folder, named like `vol2-letter07.txt`:

```
title: Open when you miss me
from: Om, Jinu
card: pink
stickers: ❤️ 🌸
---
My dear,

The letter text goes here.
```

- `vol2` = volume 1 to 5, `letter07` = letter 01 to 20 (always two digits)
- `from` = who wrote it (optional). For more than one person, separate names with commas:
  `from: Om, Jinu` shows as **— Om & Jinu**. If there is no `from` line, the name in `settings.js` is used.
- `card` = `pink`, `purple` or `white`
- Optional lines: `photo: https://…` and `gif: https://…`

## Change the title, your name, or add a passcode

Edit **`settings.js`**. Each setting is explained at the top of that file.

---

## For developers

Built with [React](https://react.dev) + [Vite](https://vite.dev).

| Command         | What it does                                   |
| --------------- | ---------------------------------------------- |
| `npm install`   | Install dependencies                           |
| `npm start`     | Dev server, opens the browser                  |
| `npm run build` | Build the static site into `dist/`             |
| `npm run preview` | Serve the built `dist/` folder locally       |

```
index.html, write.html     Page entry points (two pages)
settings.js                User-editable settings
letters/                   Letter files, bundled at build time (import.meta.glob)
src/
  main.jsx, App.jsx        Main site: passcode → box → volume → letter
  components/              Background, BoxView, Chest, VolumeView, LetterOverlay,
                           SealedEnvelope, LetterCard, PasscodeGate, ErrorBoundary
  lib/                     Letter parsing, constants, image imports, read-state hook
  styles/                  CSS, one file per area
  write/                   The "write a letter" page
  assets/images/           All pictures
public/                    Files copied as-is (e.g. put photos in public/assets/
                           and use `photo: assets/name.jpg` in a letter)
```

### Deploying (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

One-time setup: in the GitHub repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
