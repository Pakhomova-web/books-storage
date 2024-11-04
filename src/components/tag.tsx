import { styled } from '@mui/material/styles';
import { Grid, GridOwnProps } from '@mui/material';
import { borderRadius, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React from 'react';

const StyledTagGrid = styled(Grid)<GridOwnProps>(({ theme }) => ({
    padding: styleVariables.boxPadding,
    borderRadius,
    border: `1px solid ${primaryLightColor}`,
    display: 'flex',
    alignItems: 'center'
}));

interface ITagProps extends GridOwnProps {
    tag: string,
    onRemove?: (_: string) => void,
    onClick?: () => void
}

export default function Tag({ tag, onRemove, onClick, ...props }: ITagProps) {
    return (
        <StyledTagGrid item {...props} onClick={onClick} sx={onClick ? { cursor: 'pointer' } : {}}>
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
