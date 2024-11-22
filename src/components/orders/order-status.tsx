import { Box } from '@mui/material';
import { IOrderStatus } from '@/lib/data/types';
import { borderRadius, primaryColor, primaryLightColor } from '@/constants/styles-variables';

interface IProps {
    status: IOrderStatus;
}

const colors = [
    { // canceled
        backgroundColor: '#F8F9FA',
        color: '#2D323E',
        borderColor: '#E7E7E7'
    },
    { // confirmed
        backgroundColor: '#fffde8',
        color: '#59481D',
        borderColor: '#F6E2A7'
    },
    { // waiting for self picking up or for payment
        backgroundColor: '#fdffe9',
        color: '#4a591d',
        borderColor: '#dcf6a7'
    },
    { // in delivery
        backgroundColor: '#f4ffe9',
        color: '#35591d',
        borderColor: '#c7f6a7'
    },
    { // done
        backgroundColor: 'white',
        color: primaryColor,
        borderColor: primaryLightColor
    }
];

const statusBoxStyles = (index?: number) => ({
    borderRadius,
    border: `1px solid ${colors[index].borderColor}`,
    backgroundColor: colors[index].backgroundColor,
    color: colors[index].color,
    textAlign: 'center'
});

export default function OrderStatus({ status }: IProps) {
    return (
        <Box display="flex" my={1}>
            <Box sx={statusBoxStyles(status.index)} p={1}>{status.value}</Box>
        </Box>
    );
}
