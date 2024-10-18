import { styled } from '@mui/material/styles';
import { Grid, GridOwnProps, GridProps } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React from 'react';

const StyledTagGrid = styled(Grid)<GridOwnProps>(({ theme }) => ({
    padding: '3px 6px',
    borderRadius: styleVariables.borderRadius,
    backgroundColor: styleVariables.gray,
    display: 'flex',
    alignItems: 'center'
}));

interface ITagProps extends GridOwnProps {
    tag: string,
    onRemove?: (_: string) => void
}

export default function Tag({ tag, onRemove, ...props }: ITagProps) {
    return (
        <StyledTagGrid item {...props}>
            #{tag}
            {!!onRemove &&
              <RemoveCircleOutlineIcon fontSize="small"
                                       sx={{ cursor: 'pointer', color: styleVariables.warnColor }}
                                       onClick={() => onRemove(tag)}/>
            }
        </StyledTagGrid>
    );
}
