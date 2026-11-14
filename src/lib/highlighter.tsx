import * as React from "react"
import {
  createHighlighter,
  type BuiltinLanguage,
  type BuiltinTheme,
  type GrammarState,
  type ThemedToken,
} from "shiki"

/* Dark theme to match the HireLoop design */
const theme: BuiltinTheme = "github-dark"

let highlighterPromise: Promise<Awaited<ReturnType<typeof createHighlighter>>> | null = null

function getCore() {
  highlighterPromise ??= createHighlighter({
    themes: [theme],
    langs: [],
  })
  return highlighterPromise
}

export interface HighlightResult {
  lines: React.ReactNode[]
  state?: GrammarState
}

export interface CodeHighlighter {
  highlight(code: string, state?: GrammarState): HighlightResult
}

const languageCache = new Map<string, Promise<CodeHighlighter>>()

/**
 * Loads a highlighter for the given language. Languages and the theme are
 * loaded lazily on first use; each language is prepared only once.
 */
export async function loadHighlighter(language: string): Promise<CodeHighlighter> {
  const cached = languageCache.get(language)
  if (cached) return cached

  const promise = (async () => {
    const highlighter = await getCore()
    try {
      await highlighter.loadLanguage(language as BuiltinLanguage)
    } catch {
      // Unknown language: fall back to plain text
      await highlighter.loadLanguage("text" as BuiltinLanguage)
    }

    function highlight(code: string, state?: GrammarState): HighlightResult {
      const lines = highlighter.codeToTokensBase(code, {
        lang: language as BuiltinLanguage,
        theme,
        grammarState: state,
        includeExplanation: false,
      })

      return {
        lines: lines.map(tokensToSpan),
        state: highlighter.getLastGrammarState(lines),
      }
    }

    return { highlight }
  })()

  languageCache.set(language, promise)
  return promise
}

function tokensToSpan(line: ThemedToken[]): React.ReactNode {
  if (line.length === 0) return null
  return (
    <span>
      {line.map((token, index) => (
        <span key={index} style={{ color: token.color ?? "inherit" }}>
          {token.content}
        </span>
      ))}
    </span>
  )
}
