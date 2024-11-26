import { Box, Button } from '@mui/material';
import { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';

import CustomModal from '@/components/modals/custom-modal';

export function FiltersButton({ onApply, onClear, children }) {
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
                <Box my={1} display="flex" alignItems="center"><TuneIcon/>Фільтри</Box>
            </Button>

            <CustomModal open={openFiltersModal}
                         onClose={() => setOpenFiltersModal(false)}
                         actions={actions}>
                {children}
            </CustomModal>
        </>
    );
}