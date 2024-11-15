import React, { useEffect, useState } from 'react';
import SettingsMenu from '@/pages/settings/settings-menu';
import Loading from '@/components/loading';
import { downloadCsv, isAdmin, renderPrice } from '@/utils/utils';
import { Box, Button } from '@mui/material';
import { redLightColor, styleVariables } from '@/constants/styles-variables';
import { BookFilters } from '@/components/filters/book-filters';
import { BookEntity, BookFilter, IPageable } from '@/lib/data/types';
import CustomTable from '@/components/table/custom-table';
import ErrorNotification from '@/components/error-notification';
import AddIcon from '@mui/icons-material/Add';
import BookModal from '@/components/modals/book-modal';
import { BookNumberInStockModal } from '@/components/modals/book-number-in-stock-modal';
import { useAuth } from '@/components/auth-context';
import { getAllBooks, useBooks, useUpdateBook } from '@/lib/graphql/queries/book/hook';
import { TableActionEnum, TableKey } from '@/components/table/table-key';
import CustomImage from '@/components/custom-image';
import HdrStrongIcon from '@mui/icons-material/HdrStrong';
import HdrWeakIcon from '@mui/icons-material/HdrWeak';
import { ApolloError } from '@apollo/client';

const subTitleStyles = {
    ...styleVariables.hintFontSize,
    display: 'flex'
};

