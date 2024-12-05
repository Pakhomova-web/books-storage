import { BookSeriesEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateBookSeries, useUpdateBookSeries } from '@/lib/graphql/queries/book-series/hook';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box, Grid } from '@mui/material';
import React from 'react';
import { ApolloError } from '@apollo/client';

interface IBookSeriesModalProps {
    open: boolean,
    item?: BookSeriesEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (item?: BookSeriesEntity) => void
}

export default function BookSeriesModal({ open, item, onClose, isAdmin }: IBookSeriesModalProps) {
    const formContext = useForm<BookSeriesEntity>({
        defaultValues: {
            id: item?.id,
            name: item?.name,
            publishingHouseId: item?.publishingHouse.id,
            default: item?.default,
            description: item?.description
        }
    });
    const { description } = formContext.watch();
    const { update, updating, updatingError } = useUpdateBookSeries();
    const { create, creating, creatingError } = useCreateBookSeries();
    const { items: publishingHouseOptions, loading: loadingPublishingHouses } = usePublishingHouseOptions();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        if (!!item?.id) {
            update(formContext.getValues() as BookSeriesEntity)
                .then((val: BookSeriesEntity) => onClose(val))
                .catch((err: ApolloError) => checkAuth(err));
        } else {
            create(formContext.getValues() as BookSeriesEntity)
                .then((val: BookSeriesEntity) => onClose(val))
                .catch((err: ApolloError) => checkAuth(err));
        }
    }

    return (
        <CustomModal
            title={(!item ? 'Додати' : (!isAdmin || item?.default ? 'Подивитися' : 'Відредагувати')) + ' серію'}
            open={open}
            disableBackdropClick={true}
            onClose={() => onClose()}
            loading={updating || creating}
            big={true}
            isSubmitDisabled={!formContext.formState.isValid}
            onSubmit={isAdmin && !item?.default ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <Grid container display="flex" gap={1}>
                    <Grid item xs={12} sm={6} md={3}>
                        <CustomTextField fullWidth
                                         required
                                         autoFocus={true}
                                         disabled={item?.default}
                                         id="book-series-name"
                                         label="Назва"
                                         name="name"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomSelectField fullWidth
                                           required
                                           options={publishingHouseOptions}
                                           loading={loadingPublishingHouses}
                                           disabled={item?.default}
                                           id="publishing-house-id"
                                           label="Видавництво"
                                           name="publishingHouseId"/>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextField fullWidth
                                         disabled={item?.default}
                                         id="book-series-desc"
                                         multiline={true}
                                         label="Опис"
                                         name="description"/>
                    </Grid>

                    {description && <Grid item xs={12}>
                      <Box mb={1}><b>Попередній огляд опису:</b></Box>
                      <Box dangerouslySetInnerHTML={{ __html: description }}></Box>
                    </Grid>}
                </Grid>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}
