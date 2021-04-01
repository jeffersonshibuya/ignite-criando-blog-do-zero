/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Prismic from '@prismicio/client';
import { Document } from '@prismicio/client/types/documents';

const apiEndpoint = process.env.PRISMIC_API_ENDPOINT;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

// Client method to query from the Prismic repo
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Client = (req = null) =>
  // eslint-disable-next-line no-use-before-define
  Prismic.client(apiEndpoint, createClientOptions(req, accessToken));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};
  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Preview = async (req, res) => {
  const { token: ref, documentId } = req.query;
  const redirectUrl = await Client(req)
    .getPreviewResolver(ref, documentId)
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });
  res.writeHead(302, { Location: `${redirectUrl}` });
  return res.end();
};

export default Preview;
