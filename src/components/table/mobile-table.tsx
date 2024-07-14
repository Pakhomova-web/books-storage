import { Box, Grid } from '@mui/material';
import React from 'react';
import { styleVariables } from '@/constants/styles-variables';
import { TableKey } from '@/components/table/table-key';
import { tableContainerStyles } from '@/components/table/table-styles';

const mobileBox = {
    borderRadius: styleVariables.borderRadius,
    border: `1px solid ${styleVariables.primaryColor}`,
    padding: styleVariables.padding,
    margin: styleVariables.margin
};

interface IMobileTableProps<T> {
    data: T[],
    keys: TableKey<T>[],
    withFilters?: boolean
}

export function MobileTable<T>(props: IMobileTableProps<T>) {
    return (
        <Box sx={tableContainerStyles(props.withFilters)}>
            <Grid container>
                {props.data.map((item, index) =>
                    <Grid item key={index} sm={6} xs={12}>
                        <Box sx={mobileBox}>
                            {props.keys.map((key, i) =>
                                <Grid container key={i}>
                                    <Grid item xs={6}>{key.title}</Grid>
                                    <Grid item xs={6}>{key.renderValue ? key.renderValue(item) : ''}</Grid>
                                </Grid>
                            )}
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12}>Pagination</Grid>
            </Grid>
        </Box>
    );
}
