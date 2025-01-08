import { BookEntity } from '@/lib/data/types';
import { getAllBooks } from '@/lib/data/books';

const generateSitemap = (data, origin) => {
    let xml = '';

    data.map(({ url, image }) => {
        xml += `<url>
                    <loc>${origin + url}</loc>
                    ${!!image ? `<image:image><image:loc>${image}</image:loc></image:image>` : ''}
                </url>`;
    });


    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${xml}</urlset>`;
}

export async function getServerSideProps({ res }) {
    const items: { id: string, imageIds?: string[] }[] = await getAllBooks().catch((err) => [{ id: err }]);
    const data = [
        { url: '' },
        { url: '/books' },
        { url: '/about-us' },
        { url: '/publishing-houses' },
        { url: '/sign-in' },
        ...items.map((book: BookEntity) => ({
            url: `/books/${book.id}`,
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
