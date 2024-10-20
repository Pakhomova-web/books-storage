import { TableKey } from '@/components/table/table-key';
import { Grid, useTheme } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styleVariables } from '@/constants/styles-variables';
import { IPageable } from '@/lib/data/types';
import { FiltersButton } from '@/components/filters/filters-button';
import SortButton from '@/components/filters/sort-button';
import { ISortKey } from '@/components/types';

const filtersPanelContainer = {
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 3,
    background: 'white',
    paddingBottom: styleVariables.padding
};

interface ISortFiltersContainerProps<T> {
    onClear: () => void;
    onApply: () => void;
    pageSettings: IPageable;
    tableKeys?: TableKey<T>[];
    children?: ReactNode;
    onSort?: (_: IPageable) => void;
    showAlwaysSorting?: boolean;
}

export default function SortFiltersContainer<T>(props: ISortFiltersContainerProps<T>) {
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
    const [sortKeys] = useState<ISortKey[]>(props.tableKeys ? props.tableKeys.filter(({ sortValue }) => !!sortValue)
        .map(({ title, sortValue }) => ({ title, orderBy: sortValue })) : []);

    function renderFiltersButton(children: ReactNode) {
        return <FiltersButton onApply={props.onApply} onClear={props.onClear}>{children}</FiltersButton>;
    }

    return <>
        <Grid container spacing={1} sx={filtersPanelContainer}>
            {(mobileMatches || props.showAlwaysSorting) && sortKeys?.length ?
                <>
                    <Grid item xs={6}>{renderFiltersButton(props.children)}</Grid>
                    <Grid item xs={6}>
                        <SortButton onSort={props.onSort}
                                    pageSettings={props.pageSettings}
                                    sortKeys={sortKeys}></SortButton>
                    </Grid>
                </>
                : renderFiltersButton(props.children)}
        </Grid>
    </>;
}
