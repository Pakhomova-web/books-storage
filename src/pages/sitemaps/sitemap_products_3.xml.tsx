import { getAllBooks } from '@/lib/data/books';

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
    const items: { id: string, imageIds?: string[] }[] = await getAllBooks({ page: 2, rowsPerPage: 400 })
        .catch((err) => [{ id: err }]);
    const data = items.map(b => ({ url: `/books/${b.id}` }));

    res.setHeader('Content-Type', 'text/xml');
    res.write(generateSitemap(data, process.env.FRONTEND_URL));
    res.end();

    return {
        props: {}
    };
}

const SitemapIndex = () => null;
export default SitemapIndex;
