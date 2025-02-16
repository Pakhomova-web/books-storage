import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import BooksFiltered from '@/components/books/books-filtered';
import { getCatalogueParams, ICatalogueItem } from '@/constants/options';

export default function CatalogueBooks() {
    const router = useRouter();
    const [item, setItem] = useState<ICatalogueItem>(router.query.id ? getCatalogueParams(router.query.id as string) : null);

    useEffect(() => {
        setItem(router.query.id ? getCatalogueParams(router.query.id as string) : null);
    }, [router.query.id]);
    return <BooksFiltered defaultFilters={item?.params} title={item?.title}/>;
}