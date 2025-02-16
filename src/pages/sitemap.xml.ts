import { BookEntity } from '@/lib/data/types';
import { getAllBooks } from '@/lib/data/books';
import { CATALOGUE, ICatalogueItem } from '@/constants/options';

const generateSitemap = (data, origin) => {
    let xml = '';

    data.map(({ url }) => {
        xml += `<url>
                    <loc>${origin + url}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                </url>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${xml}</urlset>`;
}

export async function getServerSideProps({ res }) {
    const data = [
        { url: '' },
        { url: '/about-us' },
        { url: '/sitemaps/sitemap_products_1.xml'},
        { url: '/sitemaps/sitemap_products_2.xml'},
        { url: '/sitemaps/sitemap_products_3.xml'}
    ];
    getCatalogueItems(CATALOGUE).forEach(item => data.push(item));

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
