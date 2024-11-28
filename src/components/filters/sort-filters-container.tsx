import { Grid, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IPageable } from '@/lib/data/types';
import { FiltersButton } from '@/components/filters/filters-button';
import SortButton from '@/components/filters/sort-button';
import { ISortKey } from '@/components/types';

interface ISortFiltersContainerProps<T> {
    onClear: () => void;
    onApply: () => void;
    pageSettings: IPageable;
    formContext?: any;
    sortKeys: ISortKey[];
    children?: ReactNode;
    onSort?: (_: IPageable) => void;
    showAlwaysSorting?: boolean;
}

export default function SortFiltersContainer<T>(props: ISortFiltersContainerProps<T>) {
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    function renderFiltersButton(children: ReactNode) {
        return <FiltersButton onApply={props.onApply} onClear={props.onClear} formContext={props.formContext}>
            {children}
        </FiltersButton>;
    }

    return <>
        <Grid container display="flex" alignItems="center">
            {(mobileMatches || props.showAlwaysSorting) && props.sortKeys?.length ?
                <>
                    <Grid item xs={4}>{renderFiltersButton(props.children)}</Grid>
                    <Grid item xs={8}>
                        <SortButton onSort={props.onSort}
                                    pageSettings={props.pageSettings}
                                    sortKeys={props.sortKeys}></SortButton>
                    </Grid>
                </>
                : renderFiltersButton(props.children)}
        </Grid>
    </>;
}
