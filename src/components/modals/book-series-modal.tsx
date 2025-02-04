import { BookSeriesEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateBookSeries, useUpdateBookSeries } from '@/lib/graphql/queries/book-series/hook';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box, Button, Grid } from '@mui/material';
import React from 'react';
import { ApolloError } from '@apollo/client';
import { parseImageFromLink, trimValues } from '@/utils/utils';
import CustomImage from '@/components/custom-image';

interface IBookSeriesModalProps {
    open: boolean,
    item?: BookSeriesEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (item?: BookSeriesEntity) => void
}

interface IForm {
    id: string;
    name: string;
    publishingHouseId: string;
    default?: boolean;
    description?: string;
    imageId?: string;
    imageLink?: string;
}

const imageBoxStyles = { height: '150px', maxHeight: '50vw' };

export default function BookSeriesModal({ open, item, onClose, isAdmin }: IBookSeriesModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            id: item?.id,
            name: item?.name,
            publishingHouseId: item?.publishingHouse.id,
            default: item?.default,
            description: item?.description,
            imageId: item?.imageId
        }
    });
    const { description, imageLink } = formContext.watch();
    const { update, updating, updatingError } = useUpdateBookSeries();
    const { create, creating, creatingError } = useCreateBookSeries();
    const { items: publishingHouseOptions, loading: loadingPublishingHouses } = usePublishingHouseOptions();
    const { checkAuth } = useAuth();

    function parseImage(e?) {
        if (!e || e.key === 'Enter') {
            e?.preventDefault()
            e?.stopPropagation();

            if (!!imageLink) {
                formContext.setValue('imageId', parseImageFromLink(imageLink));
                formContext.setValue('imageLink', null);
            }
        }
    }

    function onSubmit() {
        parseImage();
        const data = new BookSeriesEntity(trimValues(formContext.getValues()));

        delete data.publishingHouse;
        const promise = !!item?.id ? update(data) : create(data);

        promise
            .then((val: BookSeriesEntity) => onClose(val))
            .catch((err: ApolloError) => checkAuth(err));
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
                <Grid container display="flex" spacing={2}>
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

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin}
                                         id="imageLink"
                                         onKeyDown={parseImage}
                                         label="Посилання на фото"
                                         name="imageLink"/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        {!!imageLink && <Box>
                          <Button fullWidth variant="outlined" onClick={() => parseImage()}>
                            Додати фото
                          </Button>
                        </Box>}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <CustomTextField fullWidth
                                         disabled={!isAdmin}
                                         id="imageId"
                                         label="ID фото"
                                         name="imageId"/>
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="start">
                        <Box sx={imageBoxStyles} my={1}>
                            <CustomImage isBookType={true} imageId={formContext.getValues('imageId')}></CustomImage>
                        </Box>
                    </Grid>
                </Grid>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}
