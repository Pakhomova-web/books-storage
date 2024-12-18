import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';

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
        <CustomModal open={open} title="Швидкий пошук">
            <BookSearchAutocompleteField onSelect={(opt: IOption<string>) => onHintClick(opt)}
                                         onInputChange={setInputValue}/>

            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mt={2}
                 justifyContent="center">
                <Button variant="outlined" onClick={onClose}>
                    Закрити
                </Button>

                <Button variant="contained" type="submit"
                        disabled={!inputValue} onClick={onQuickSearchClick}>Знайти</Button>
            </Box>
        </CustomModal>
    );
}
