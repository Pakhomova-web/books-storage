import { Box, Grid } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { borderRadius, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { TableKey } from '@/components/table/table-key';
import { renderActions } from '@/components/table/table-cell-render';
import CustomImage from '@/components/custom-image';

const mobileBoxStyles = {
    borderRadius,
    border: `1px solid ${primaryLightColor}`
};

interface IMobileTableProps<T> {
    data: T[],
    keys: TableKey<T>[],
    actions?: TableKey<T>,
    onRowClick?: (item: T) => void,
    renderMobileView?: (item: T) => ReactNode,
    children?: ReactNode
}

export interface IMenuAnchorEl {
    el: HTMLElement,
    rowIndex: number
}

export function MobileTable<T>(props: IMobileTableProps<T>) {
    const [anchorMenuEl, setAnchorMenuEl] = useState<IMenuAnchorEl>(null);

    function renderItem(item: T, index: number) {
        return <>
            {props.actions &&
              <Grid container>
                <Grid item xs={9}>{props.actions.renderMobileLabel && props.actions.renderMobileLabel(item)}</Grid>
                <Grid item xs={3} sx={styleVariables.flexEnd}>
                    {renderActions(index, props.actions.actions, item, anchorMenuEl, (val: IMenuAnchorEl) => setAnchorMenuEl(val))}
                </Grid>
              </Grid>}
            {props.keys.map((key, i) => (
                <Grid container key={i} mb={1}
                      sx={{ ...(i !== props.keys.length - 1 ? styleVariables.borderBottom : {}), ...styleVariables.hintFontSize }}>
                    <Grid item xs={6} display="flex" alignItems="center" sx={key.mobileStyleClasses}>{key.title}</Grid>
                    <Grid item xs={6} display="flex" justifyContent="end" alignItems="center"
                          sx={key.mobileStyleClasses}>
                        {key.type === 'text' && key.renderValue(item)}
                        {key.type === 'image' && <Box sx={{ width: '80px', height: '80px' }}>
                          <CustomImage imageId={key.renderValue(item) as string}></CustomImage>
                        </Box>}
                    </Grid>
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
            <Grid container spacing={1}>
                {props.data.map((item, index) =>
                    <Grid item key={index} sm={6} xs={12}>
                        <Box sx={mobileBoxStyles} p={1} height="100%"
                             onClick={() => props.onRowClick ? onRowClick(item) : {}}>
                            {props.renderMobileView ? props.renderMobileView(item) : renderItem(item, index)}
                        </Box>
                    </Grid>
                )}
            </Grid>
            {props.children}
        </Box>
    );
}
