import { Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

import CustomModal from '@/components/modals/custom-modal';
import { IOption } from '@/lib/data/types';
import BookSearchAutocompleteField from '@/components/form-fields/book-search-autocomplete-field';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import SeriesSearchAutocompleteField from '@/components/form-fields/series-search-autocomplete-field';
import AuthorsSearchAutocompleteField from '@/components/form-fields/authors-search-autocomplete-field';

const StyledClickableBox = styled(Box)(({ theme }) => ({
    cursor: 'pointer',
    border: `1px solid ${primaryLightColor}`,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius,
    '&.selected': {
        background: primaryLightColor
    }
}));

export default function QuickSearchModal({ open, onClose }) {
    const router = useRouter();
    const [indexOfFieldToSearch, setIndexOfFieldToSearch] = useState<number>(0);
    const [fieldsToSearch] = useState<string[]>([
        'Назва',
        'Серія',
        'Автор'
    ]);
    const [inputValues, setInputValues] = useState<string[]>([]);

    function onQuickSearchClick() {
        switch (indexOfFieldToSearch) {
            case 0:
                router.push(`/books?quickSearch=${inputValues[0]}`);
                break;
            case 1:
                router.push(`/book-series?quickSearch=${inputValues[1]}`);
                break;
            case 2:
                router.push(`/authors?quickSearch=${inputValues[2]}`);
        }
        onClose();
    }

    function onHintClick(hint: IOption<string>) {
        switch (indexOfFieldToSearch) {
            case 0:
                router.push(`/books/${hint.id}`);
                break;
            case 1:
                router.push(`/books?bookSeries=${hint.id}`);
                break;
            case 2:
                router.push(`/books?authors=${hint.id}`);
        }
        onClose();
    }

    function changeInputValue(val: string) {
        inputValues[indexOfFieldToSearch] = val;
        setInputValues([...inputValues])
    }

    return (
        <CustomModal open={open} title="Швидкий пошук" onClose={onClose}>
            <Box display="flex" flexWrap="nowrap" mb={2}>
                {fieldsToSearch.map((field, index) =>
                    <StyledClickableBox key={index} p={1} className={indexOfFieldToSearch === index ? 'selected' : ''}
                                        onClick={() => setIndexOfFieldToSearch(index)}>
                        {field}
                    </StyledClickableBox>
                )}
            </Box>

            <Box display="flex" flexWrap="nowrap" gap={1}>
                <Box width="100%">
                    {indexOfFieldToSearch === 0 ?
                        <BookSearchAutocompleteField onSelect={(opt: IOption<string>) => onHintClick(opt)}
                                                     onEnterClick={onQuickSearchClick}
                                                     autoFocus={true}
                                                     onInputChange={changeInputValue}/> :
                        (indexOfFieldToSearch === 1 ?
                            <SeriesSearchAutocompleteField onSelect={(opt: IOption<string>) => onHintClick(opt)}
                                                           onEnterClick={onQuickSearchClick}
                                                           onInputChange={changeInputValue}/> :
                            <AuthorsSearchAutocompleteField onSelect={(opt: IOption<string>) => onHintClick(opt)}
                                                            onEnterClick={onQuickSearchClick}
                                                            onInputChange={changeInputValue}/>)
                    }
                </Box>

                <Box display="flex" alignItems="start" mt={1}>
                    <IconButton disabled={!inputValues[indexOfFieldToSearch]} onClick={onQuickSearchClick}
                                color="primary"><SearchIcon/></IconButton>
                </Box>
            </Box>
        </CustomModal>
    );
}
