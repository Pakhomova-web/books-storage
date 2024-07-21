import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { useDeleteLanguage, useLanguages } from '@/lib/graphql/hooks';
import { IPageable, LanguageEntity } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import Loading from '@/components/loading';
import LanguageModal from '@/components/modals/language-modal';
import ErrorNotification from '@/components/error-notification';
import { NameFiltersPanel } from '@/components/filters/name-filters-panel';
import { styleVariables } from '@/constants/styles-variables';

export default function Languages() {
    const [tableActions] = useState<TableKey<LanguageEntity>>({
        renderMobileLabel: (item: LanguageEntity) => <Box><b>{item.name}</b></Box>,
        type: 'actions',
        actions: [
            {
                type: TableActionEnum.delete,
                onClick: (item: LanguageEntity) => deleteHandler(item)
            }
        ]
    });
    const [tableKeys] = useState<TableKey<LanguageEntity>[]>([
        {
            title: 'Name',
            sortValue: 'name',
            renderValue: (item: LanguageEntity) => item.name,
            type: 'text',
            mobileStyleClasses: styleVariables.boldFont
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<LanguageEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({ order: 'asc', orderBy: '' });
    const [filters, setFilters] = useState<LanguageEntity>();
    const { items, gettingError, loading, refetch } = useLanguages(pageSettings, filters);
    const { deleteItem, deleting, deletingError } = useDeleteLanguage();
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        } else if (deletingError) {
            setError(deletingError);
        }
    }, [gettingError, deletingError]);

    useEffect(() => {
        refreshData();
    }, [filters, pageSettings]);

    async function deleteHandler(item: LanguageEntity) {
        try {
            await deleteItem(item.id);
            refreshData(true);
        } catch (err) {
        }
    }

    function refreshData(updated = true) {
        if (updated) {
            refetch();
        }
        setError(null);
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    function onAdd() {
        setError(null);
        setOpenNewModal(true);
    }

    function onEdit(item: LanguageEntity) {
        setError(null);
        setSelectedItem(item);
    }

    return (
        <Loading open={loading || deleting} fullHeight={true}>
            <NameFiltersPanel onApply={(filters: LanguageEntity) => setFilters(filters)}></NameFiltersPanel>

            <CustomTable data={items}
                         keys={tableKeys}
                         mobileKeys={[]}
                         actions={tableActions}
                         renderKey={(item: LanguageEntity) => item.id}
                         onChange={(pageSettings: IPageable) => setPageSettings(pageSettings)}
                         pageSettings={pageSettings}
                         withFilters={true}
                         onRowClick={item => onEdit(item)}></CustomTable>

            {error && <ErrorNotification error={error}></ErrorNotification>}

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, background: 'white', 'z-index': 2 }}>
                <Button variant="outlined" onClick={() => onAdd()}>
                    <AddIcon></AddIcon>Add language
                </Button>
            </Box>

            {(openNewModal || selectedItem) &&
              <LanguageModal open={true}
                             item={selectedItem}
                             onClose={(updated = false) => refreshData(updated)}></LanguageModal>}
        </Loading>
    );
}