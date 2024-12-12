import { Grid } from '@mui/material';
import React from 'react';

import { styleVariables } from '@/constants/styles-variables';
import { useGroupDiscounts } from '@/lib/graphql/queries/group-discounts/hook';
import GroupDiscountBox from '@/components/group-discount-box';

export default function GroupDiscountBooks({ bookId, onBookClick = null }) {
    const { loading, items } = useGroupDiscounts(null, { books: [bookId] });

    function onBuyClick(id: string) {
    }

    return (
        <Grid container position="relative" display="flex" justifyContent="center" alignItems="center">
            {!loading && !!items.length && <>
              <Grid item xs={12} sx={styleVariables.sectionTitle}>
                Заощаджуйте, замовляючи разом
              </Grid>

              <Grid container display="flex" justifyContent="center">
                  {items.map((item, index) =>
                      <GroupDiscountBox key={index} books={item.books} discount={item.discount}
                                        onBookClick={onBookClick}
                                        onBuyClick={() => onBuyClick(item.id)}/>)}
              </Grid>
            </>}
        </Grid>
    );
}
