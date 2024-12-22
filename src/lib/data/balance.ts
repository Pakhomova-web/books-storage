import Balance from '@/lib/data/models/balance';
import { GraphQLError } from 'graphql/error';

export async function updateBalance(expense: number): Promise<any> {
    if (!expense || expense <= 0) {
        throw new GraphQLError(`Витрата не може бути менше 0.`, {
            extensions: { code: 'BAD_DATA' }
        });
    }
    const balance = await Balance.findOne();

    balance.value = balance.value - expense;

    await balance.save();
    return balance.value;
}

export async function getBalance() {
    const balance = await Balance.findOne();

    return Number(balance?.value.toFixed(2)) || 0;
}
