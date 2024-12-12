import { Grid } from '@mui/material';
import React from 'react';

import { styleVariables } from '@/constants/styles-variables';
import { useGroupDiscounts } from '@/lib/graphql/queries/group-discounts/hook';
import GroupDiscountBox from '@/components/group-discount-box';
import { useAuth } from '@/components/auth-context';

export default function GroupDiscountBooks({ bookId, onBookClick = null }) {
    const { loading, items } = useGroupDiscounts(null, { books: [bookId] });
    const { setGroupDiscountInBasket, user } = useAuth();

    function onBuyClick(id: string) {
        setGroupDiscountInBasket(id);
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
                                        isInBasket={user?.basketGroupDiscounts?.some(group => group.groupDiscountId === item.id)}
                                        onBuyClick={() => onBuyClick(item.id)}/>)}
              </Grid>
            </>}
        </Grid>
    );
}
