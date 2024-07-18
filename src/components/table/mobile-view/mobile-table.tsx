import { Box, Grid, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { ReactNode } from 'react';
import { styleVariables } from '@/constants/styles-variables';
import { TableKey } from '@/components/table/table-key';
import { tableContainerStyles } from '@/components/table/table-styles';
import { getActionItem } from '@/components/table/table-cell-render';

const mobileBox = {
    borderRadius: styleVariables.borderRadius,
    border: `1px solid ${styleVariables.primaryColor}`,
    padding: styleVariables.padding,
    margin: styleVariables.margin
};

interface IMobileTableProps<T> {
    data: T[],
    keys: TableKey<T>[],
    withFilters?: boolean,
    onRowClick?: (item: T) => void,
    renderMobileView?: (item: T) => ReactNode,
    children?: ReactNode
}

export function MobileTable<T>(props: IMobileTableProps<T>) {
    return (
        <Box sx={tableContainerStyles(props.withFilters)}>
            <Grid container>
                {props.data.map((item, index) =>
                    <Grid item key={index} sm={6} xs={12}
                          onClick={() => props.onRowClick ? props.onRowClick(item) : {}}>
                        <Box sx={mobileBox}>
                            {props.renderMobileView ?
                                props.renderMobileView(item) :
                                props.keys.map((key, i) => {
                                    switch (key.type) {
                                        case 'actions':
                                            return <Box>{key.actions
                                                .map((action, index) => getActionItem(item, action, index))}</Box>
                                        case 'text':
                                            return (
                                                <Grid container key={i}>
                                                    <Grid item xs={6}>{key.title}</Grid>
                                                    <Grid item
                                                          xs={6}>{key.renderValue ? key.renderValue(item) : ''}</Grid>
                                                </Grid>
                                            );
                                    }
                                })
                            }
                        </Box>
                    </Grid>
                )}
            </Grid>
            {props.children}
        </Box>
    );
}
