import ReactMarkdown from 'react-markdown'

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
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
      {content}
    </ReactMarkdown>
  )
}
