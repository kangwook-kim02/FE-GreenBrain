import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

/**
 * AI 응답에서 다양한 수식 표기를 remark-math 인식 형식으로 정규화한다.
 *
 * 처리 대상:
 *  A. \[...\]          →  $$...$$   표준 LaTeX 디스플레이
 *  B. \(...\)          →  $...$     표준 LaTeX 인라인
 *  C. 단독 줄 $        →  $$        AI가 $ 한 줄로 블록 구분 (상태 기계 처리)
 *  D. $$expr$$ 인라인  →  $expr$    AI가 인라인 변수에 $$ 사용 (remark-math 미지원)
 *  E. [ formula ] 줄   →  $$...$$   AI 비표준 대괄호 수식
 */
function preprocessMath(content: string): string {
  // A. \[...\] → $$...$$ (multiline 허용)
  content = content.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `\n$$\n${inner}\n$$\n`)
  // B. \(...\) → $...$
  content = content.replace(/\\\((.*?)\\\)/g, (_, inner) => `$${inner}$`)

  // C. 단독 줄 $ 구분자 → $$ (상태 기계)
  // regex 백트래킹 문제를 피하기 위해 줄 단위로 직접 처리
  const lines = content.split('\n')
  const out: string[] = []
  let inBlock = false
  for (const line of lines) {
    if (line.trim() === '$') {
      out.push('$$')
      inBlock = !inBlock
    } else {
      out.push(line)
    }
  }
  content = out.join('\n')

  // D. 텍스트 중간의 $$expr$$ → $expr$ (remark-math는 인라인에 $...$만 지원)
  // 블록 구분자(줄 전체가 $$인 경우)는 이미 C에서 처리됐으므로 여기선 인라인만 해당
  content = content.replace(/\$\$([^$\n]+?)\$\$/g, (_, inner) => `$${inner}$`)

  // E. [ formula ] 단독 줄 → $$ formula $$
  content = content.replace(/^\[ (.+) \]$/gm, (_, inner: string) =>
    /[\\^_{}=+\-]/.test(inner) ? `\n$$\n${inner}\n$$\n` : `[ ${inner} ]`
  )

  return content
}

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1.5">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-2">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-3 text-gray-600 my-2 italic">
            {children}
          </blockquote>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-100 rounded-lg p-3 overflow-x-auto mb-2 text-xs font-mono whitespace-pre-wrap">
            {children}
          </pre>
        ),
        code: ({ children, className }) => {
          const isBlock = Boolean(className)
          return isBlock ? (
            <code className="font-mono">{children}</code>
          ) : (
            <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          )
        },
        hr: () => <hr className="border-gray-200 my-3" />,
        a: ({ href, children }) => (
          <a href={href} className="text-green-600 underline hover:text-green-700" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {preprocessMath(content)}
    </ReactMarkdown>
  )
}
