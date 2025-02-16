import React from 'react';
import { useRouter } from 'next/router';

import BooksFiltered from '@/components/books/books-filtered';

export default function Books() {
    const router = useRouter();

    return <BooksFiltered defaultFilters={router.query}/>;
}