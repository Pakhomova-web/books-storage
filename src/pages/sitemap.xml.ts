import { BookEntity } from '@/lib/data/types';
import { getAllBooks } from '@/lib/data/books';
import { CATALOGUE, ICatalogueItem } from '@/constants/options';

const generateSitemap = (data, origin) => {
    let xml = '';

    data.map(({ url }) => {
        xml += `<url>
                    <loc>${origin + url}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.7</priority>
                </url>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${xml}</urlset>`;
}

export async function getServerSideProps({ res }) {
    const items: { id: string, imageIds?: string[] }[] = await getAllBooks().catch((err) => [{ id: err }]);
    const data = [
        { url: '' },
        { url: '/about-us' },
        ...items.map((book: BookEntity) => ({ url: `/books/${book.id}` })),
        ...getCatalogueItems(CATALOGUE)
    ];

    res.setHeader('Content-Type', 'text/xml');
    res.write(generateSitemap(data, process.env.FRONTEND_URL));
    res.end();

    return {
        props: {}
    };
}

function getCatalogueItems(items: ICatalogueItem[], id?: string): { url: string }[] {
    let urls = [];

    if (!!items?.length) {
        items.forEach(item => {
            urls.push({ url: `/books/catalogue/${id ? `${id}-` : ''}${item.id}` });
            if (!!item.children?.length) {
                urls.push(...getCatalogueItems(item.children, `${id ? `${id}-` : ''}${item.id}`));
            }
        });
    }

    return urls;
}

const SitemapIndex = () => null;
export default SitemapIndex;
