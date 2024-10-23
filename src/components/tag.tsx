import { styled } from '@mui/material/styles';
import { Grid, GridOwnProps, GridProps } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React from 'react';

const StyledTagGrid = styled(Grid)<GridOwnProps>(({ theme }) => ({
    padding: '4px 8px',
    borderRadius: styleVariables.borderRadius,
    backgroundColor: styleVariables.gray,
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
