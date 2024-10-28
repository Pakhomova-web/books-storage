import { ageOptions } from '@/constants/options';
import { Box } from '@mui/material';
import React from 'react';
import { styleVariables } from '@/constants/styles-variables';
import { IOption } from '@/lib/data/types';

const ageOptStyles = (clickable = false, selected = false, showOnlySelected = false) => ({
    padding: '2px 6px',
    border: `2px solid ${!showOnlySelected ? 'var(--background)' : styleVariables.gray}`,
    color: 'var(--background)',
    borderRadius: styleVariables.borderRadius,
    cursor: clickable ? 'pointer' : null,
    ...(selected ? {
        backgroundColor: !showOnlySelected ? 'var(--background)' : styleVariables.gray,
        color: !showOnlySelected ? 'white' : 'black'
    } : {})
});

interface IAgesProps {
    selected: number[],
    showOnlySelected?: boolean,
    onOptionClick?: (value: number) => void
}

export default function Ages(props: IAgesProps) {

    function onOptionClick(opt: IOption<number>) {
        if (props.onOptionClick) {
            props.onOptionClick(opt.id);
        }
    }

    return (
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} my={2}>
            Вік:{ageOptions.map((opt, index) => {
            if (props.selected.includes(opt.id)) {
                return <Box key={index}
                            sx={ageOptStyles(!!props.onOptionClick, true, props.showOnlySelected)}
                            onClick={() => onOptionClick(opt)}>{opt.label}</Box>;
            } else if (!props.showOnlySelected) {
                return <Box key={index}
                            sx={ageOptStyles(!!props.onOptionClick)}
                            onClick={() => onOptionClick(opt)}>{opt.label}</Box>
            }
        })}
        </Box>
    );
}
