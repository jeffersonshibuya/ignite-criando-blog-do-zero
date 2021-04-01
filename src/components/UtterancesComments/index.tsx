import { useEffect, useRef } from 'react';

export const UtterancesComments: React.FC = () => {
  const commentsDiv = useRef<HTMLDivElement>();

  useEffect(() => {
    if (commentsDiv) {
      const scriptEl = document.createElement('script');
      scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
      scriptEl.setAttribute('crossorigin', 'anonymous');
      scriptEl.setAttribute('async', 'true');
      scriptEl.setAttribute('repo', 'jeffersonshibuya/ignite-blog-utteranc');
      scriptEl.setAttribute('issue-term', 'pathname');
      scriptEl.setAttribute('label', 'blog-comment');
      scriptEl.setAttribute('theme', 'github-dark');
      commentsDiv.current.appendChild(scriptEl);
    }
  }, []);

  return <div ref={commentsDiv} />;
};
// <section
//   ref={elem => {
//     if (!elem) {
//       return;
//     }
//     const scriptElem = document.createElement('script');
//     scriptElem.src = 'https://utteranc.es/client.js';
//     scriptElem.async = true;
//     scriptElem.crossOrigin = 'anonymous';
//     scriptElem.setAttribute('repo', 'jeffersonshibuya/ignite-blog-utteranc');
//     scriptElem.setAttribute('issue-term', 'pathname');
//     scriptElem.setAttribute('label', 'blog-comment');
//     scriptElem.setAttribute('theme', 'github-dark');
//     elem.appendChild(scriptElem);
//   }}
// />
