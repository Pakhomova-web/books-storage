import { Box, Button } from '@mui/material';
import { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';

import CustomModal from '@/components/modals/custom-modal';

export function FiltersButton({ onApply, onClear, children, formContext }) {
    const [openFiltersModal, setOpenFiltersModal] = useState<boolean>(false);
    const [actions] = useState([
        { title: 'Очистити', onClick: () => onClearClick() },
        { title: 'Знайти', onClick: () => onApplyClick() }
    ]);

    function onClearClick() {
        setOpenFiltersModal(false);
        onClear();
    }

    function onApplyClick() {
        setOpenFiltersModal(false);
        onApply();
    }

    function openFilters() {
        setOpenFiltersModal(true);
    }

    return (
        <>
            <Button fullWidth onClick={openFilters}>
                <Box my={1} display="flex" gap={1} alignItems="center"><TuneIcon/>Фільтри</Box>
            </Button>

            <CustomModal open={openFiltersModal}
                         formContext={formContext}
                         hideSubmit={!!formContext}
                         onSubmit={onApplyClick}
                         onClose={() => setOpenFiltersModal(false)}
                         actions={actions}>
                {children}
            </CustomModal>
        </>
    );
}