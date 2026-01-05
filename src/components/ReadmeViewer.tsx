import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { generateHeadingId } from '@/lib/markdown'
import type { Readme } from '@/lib/db'

interface ReadmeViewerProps {
  readme: Readme
}

export function ReadmeViewer({ readme }: ReadmeViewerProps) {

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none px-6 py-8 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-[#282c34] prose-pre:border prose-pre:border-border">
      <ReactMarkdown
        components={{
          // Custom code block rendering with syntax highlighting
          code(props) {
            const { children, className, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (language) {
              return (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  language={language}
                  style={oneDark}
                  className="rounded-lg"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              )
            }
            
            return (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          },
          // Custom heading rendering to ensure IDs are preserved
          h1: ({ children, ...props }) => {
            const text = typeof children === 'string' ? children : String(children)
            const id = generateHeadingId(text)
            return (
              <h1 id={id} {...props}>
                {children}
              </h1>
            )
          },
          h2: ({ children, ...props }) => {
            const text = typeof children === 'string' ? children : String(children)
            const id = generateHeadingId(text)
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            )
          },
          h3: ({ children, ...props }) => {
            const text = typeof children === 'string' ? children : String(children)
            const id = generateHeadingId(text)
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            )
          },
          h4: ({ children, ...props }) => {
            const text = typeof children === 'string' ? children : String(children)
            const id = generateHeadingId(text)
            return (
              <h4 id={id} {...props}>
                {children}
              </h4>
            )
          },
          h5: ({ children, ...props }) => {
            const text = typeof children === 'string' ? children : String(children)
            const id = generateHeadingId(text)
            return (
              <h5 id={id} {...props}>
                {children}
              </h5>
            )
          },
          h6: ({ children, ...props }) => {
            const text = typeof children === 'string' ? children : String(children)
            const id = generateHeadingId(text)
            return (
              <h6 id={id} {...props}>
                {children}
              </h6>
            )
          },
        }}
      >
        {readme.content}
      </ReactMarkdown>
    </div>
  )
}

