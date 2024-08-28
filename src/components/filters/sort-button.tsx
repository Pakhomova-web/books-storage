import { Box, Button, Grid } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CustomModal from '@/components/modals/custom-modal';
import React, { useState } from 'react';
import SortIcon from '@mui/icons-material/Sort';
import { ISortKey } from '@/components/types';
import { IPageable } from '@/lib/data/types';

interface ISortButtonProps {
    pageSettings: IPageable;
    onSort: (_: IPageable) => void;
    sortKeys: ISortKey[];
}

export default function SortButton(props: ISortButtonProps) {
    const [openSortModal, setOpenSortModal] = useState(false);

    function onSortClick() {
        setOpenSortModal(true);
    }

    function onSortByField(key: ISortKey) {
        setOpenSortModal(false);
        const order = (props.pageSettings?.orderBy === key.orderBy ? props.pageSettings : key).order === 'desc' ? 'asc' : 'desc';

        props.onSort({
            ...props.pageSettings,
            page: 0,
            order,
            orderBy: key.orderBy
        });
    }

    return (
        <>
            <Button fullWidth onClick={onSortClick}><SortIcon/> Sort</Button>

            <CustomModal open={openSortModal} onClose={() => setOpenSortModal(false)}>
                <Grid container>{props.sortKeys?.map(key => (
                    <Grid item key={key.orderBy} xs={6}>
                        <Button onClick={() => onSortByField(key)}>
                            <Box marginRight={1}>{key.title}</Box>
                            {props.pageSettings?.orderBy === key.orderBy &&
                                (props.pageSettings.order === 'desc' ?
                                    <ArrowDownwardIcon></ArrowDownwardIcon> :
                                    <ArrowUpwardIcon></ArrowUpwardIcon>)
                            }
                        </Button>
                    </Grid>
                ))}</Grid>
            </CustomModal>
        </>
    );
}
