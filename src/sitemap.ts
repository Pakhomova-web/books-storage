import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // const data = await apolloClient.query({
    //     query: booksQuery,
    //     fetchPolicy: 'no-cache'
    // });

    // const data = { books: { items: [] } };
// ,
// ...data.books.items.map((book: BookEntity) => ({
//         url: `${process.env.FRONTEND_URL}/books/${book.id}`,
//         lastModified: new Date(),
//         priority: 0.9,
//         images: book.imageIds ? [`https://drive.google.com/thumbnail?id=${book.imageIds[0]}&sz=w1000`] : []
//     }))
    return [
        {
            url: 'https://books-storage.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1
        },
        {
            url: 'https://books-storage.vercel.app/books',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: 'https://books-storage.vercel.app/about-us',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: 'https://books-storage.vercel.app/publishing-houses',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: 'https://books-storage.vercel.app/sign-in',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5
        },
        {
            url: 'https://books-storage.vercel.app/basket',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: 'https://books-storage.vercel.app/profile/personal-info',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: 'https://books-storage.vercel.app/profile/likes',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: 'https://books-storage.vercel.app/profile/orders',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        }
    ];
}
