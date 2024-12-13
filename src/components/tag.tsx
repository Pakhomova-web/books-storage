import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { borderRadius, boxPadding, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React from 'react';

const StyledTagGrid = styled(Grid)(({ theme }) => ({
    padding: boxPadding,
    borderRadius,
    border: `1px solid ${primaryLightColor}`,
    display: 'flex',
    alignItems: 'center'
}));

export default function Tag({ tag, onRemove = null, onClick = null, ...props }) {
    return (
        <StyledTagGrid item {...props} onClick={onClick} sx={onClick ? { cursor: 'pointer' } : {}} gap={1}>
            #{tag}
            {!!onRemove &&
              <RemoveCircleOutlineIcon fontSize="small"
                                       sx={{ cursor: 'pointer', color: styleVariables.warnColor }}
                                       onClick={(e) => {
                                           e.stopPropagation();
                                           onRemove(tag);
                                       }}/>
            }
        </StyledTagGrid>
    );
}
