import { Box, Grid } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { styleVariables } from '@/constants/styles-variables';
import { TableKey } from '@/components/table/table-key';
import { renderActions } from '@/components/table/table-cell-render';

const mobileBoxStyles = {
    borderRadius: styleVariables.borderRadius,
    border: `1px solid ${styleVariables.primaryColor}`,
    padding: styleVariables.padding,
    margin: styleVariables.margin
};

interface IMobileTableProps<T> {
    data: T[],
    keys: TableKey<T>[],
    actions?: TableKey<T>,
    withFilters?: boolean,
    onRowClick?: (item: T) => void,
    renderMobileView?: (item: T) => ReactNode,
    children?: ReactNode
}

export function MobileTable<T>(props: IMobileTableProps<T>) {
    const [anchorMenuEl, setAnchorMenuEl] = useState<null | HTMLElement>(null);

    function renderItem(item: T) {
        return <>
            {props.actions &&
              <Grid container sx={styleVariables.alignItemsCenter}>
                <Grid item xs={9}>{props.actions.renderMobileLabel && props.actions.renderMobileLabel(item)}</Grid>
                <Grid item xs={3} sx={styleVariables.flexEnd}>
                    {renderActions(props.actions.actions, item, anchorMenuEl, (val: HTMLElement) => setAnchorMenuEl(val))}
                </Grid>
              </Grid>}
            {props.keys.map((key, i) => (
                <Grid container key={i}
                      sx={{ ...(i !== props.keys.length - 1 ? styleVariables.mobileRow : {}), ...styleVariables.mobileSmallFontSize }}>
                    <Grid item xs={6} sx={key.mobileStyleClasses || {}}>{key.title}</Grid>
                    <Grid item xs={6} sx={{
                        ...styleVariables.flexEnd,
                        ...(key.mobileStyleClasses || {})
                    }}>{key.renderValue(item)}</Grid>
                </Grid>
            ))}
        </>;
    }

    function onRowClick(item: T) {
        if (!!anchorMenuEl) {
            setAnchorMenuEl(null);
        } else {
            props.onRowClick(item);
        }
    }

    return (
        <Box>
            <Grid container>
                {props.data.map((item, index) =>
                    <Grid item key={index} sm={6} xs={12}>
                        <Box sx={mobileBoxStyles} onClick={() => props.onRowClick ? onRowClick(item) : {}}>
                            {props.renderMobileView ? props.renderMobileView(item) : renderItem(item)}
                        </Box>
                    </Grid>
                )}
            </Grid>
            {props.children}
        </Box>
    );
}
