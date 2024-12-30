import { booksQuery } from '@/lib/graphql/queries/book/queries';
import { apolloClient } from '@/lib/apollo';
import { BookEntity } from '@/lib/data/types';

const generateSitemap = (data, origin) => {
    let xml = '';

    data.map(page => {
        xml += `<url>
                    <loc>${origin + page.url}</loc>
                    <lastmod>${page.lastModified}</lastmod>
                    ${!!page.image ? `<image:image><image:loc>${page.image}</image:loc></image:image>` : ''}
                </url>`
    });


    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`;
}

export async function getServerSideProps({ res }) {
    let books = [];

    // await apolloClient.query({
    //     query: booksQuery,
    //     fetchPolicy: 'no-cache'
    // }).then(data => {
    //     books = data['books']?.items || [];
    // }).catch(err => console.log(err));

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
        ...books.map((book: BookEntity) => ({
            url: `/books/${book.id}`,
            lastModified: new Date(),
            image: book.imageIds ? `https://drive.google.com/thumbnail?id=${book.imageIds[0]}&sz=w1000` : null
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
