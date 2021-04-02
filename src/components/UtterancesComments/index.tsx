import { useEffect } from 'react';

const addUtterancesScript = (
  parentElement,
  repo,
  label,
  issueTerm,
  theme,
  isIssueNumber
): void => {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://utteranc.es/client.js');
  script.setAttribute('crossorigin', 'anonymous');
  script.setAttribute('async', 'true');
  script.setAttribute('repo', repo);

  if (label !== '') {
    script.setAttribute('label', label);
  }

  if (isIssueNumber) {
    script.setAttribute('issue-number', issueTerm);
  } else {
    script.setAttribute('issue-term', issueTerm);
  }

  script.setAttribute('theme', theme);

  parentElement.appendChild(script);
};

export default function UtterancesComments(): JSX.Element {
  const repo = 'jeffersonshibuya/ignite-blog-utteranc';
  const theme = 'github-dark';
  const issueTerm = 'pathname';
  const label = 'blog-comment';

  useEffect(() => {
    // Get comments box
    const commentsBox = document.getElementById('commentsBox');

    // Check if comments box is loaded
    if (!commentsBox) {
      return;
    }

    // Get utterances
    const utterances = document.getElementsByClassName('utterances')[0];

    // Remove utterances if it exists
    if (utterances) {
      utterances.remove();
    }

    // Add utterances script
    addUtterancesScript(commentsBox, repo, label, issueTerm, theme, false);
  });

  return <div id="commentsBox" />;
}

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
