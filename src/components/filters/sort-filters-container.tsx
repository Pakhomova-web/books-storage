import { TableKey } from '@/components/table/table-key';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Button, Grid, SortDirection, useTheme } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import useMediaQuery from '@mui/material/useMediaQuery';

import CustomModal from '@/components/modals/custom-modal';

interface ISortFiltersContainerProps<T> {
    tableKeys?: TableKey<T>[];
    children?: ReactNode;
    onSort?: (_: ISortKey) => void;
}

const sortBoxStyles = {
    display: 'flex'
};

interface ISortKey {
    title: string;
    valueName: string;
    direction?: SortDirection
}

export default function SortFiltersContainer<T>({ tableKeys, onSort, children }: ISortFiltersContainerProps<T>) {
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const [sortKeys] = useState<ISortKey[]>(tableKeys?.filter(({ sortValue }) => !!sortValue)
        .map(({ title, sortValue }) => ({ title, valueName: sortValue })));
    const [activeSortKey, setActiveSortKey] = useState<ISortKey>();
    const [openSortModal, setOpenSortModal] = useState(false);

    function onSortClick() {
        setOpenSortModal(true);
    }

    function onSortByField(key: ISortKey) {
        setOpenSortModal(false);
        setActiveSortKey({
            ...key,
            direction: (activeSortKey.valueName === key.valueName ? activeSortKey : key).direction === 'desc' ? 'asc' : 'desc'
        });
        onSort(activeSortKey);
    }

    return <>
        <Grid container spacing={1}>
            {mobileMatches && sortKeys?.length ?
                <>
                    <Grid item xs={6}>{children}</Grid>
                    <Grid item xs={6} sx={sortBoxStyles}>
                        <Button fullWidth onClick={onSortClick}><SortIcon/> Sort</Button>
                    </Grid>
                </>
                : children}
        </Grid>
        <CustomModal open={openSortModal} onClose={() => setOpenSortModal(false)}>
            <Grid container>{sortKeys?.map(key => (
                <Grid item key={key.valueName} xs={6}>
                    <Button onClick={() => onSortByField(key)}>
                        <Box marginRight={1}>{key.title}</Box>
                        {activeSortKey?.valueName === key.valueName &&
                            (activeSortKey.direction === 'desc' ?
                                <ArrowDownwardIcon></ArrowDownwardIcon> :
                                <ArrowUpwardIcon></ArrowUpwardIcon>)
                        }
                    </Button>
                </Grid>
            ))}</Grid>
        </CustomModal>
    </>;
}
