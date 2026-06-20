# Say It — English Translator

A React + Tailwind CSS app that translates text from English into the language of your choice. No API key or signup required — it uses Google Translate's free public web endpoint.

## Setup

```bash
npm install
npm run dev
```

That's it — open the dev server URL and start typing.

## How it works

- Type English text on the left.
- Pick a target language from the dropdown on the right.
- Translation happens automatically ~500ms after you stop typing.
- Copy the result with one click.

## Note on the translation API

This uses `translate.googleapis.com`, an unofficial public endpoint that Google Translate's own website calls under the hood. It's free and needs no key, which makes it great for learning/demo projects — but it isn't an official, rate-limited, or SLA-backed API, so:

- It can occasionally be rate-limited or blocked if called very heavily.
- For a production app, swap it out for an official provider — Google Cloud Translation API, DeepL, or any translation API on RapidAPI — all of which need an API key but offer reliability guarantees.

To switch providers later, you only need to edit the `translate()` function in `src/App.jsx` — change the URL/fetch call and how `result` is read from the response.

## Stack

- React (Vite)
- Tailwind CSS v4
- lucide-react (icons)
