import CustomModal from '@/components/modals/custom-modal';
import { OrderEntity } from '@/lib/data/types';
import { renderOrderNumber } from '@/utils/utils';

interface IProps {
    order: OrderEntity;
    onClose: () => void;
}

export default function UserOrderModal({ order, onClose }: IProps) {
    return (
        <CustomModal open={!!order} title={'Замовлення № ' + renderOrderNumber(order?.orderNumber)} onClose={onClose}>
        </CustomModal>
    );
}