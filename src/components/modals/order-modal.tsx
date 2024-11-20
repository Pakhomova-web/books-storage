import { OrderEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateOrder, useUpdateOrder } from '@/lib/graphql/queries/order/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { useDeliveryOptions } from '@/lib/graphql/queries/delivery/hook';
import CustomSelectField from '@/components/form-fields/custom-select-field';
import CustomCheckbox from '@/components/form-fields/custom-checkbox';

interface IOrderModalProps {
    open: boolean,
    item?: OrderEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

interface IForm {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    comment: string,
    isPartlyPaid: boolean,
    isPaid: boolean,
    isSent: boolean,
    deliveryId: string,
    region: string,
    district: string,
    city: string,
    postcode: number,
    novaPostOffice: number,
    trackingNumber: string,
    isDone: boolean
}

export default function OrderModal({ open, item, onClose, isAdmin }: IOrderModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            firstName: item?.firstName,
            lastName: item?.lastName,
            phoneNumber: item?.phoneNumber,
            comment: item?.comment,
            trackingNumber: item?.trackingNumber,
            deliveryId: item?.delivery?.id,
            region: item?.region,
            district: item?.district,
            city: item?.city,
            postcode: item?.postcode,
            novaPostOffice: item?.novaPostOffice,
            isSent: item?.isSent,
            isDone: item?.isDone,
            isPaid: item?.isPaid,
            isPartlyPaid: item?.isPartlyPaid,
        }
    });
    const { update, updating, updatingError } = useUpdateOrder();
    const { create, creating, creatingError } = useCreateOrder();
    const { items: deliveryOptions, loading: loadingDeliveryOptions } = useDeliveryOptions();
    const { checkAuth } = useAuth();
    const { deliveryId } = formContext.watch();

    async function onSubmit() {
        const values = formContext.getValues();
        const data = {
            trackingNumber: values.trackingNumber,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            comment: values.comment,
            region: values.region,
            city: values.city,
            district: values.district,
            postcode: values.postcode,
            novaPostOffice: values.novaPostOffice,
            isSent: values.isSent,
            isPaid: values.isPaid,
            isPartlyPaid: values.isPartlyPaid,
            isDone: values.isDone,
            deliveryId: values.deliveryId
        } as OrderEntity;

        try {
            if (item) {
                await update({ id: item.id, ...data });
            } else {
                await create(data);
            }

            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' замовлення'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 autoFocus
                                 id="customer-first-name"
                                 label="Ім'я замовника"
                                 name="customerFirstName"/>

                <CustomTextField fullWidth
                                 required
                                 id="customer-last-name"
                                 label="Прізвище замовника"
                                 name="customerLastName"/>

                <CustomTextField fullWidth
                                 required
                                 id="customer-phone-number"
                                 label="Телефон замовника"
                                 name="customerPhoneNumber"/>

                <CustomTextField fullWidth
                                 id="description"
                                 label="Опис"
                                 name="description"/>

                <b>books</b> button add

                <div>
                    <div>book selection</div>
                    <div>count</div>
                    <div>discount</div>
                    <div>price</div>
                </div>

                <b>Сума замовлення:</b>

                <CustomCheckbox label="Повністю оплачене" name="isPaid"></CustomCheckbox>

                <CustomCheckbox label="Передплата" name="isPartlyPaid"></CustomCheckbox>

                <CustomSelectField fullWidth
                                   options={deliveryOptions}
                                   loading={loadingDeliveryOptions}
                                   showClear={!!deliveryId}
                                   onClear={() => formContext.setValue('deliveryId', null)}
                                   id="delivery-id"
                                   label="Спосіб доставки"
                                   name="deliveryId"/>

                <CustomTextField fullWidth
                                 required={!!deliveryId}
                                 id="region"
                                 label="Область"
                                 name="region"/>

                <CustomTextField fullWidth
                                 id="district"
                                 label="Район"
                                 name="district"/>

                <CustomTextField fullWidth
                                 required={!!deliveryId}
                                 id="city"
                                 label="Місто"
                                 name="city"/>

                <CustomTextField fullWidth
                                 required={!!deliveryId}
                                 id="postcode"
                                 label="Індекс/№ відділення/поштомата"
                                 name="postcode"/>

                <CustomTextField fullWidth
                                 id="trackingNumber"
                                 label="ТТН"
                                 name="trackingNumber"/>

                <CustomCheckbox label="Відправлене" name="isSent"></CustomCheckbox>

                <CustomCheckbox label="Виконане" name="isDone"></CustomCheckbox>

            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}