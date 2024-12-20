import { Box, Button, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import CustomModal from '@/components/modals/custom-modal';
import { IOption } from '@/lib/data/types';
import BookSearchAutocompleteField from '@/components/form-fields/book-search-autocomplete-field';

export default function QuickSearchModal({ open, onClose }) {
    const router = useRouter();
    const [inputValue, setInputValue] = useState<string>('');

    function onQuickSearchClick() {
        router.push(`/books?quickSearch=${inputValue}`);
        onClose();
    }

    function onHintClick(hint: IOption<string>) {
        router.push(`/books/details?id=${hint.id}`);
        onClose();
    }

    return (
        <CustomModal open={open} title="Швидкий пошук" onClose={onClose}>
            <Box display="flex" flexWrap="nowrap" gap={1}>
                <Box width="100%">
                    <BookSearchAutocompleteField onSelect={(opt: IOption<string>) => onHintClick(opt)}
                                                 onInputChange={setInputValue}/>
                </Box>

                <Box display="flex" alignItems="start" mt={1}>
                    <IconButton disabled={!inputValue} onClick={onQuickSearchClick}
                                color="primary"><SearchIcon/></IconButton>
                </Box>
            </Box>
        </CustomModal>
    );
}
