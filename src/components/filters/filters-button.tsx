import { Button } from '@mui/material';
import { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';

import CustomModal from '@/components/modals/custom-modal';

export function FiltersButton({ onApply, onClear, children }) {
    const [openFiltersModal, setOpenFiltersModal] = useState<boolean>(false);
    const [actions] = useState([
        { title: 'Очистити', onClick: () => onClearClick() },
        { title: 'Примінити', onClick: () => onApplyClick() }
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
            <Button fullWidth onClick={openFilters}><TuneIcon/> Filters</Button>

            <CustomModal open={openFiltersModal}
                         onClose={() => setOpenFiltersModal(false)}
                         actions={actions}>
                {children}
            </CustomModal>
        </>
    );
}