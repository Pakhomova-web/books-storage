import { Box, Button } from '@mui/material';
import { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';

import CustomModal from '@/components/modals/custom-modal';
import Badge from '@mui/material/Badge';

export function FiltersButton({ onApply, onClear, children, formContext, totalCount }) {
    const [openFiltersModal, setOpenFiltersModal] = useState<boolean>(false);
    const [actions] = useState([
        { title: 'Очистити', onClick: () => onClearClick() }
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
                <Badge badgeContent={totalCount ? totalCount : null}>
                    <Box my={1} display="flex" gap={1} alignItems="center" width="100%" px={2}>
                        <TuneIcon/>Фільтри
                    </Box>
                </Badge>
            </Button>

            {openFiltersModal &&
              <CustomModal open={true}
                           title="Фільтри"
                           formContext={formContext}
                           onSubmit={onApplyClick}
                           onClose={() => setOpenFiltersModal(false)}
                           submitText="Знайти"
                           actions={actions}>
                  {children}
              </CustomModal>}
        </>
    );
}