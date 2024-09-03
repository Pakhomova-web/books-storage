import { IOption, OrderEntity } from '@/lib/data/types';
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
    customerFirstName: string,
    customerLastName: string,
    customerPhoneNumber: string,
    description: string,
    isPartlyPaid: boolean,
    isPaid: boolean,
    isSent: boolean,
    deliveryId: string,
    region: string,
    district: string,
    city: string,
    postcode: string,
    trackingNumber: string,
    isDone: boolean
}

export default function OrderModal({ open, item, onClose, isAdmin }: IOrderModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            customerFirstName: item?.customerFirstName,
            customerLastName: item?.customerLastName,
            customerPhoneNumber: item?.customerPhoneNumber,
            description: item?.description,
            trackingNumber: item?.trackingNumber,
            deliveryId: item?.deliveryId,
            region: item?.address?.region,
            district: item?.address?.district,
            city: item?.address?.city,
            postcode: item?.address?.postcode,
            isSent: item?.isSent,
            isDone: item?.isDone,
            isPaid: item?.isPaid,
            isPartlyPaid: item?.isPartlyPaid,
        }
    });
    const { update, updating, updatingError } = useUpdateOrder();
    const { create, creating, creatingError } = useCreateOrder();
    const { items: deliveryOptions, loading: loadingDeliveryOptions } = useDeliveryOptions<IOption>();
    const { checkAuth } = useAuth();
    const { deliveryId } = formContext.watch();

    async function onSubmit() {
        const values = formContext.getValues();
        const address = !!values.deliveryId ? {
            region: values.region,
            city: values.city,
            district: values.district,
            postcode: values.postcode,
        } : null;
        const data = {
            trackingNumber: values.trackingNumber,
            customerFirstName: values.customerFirstName,
            customerLastName: values.customerLastName,
            customerPhoneNumber: values.customerPhoneNumber,
            description: values.description,
            isSent: values.isSent,
            isPaid: values.isPaid,
            isPartlyPaid: values.isPartlyPaid,
            isDone: values.isDone,
            deliveryId: values.deliveryId,
            address
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
        <CustomModal title={(!item ? 'Add' : (!isAdmin ? 'View' : 'Edit')) + ' Order'}
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
                                 label="Customer First Name"
                                 name="customerFirstName"/>

                <CustomTextField fullWidth
                                 required
                                 id="customer-last-name"
                                 label="Customer Last Name"
                                 name="customerLastName"/>

                <CustomTextField fullWidth
                                 required
                                 id="customer-phone-number"
                                 label="Customer Phone Number"
                                 name="customerPhoneNumber"/>

                <CustomTextField fullWidth
                                 id="description"
                                 label="Description"
                                 name="description"/>

                <b>books</b> button add

                <div>book selection</div>
                <div>count</div>
                <div>discount</div>
                <div>price</div>

                <b>Full sum:</b>

                <CustomCheckbox label="Fully Paid" name="isPaid"></CustomCheckbox>

                <CustomCheckbox label="Partly Paid" name="isPartlyPaid"></CustomCheckbox>

                <CustomSelectField fullWidth
                                   options={deliveryOptions}
                                   loading={loadingDeliveryOptions}
                                   showClear={!!deliveryId}
                                   onClear={() => formContext.setValue('deliveryId', null)}
                                   id="delivery-id"
                                   label="Delivery Company"
                                   name="deliveryId"/>

                <CustomTextField fullWidth
                                 required={!!deliveryId}
                                 id="region"
                                 label="Region"
                                 name="region"/>

                <CustomTextField fullWidth
                                 id="district"
                                 label="District"
                                 name="district"/>

                <CustomTextField fullWidth
                                 required={!!deliveryId}
                                 id="city"
                                 label="City"
                                 name="city"/>

                <CustomTextField fullWidth
                                 required={!!deliveryId}
                                 id="postcode"
                                 label="Postcode/Number of Office"
                                 name="postcode"/>

                <CustomTextField fullWidth
                                 id="trackingNumber"
                                 label="Tracking Number"
                                 name="trackingNumber"/>

                <CustomCheckbox label="Sent" name="isSent"></CustomCheckbox>

                <CustomCheckbox label="Done" name="isDone"></CustomCheckbox>

            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}