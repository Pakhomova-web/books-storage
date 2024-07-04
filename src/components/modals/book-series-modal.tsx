import { BookSeriesEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import {
    useCreateBookSeries,
    usePublishingHouseOptions,
    usePublishingHouses,
    useUpdateBookSeries
} from '@/lib/graphql/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/modals/custom-text-field';
import CustomSelectField from '@/components/modals/custom-select-field';

interface IBookSeriesModalProps {
    open: boolean,
    item?: BookSeriesEntity,
    isSubmitDisabled?: boolean,
    onClose: (updated?: boolean) => void
}

export default function BookSeriesModal({ open, item, onClose }: IBookSeriesModalProps) {
    const formContext = useForm<{ name: string, publishingHouseId: string }>({
        defaultValues: {
            name: item?.name,
            publishingHouseId: item?.publishingHouseId
        }
    });
    const { update, loading: loadingUpdating } = useUpdateBookSeries();
    const { create, loading: loadingCreating } = useCreateBookSeries();
    const { items: publishingHouseOptions } = usePublishingHouseOptions();

    async function onSubmit() {
        if (item) {
            await update({ id: item.id, ...formContext.getValues() } as BookSeriesEntity);
        } else {
            await create({ ...formContext.getValues() } as BookSeriesEntity);
        }

        onClose(true);
    }

    return (
        <CustomModal title={!item ? 'Додати тип книги' : 'Редагувати тип книги'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={loadingUpdating || loadingCreating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={onSubmit}>
            <FormContainer onSuccess={() => onSubmit()} formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 id="book-series-name"
                                 label="Назва"
                                 name="name"/>

                <CustomSelectField fullWidth
                                   required
                                   options={publishingHouseOptions}
                                   id="publishing-house-id"
                                   label="Видавництво"
                                   name="publishingHouseId"/>
            </FormContainer>
        </CustomModal>
    );
}
