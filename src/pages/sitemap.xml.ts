import { BookEntity } from '@/lib/data/types';
import { getBooks } from '@/lib/data/books';

const generateSitemap = (data, origin) => {
    let xml = '';

    data.map(page => {
        xml += `<url>
                    <loc>${origin + page.url}</loc>
                    <lastmod>${page.lastModified}</lastmod>
                    ${!!page.image ? `<image:image><image:loc>${page.image}</image:loc></image:image>` : ''}
                </url>`;
    });


    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${xml}</urlset>`;
}

export async function getServerSideProps({ res }) {
    const { items } = await getBooks();
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
        ...items.map((book: BookEntity) => ({
            url: `/books/${book.id}`,
            lastModified: new Date(),
            image: book.imageIds ? `https://drive.google.com/thumbnail?id=${book.imageIds[0]}&amp;sz=w1000` : null
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