export default function Books() {
    const { user } = useAuth();
    const { update, updating, updatingError } = useUpdateBook();
    const tableActions: TableKey<BookEntity> = {
        renderMobileLabel: (item: BookEntity) => (
            <>
                <Box sx={subTitleStyles} mx={1}>
                    <Box height={75} width={100} mr={1}>
                        <CustomImage imageId={item.imageIds[0]} isBookDetails={true}></CustomImage></Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box>{item.bookType.name}</Box>
                        <Box>{item.bookSeries.publishingHouse.name}</Box>
                        <Box>{item.bookSeries.name}</Box>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1} sx={styleVariables.hintFontSize}>
                    {item.numberInStock ?
                        <>
                            <HdrStrongIcon fontSize="small" style={{ color: "green" }}/>
                            В наявності ({item.numberInStock})
                        </> :
                        <><HdrWeakIcon fontSize="small" style={{ color: styleVariables.warnColor }}/>Немає в наявності</>
                    }
                </Box>
            </>
        ),
        type: 'actions',
        actions: isAdmin(user) ? [
            {
                label: () => 'Додати кількість в наявності',
                type: TableActionEnum.add,
                onClick: (item: BookEntity) => {
                    setError(null);
                    setSelectedItem(item);
                    setOpenNumberInStockModal(true);
                }
            },
            {
                label: () => 'Скопіювати',
                type: TableActionEnum.copy,
                onClick: (item: BookEntity) => {
                    const data = new BookEntity({ ...item, name: null, id: null, imageIds: [] });

                    onAdd(data);
                }
            },
            {
                label: (item: BookEntity) => item.archived ? 'Разархівувати' : 'Заархівувати',
                type: TableActionEnum.delete,
                onClick: (item: BookEntity) => {
                    update({ ...item.dataToUpdate, archived: !item.archived }).then(() => refreshData()).catch();
                }
            }
        ] : []
    };
    const [mobileKeys] = useState<TableKey<BookEntity>[]>([
        {
            title: 'Назва',
            sortValue: 'name',
            renderValue: (item: BookEntity) => item.name,
            type: 'text',
            mobileStyleClasses: { ...styleVariables.boldFont, ...styleVariables.mobileBigFontSize }
        },
        {
            title: 'Активна',
            sortValue: 'archived',
            renderValue: (item: BookEntity) => item.archived ? 'Так' : 'Ні',
            type: 'text'
        },
        {
            title: 'Кількість сторінок',
            sortValue: 'numberOfPages',
            renderValue: (item: BookEntity) => item.numberOfPages,
            type: 'text'
        },
        {
            title: 'Мова',
            sortValue: 'language',
            renderValue: (item: BookEntity) => item.language?.name,
            type: 'text'
        },
        {
            title: 'Тип сторінок',
            sortValue: 'pageType',
            renderValue: (item: BookEntity) => item.pageType?.name,
            type: 'text'
        },
        {
            title: 'Тип обкладинки',
            sortValue: 'coverType',
            renderValue: (item: BookEntity) => item.coverType?.name,
            type: 'text'
        },
        {
            title: 'Автори',
            renderValue: (item: BookEntity) => item.authors?.map(author => author.name).join(', '),
            type: 'text'
        },
        {
            title: 'Ціна',
            sortValue: 'price',
            renderValue: (item: BookEntity) => renderPrice(item.price),
            type: 'text'
        },
        { title: 'Знижка', renderValue: (item: BookEntity) => item.discount, type: 'text' }
    ]);
    const [tableKeys] = useState<TableKey<BookEntity>[]>([
        { title: 'Тип', sortValue: 'bookType', renderValue: (item: BookEntity) => item.bookType?.name, type: 'text' },
        {
            title: 'Видавництво',
            sortValue: 'publishingHouse',
            renderValue: (item: BookEntity) => item.bookSeries?.publishingHouse?.name,
            type: 'text'
        },
        {
            title: 'Серія',
            sortValue: 'bookSeries',
            renderValue: (item: BookEntity) => item.bookSeries?.name,
            type: 'text'
        },
        ...mobileKeys,
        {
            title: 'В наявності',
            sortValue: 'numberInStock',
            renderValue: (item: BookEntity) => item.numberInStock,
            type: 'text'
        }
    ]);
    const [selectedItem, setSelectedItem] = useState<BookEntity>();
    const [pageSettings, setPageSettings] = useState<IPageable>({
        order: 'asc', orderBy: '', page: 0, rowsPerPage: 5
    });
    const [filters, setFilters] = useState<BookFilter>({ archived: null });
    const { items, totalCount, gettingError, loading, refetch } = useBooks(pageSettings, filters);
    const [openNewModal, setOpenNewModal] = useState<boolean>(false);
    const [openNumberInStockModal, setOpenNumberInStockModal] = useState<boolean>(false);
    const [error, setError] = useState<ApolloError>();
    const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);

    useEffect(() => {
        if (gettingError) {
            setError(gettingError);
        } else if (updatingError) {
            setError(updatingError);
        }
    }, [gettingError, updatingError]);

    function highlightInRed(numberInStock: number) {
        return !numberInStock ? {
            background: redLightColor
        } : {};
    }

    function refreshData(updated = true) {
        if (updated) {
            refetch();
        }
        setError(null);
        setOpenNumberInStockModal(false);
        setOpenNewModal(false);
        setSelectedItem(undefined);
    }

    function onAdd(parentItem?: BookEntity) {
        setError(null);
        setSelectedItem(parentItem);
        setOpenNewModal(true);
    }

    function onEdit(item: BookEntity) {
        setError(null);
        setSelectedItem(item);
        setOpenNewModal(true);
    }

    async function onDownloadCSV() {
        setDownloadingCsv(true);
        getAllBooks({ ...pageSettings, page: 0, rowsPerPage: totalCount }, filters)
            .then(books => {
                downloadCsv<BookEntity>(books, tableKeys, new Date().toISOString());
                setDownloadingCsv(false);
            })
            .catch(err => {
                setError(err);
                setDownloadingCsv(false);
            });
    }

    function onChangeFilters(filters: BookFilter) {
        setPageSettings({
            ...pageSettings,
            page: 0
        });
        setFilters(filters);
        refreshData();
    }

    function onChangePageSettings(pageSettings: IPageable) {
        setPageSettings(pageSettings);
        refreshData();
    }

    return (
        <SettingsMenu activeUrl="books">
            <Loading show={loading || downloadingCsv || updating}></Loading>

            {isAdmin(user) &&
              <>
                <BookFilters tableKeys={tableKeys}
                             onApply={(filters: BookFilter) => onChangeFilters(filters)}
                             pageSettings={pageSettings}
                             onSort={(pageSettings: IPageable) => onChangePageSettings(pageSettings)}></BookFilters>

                <CustomTable data={items}
                             keys={tableKeys}
                             mobileKeys={mobileKeys}
                             actions={tableActions}
                             renderKey={(item: BookEntity) => item.id}
                             onChange={(settings: IPageable) => onChangePageSettings(settings)}
                             pageSettings={pageSettings}
                             usePagination={true}
                             withFilters={true}
                             rowStyleClass={(item: BookEntity) => highlightInRed(item.numberInStock)}
                             totalCount={totalCount}
                             onRowClick={(item: BookEntity) => onEdit(item)}>
                    {error && <ErrorNotification error={error}></ErrorNotification>}

                    {isAdmin(user) &&
                      <Box sx={styleVariables.buttonsContainer} gap={2}>
                        <Button variant="outlined" onClick={() => onAdd()}>
                          <AddIcon></AddIcon>Додати книгу
                        </Button>

                          {!!items?.length &&
                            <Button variant="outlined" onClick={() => onDownloadCSV()}>
                              Скачати CSV
                            </Button>
                          }
                      </Box>
                    }
                </CustomTable>

                  {openNewModal &&
                    <BookModal open={openNewModal}
                               item={selectedItem}
                               isAdmin={isAdmin(user)}
                               onClose={(updated = false) => refreshData(updated)}></BookModal>}

                  {openNumberInStockModal && selectedItem &&
                    <BookNumberInStockModal open={openNumberInStockModal}
                                            item={selectedItem}
                                            onClose={(updated = false) => refreshData(updated)}></BookNumberInStockModal>}
              </>
            }
        </SettingsMenu>
    );
}