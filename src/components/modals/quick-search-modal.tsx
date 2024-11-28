import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import CustomModal from '@/components/modals/custom-modal';
import { FormContainer, useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import Loading from '@/components/loading';
import React, { useEffect, useState } from 'react';
import { getBookNamesByQuickSearch } from '@/lib/graphql/queries/book/hook';
import { IOption } from '@/lib/data/types';
import { useRouter } from 'next/router';


const StyledHintBox = styled(Box)(({ theme }) => ({
    cursor: 'pointer',
    opacity: 0.9,
    ':hover': {
        color: theme.palette.primary.main
    }
}));

export default function QuickSearchModal({ open, onClose }) {
    const router = useRouter();
    const formContext = useForm<{ quickSearch: string }>();
    const { quickSearch } = formContext.watch();
    const [bookHints, setBookHints] = useState<IOption<string>[]>([]);
    const [loadingHints, setLoadingHints] = useState<boolean>(false);

    useEffect(() => {
        if (!!quickSearch) {
            if (quickSearch.length > 3) {
                setLoadingHints(true);
                getBookNamesByQuickSearch(quickSearch)
                    .then(hints => {
                        setLoadingHints(false);
                        setBookHints(hints);
                    });
            }
        } else {
            setBookHints([]);
        }
    }, [quickSearch]);

    function onQuickSearchClick(value: string) {
        router.push(`/books?quickSearch=${value}`);
        onClose();
    }

    function onHintClick(hint: IOption<string>) {
        router.push(`/books/details?id=${hint.id}`);
        onClose();
    }

    return (
        <CustomModal open={open} title="Швидкий пошук">
            <FormContainer formContext={formContext}
                           handleSubmit={() => onQuickSearchClick(quickSearch)}>
                <CustomTextField name="quickSearch" placeholder="Пошук" autoFocus={true} fullWidth
                                 required={true}/>

                <Box position="relative" p={1} mt={1}>
                    <Loading show={loadingHints} isSmall={true}/>

                    {bookHints?.map((hint, i) => (
                        <StyledHintBox key={i} mb={1}
                                       onClick={() => onHintClick(hint)}>
                            {hint.label}
                        </StyledHintBox>
                    ))}
                </Box>

                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mt={2}
                     justifyContent="center">
                    <Button variant="outlined" onClick={onClose}>
                        Закрити
                    </Button>

                    <Button variant="contained" type="submit"
                            disabled={!quickSearch}>Знайти</Button>
                </Box>
            </FormContainer>
        </CustomModal>
    );
}
