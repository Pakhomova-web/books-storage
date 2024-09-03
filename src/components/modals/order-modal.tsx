import { OrderEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateOrder, useUpdateOrder } from '@/lib/graphql/queries/order/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';

interface IOrderModalProps {
    open: boolean,
    item?: OrderEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function OrderModal({ open, item, onClose, isAdmin }: IOrderModalProps) {
    const formContext = useForm<OrderEntity>({
        defaultValues: {
            customerFirstName: item?.customerFirstName,
            customerLastName: item?.customerLastName,
            customerPhoneNumber: item?.customerPhoneNumber,
            description: item?.description
        }
    });
    const { update, updating, updatingError } = useUpdateOrder();
    const { create, creating, creatingError } = useCreateOrder();
    const { checkAuth } = useAuth();

    async function onSubmit() {
        try {
            if (item) {
                await update({ id: item.id, ...formContext.getValues() } as OrderEntity);
            } else {
                await create({ ...formContext.getValues() } as OrderEntity);
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
                                 label="First Name"
                                 name="customerFirstName"/>

                <CustomTextField fullWidth
                                 required
                                 autoFocus
                                 id="customer-last-name"
                                 label="Last Name"
                                 name="customerLastName"/>

                <CustomTextField fullWidth
                                 required
                                 autoFocus
                                 id="customer-phone-number"
                                 label="Phone Number"
                                 name="customerPhoneNumber"/>

                <CustomTextField fullWidth
                                 id="description"
                                 label="Description"
                                 name="description"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}