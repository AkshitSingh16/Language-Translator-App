import { useState, useRef } from 'react';
import { ArrowRightLeft, Copy, Check, Loader2, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Translation API — no key, no signup required
// ─────────────────────────────────────────────────────────────
// Uses Google Translate's public web endpoint. Free, but unofficial —
// fine for personal projects and demos. For production use, prefer an
// official API (RapidAPI, Google Cloud Translation, DeepL, etc).
const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
// ─────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ru', label: 'Russian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ko', label: 'Korean' },
  { code: 'it', label: 'Italian' },
  { code: 'tr', label: 'Turkish' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ta', label: 'Tamil' },
  { code: 'mr', label: 'Marathi' },
];

export default function App() {
  const [sourceText, setSourceText] = useState('');
  const [translated, setTranslated] = useState('');
  const [targetLang, setTargetLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(false);
  const debounceRef = useRef(null);

  const targetLabel = LANGUAGES.find((l) => l.code === targetLang)?.label ?? targetLang;

  async function translate(text, lang) {
    if (!text.trim()) {
      setTranslated('');
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        client: 'gtx',
        sl: 'en',
        tl: lang,
        dt: 't',
        q: text,
      });
      const res = await fetch(`${TRANSLATE_URL}?${params.toString()}`);

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();
      // Response shape: [[["translated chunk","original chunk",null,null,...], ...], ...]
      const result = Array.isArray(data?.[0])
        ? data[0].map((chunk) => chunk[0]).join('')
        : '';

      if (!result) throw new Error('Empty response from API');

      setTranslated(result);
      setPulse(true);
      setTimeout(() => setPulse(false), 700);
    } catch (err) {
      setError(err.message || 'Something went wrong while translating.');
      setTranslated('');
    } finally {
      setLoading(false);
    }
  }

  function handleTextChange(e) {
    const value = e.target.value;
    setSourceText(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => translate(value, targetLang), 500);
  }

  function handleLangChange(e) {
    const lang = e.target.value;
    setTargetLang(lang);
    if (sourceText.trim()) translate(sourceText, lang);
  }

  function handleCopy() {
    if (!translated) return;
    navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Header */}
      <header className="px-6 md:px-12 pt-10 pb-6 md:pt-14 md:pb-8 border-b border-seam">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-ink-soft mb-3">
            English &middot; to &middot; anywhere
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">
            Say it in your language
          </h1>
          <p className="font-sans text-ink-soft mt-2 max-w-md">
            Type in English on the left. Watch it cross over on the right.
          </p>
        </div>
      </header>

      {/* Main panel */}
      <main className="flex-1 px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-seam bg-white/40 shadow-[0_1px_3px_rgba(28,26,23,0.06)]">

            {/* Source panel */}
            <div className="relative p-6 md:p-8 md:pr-10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans text-xs tracking-[0.15em] uppercase text-ink-soft">
                  English
                </span>
                <span className="font-sans text-xs text-ink-soft tabular-nums">
                  {sourceText.length} chars
                </span>
              </div>
              <textarea
                value={sourceText}
                onChange={handleTextChange}
                placeholder="Start typing..."
                rows={9}
                className="w-full resize-none bg-transparent font-display text-xl md:text-2xl leading-relaxed text-ink placeholder:text-ink-soft/50 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Seam divider */}
            <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-seam flex-col items-center">
              <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="bg-paper border border-seam rounded-full p-2">
                  <ArrowRightLeft size={14} className="text-ink-soft" strokeWidth={2} />
                </div>
                {pulse && (
                  <div className="absolute top-0 w-px h-24 bg-pen seam-pulse" />
                )}
              </div>
            </div>

            {/* Target panel */}
            <div className="relative p-6 md:p-8 md:pl-10 bg-paper-dim/60 border-t md:border-t-0 border-seam">
              <div className="flex items-center justify-between mb-4 gap-3">
                <select
                  value={targetLang}
                  onChange={handleLangChange}
                  className="font-sans text-xs tracking-[0.15em] uppercase text-pen bg-transparent border-none focus:outline-none cursor-pointer appearance-none pr-1"
                  style={{ backgroundImage: 'none' }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label.toUpperCase()}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin text-ink-soft" />}
                  {translated && !loading && (
                    <button
                      onClick={handleCopy}
                      className="text-ink-soft hover:text-pen transition-colors"
                      aria-label="Copy translation"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="min-h-[200px] md:min-h-[225px]">
                {error ? (
                  <div className="font-sans text-sm text-pen flex items-start gap-2 fade-up">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : translated ? (
                  <p className="font-display text-xl md:text-2xl leading-relaxed text-ink fade-up">
                    {translated}
                  </p>
                ) : (
                  <p className="font-display text-xl md:text-2xl leading-relaxed text-ink-soft/40">
                    Your {targetLabel.toLowerCase()} translation appears here.
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="font-sans text-xs text-ink-soft/70 mt-5 text-center">
            Translates as you pause typing
          </p>
        </div>
      </main>
    </div>
  );
}
