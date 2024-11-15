import { BookSeriesEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateBookSeries, useUpdateBookSeries } from '@/lib/graphql/queries/book-series/hook';
import { usePublishingHouseOptions } from '@/lib/graphql/queries/publishing-house/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box } from '@mui/material';

interface IBookSeriesModalProps {
    open: boolean,
    item?: BookSeriesEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function BookSeriesModal({ open, item, onClose, isAdmin }: IBookSeriesModalProps) {
    const formContext = useForm<BookSeriesEntity>({
        defaultValues: {
            id: item?.id,
            name: item?.name,
            publishingHouseId: item?.publishingHouse.id,
            default: item?.default
        }
    });
    const { update, updating, updatingError } = useUpdateBookSeries();
    const { create, creating, creatingError } = useCreateBookSeries();
    const { items: publishingHouseOptions, loading: loadingPublishingHouses } = usePublishingHouseOptions();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        try {
            if (item) {
                await update(formContext.getValues() as BookSeriesEntity);
            } else {
                await create(formContext.getValues() as BookSeriesEntity);
            }

            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    return (
        <CustomModal
            title={(!item ? 'Додати' : (!isAdmin || item?.default ? 'Подивитися' : 'Відредагувати')) + ' серію'}
            open={open}
            disableBackdropClick={true}
            onClose={() => onClose()}
            loading={updating || creating}
            isSubmitDisabled={!formContext.formState.isValid}
            onSubmit={isAdmin && !item?.default ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <Box display="flex" gap={1} flexDirection="column">
                    <CustomTextField fullWidth
                                     required
                                     autoFocus
                                     disabled={item?.default}
                                     id="book-series-name"
                                     label="Name"
                                     name="name"/>

                    <CustomSelectField fullWidth
                                       required
                                       options={publishingHouseOptions}
                                       loading={loadingPublishingHouses}
                                       disabled={item?.default}
                                       id="publishing-house-id"
                                       label="Видавництво"
                                       name="publishingHouseId"/>
                </Box>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}
