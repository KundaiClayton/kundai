
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
      style={vscDarkPlus}
      PreTag="div"
      className="rounded-lg !bg-gray-800/50 !m-0"
    >
      {codestring}
    </SyntaxHighlighter>
  );
};

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  console.log('Content received in BlogContent:', content); // Debug log

  if (!content) {
    console.log('No content received');
    return <div>No content available</div>;
  }

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        children={content} // Make sure to use children prop
        // className="prose prose-invert max-w-none 
        //            prose-headings:text-white/90 prose-headings:font-bold 
        //            prose-p:text-white/80 prose-p:leading-relaxed
        //            prose-a:text-orange-400/95 prose-a:no-underline hover:prose-a:underline
        //            prose-strong:text-white/90
        //            prose-code:text-orange-400/95 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        //            prose-pre:bg-transparent prose-pre:p-0
        //            prose-ul:text-white/80 prose-ol:text-white/80
        //            prose-blockquote:border-l-orange-400/50 prose-blockquote:text-white/60
        //            prose-img:rounded-lg"
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
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