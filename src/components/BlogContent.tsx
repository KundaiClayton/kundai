import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface BlogContentProps {
  content: string;
}

const CodeBlock: React.FC<{ language: string; codestring: string }> = ({ 
  language, 
  codestring 
}) => {
  return (
    <SyntaxHighlighter
      language={language}
      useInlineStyles={false}
      PreTag="div"
      className="article-code"
    >
      {codestring}
    </SyntaxHighlighter>
  );
};

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  if (!content) return <p>No content available.</p>;

  return (
    <div className="prose article-prose">
      <ReactMarkdown
        children={content}
        components={{
          img({ node, ...props }) {
            return <img {...props} alt={props.alt || ''} loading="lazy" decoding="async" />;
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <CodeBlock
                codestring={String(children).replace(/\n$/, '')}
                language={match[1]}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default BlogContent;