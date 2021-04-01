import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactElement } from 'react';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import Header from '../../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): ReactElement {
  const router = useRouter();

  const time = Math.ceil(
    post.data.content
      .map(content => {
        const headingWords = +content.heading.split(' ').length;
        const bodyWords = +RichText.asText(content.body).split(' ').length;
        const total = headingWords + bodyWords;
        return total;
      })
      .reduce((acc, value) => {
        return acc + value;
      }) / 200
  );

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <img src={post.data.banner.url} alt="banner" />

      <div className={styles.content}>
        <strong className={styles.title}>{post.data.title}</strong>
        <span className={styles.info}>
          <section>
            <FiCalendar />
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </section>
          <section>
            <FiUser /> {post.data.author}
          </section>
          <section>
            <FiClock /> {time} min
          </section>
        </span>
        {post.data.content.map(content => (
          <div key={content.heading} className={styles.textContent}>
            <h1>{content.heading}</h1>
            <section>
              {content.body.map((body, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={idx}> {body.text}</p>
              ))}
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query('');

  const results = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: results,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();

  const { slug } = context.params;
  const response = await prismic.getByUID('posts', String(slug), {});

  if (!response) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [
            ...content.body.map(body => {
              return {
                spans: body.spans,
                text: body.text,
                type: body.type,
              };
            }),
          ],
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
