import { booksQuery } from '@/lib/graphql/queries/book/queries';
import { apolloClient } from '@/lib/apollo';
import { BookEntity } from '@/lib/data/types';

const generateSitemap = (data, origin) => {
    let xml = '';

    data.map(page => {
        xml += `<url><loc>${origin + page.url}</loc><lastmod>${page.lastModified}</lastmod></url>`
    });


    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${xml}
    </urlset>`;
}

export async function getServerSideProps({ res }) {
    const booksData = await apolloClient.query({
        query: booksQuery,
        fetchPolicy: 'no-cache'
    });

    const data = [
        {
            url: '/',
            lastModified: new Date()
        },
        {
            url: '/books',
            lastModified: new Date()
        },
        {
            url: '/about-us',
            lastModified: new Date()
        },
        {
            url: '/publishing-houses',
            lastModified: new Date()
        },
        {
            url: '/sign-in',
            lastModified: new Date()
        },
        {
            url: '/basket',
            lastModified: new Date()
        },
        {
            url: '/profile/personal-info',
            lastModified: new Date()
        },
        {
            url: '/profile/likes',
            lastModified: new Date()
        },
        {
            url: '/profile/orders',
            lastModified: new Date()
        },
        ...booksData['books'].items.map((book: BookEntity) => ({
            url: `${process.env.FRONTEND_URL}/books/${book.id}`,
            lastModified: new Date(),
            priority: 0.9,
            images: book.imageIds ? [`https://drive.google.com/thumbnail?id=${book.imageIds[0]}&sz=w1000`] : []
        }))
    ];

    res.setHeader('Content-Type', 'text/xml');
    res.write(generateSitemap(data, process.env.FRONTEND_URL));
    res.end();

    return {
        props: {}
    };
}

const SitemapIndex = () => null;
export default SitemapIndex;
