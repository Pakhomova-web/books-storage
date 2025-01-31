import { TableKey } from '@/components/table/table-key';
import { OrderBookEntity, UserEntity } from '@/lib/data/types';
import { ROLES } from '@/constants/roles';
import { emailValidatorExp, passwordValidatorExp } from '@/constants/validators-exp';
import { matchIsValidTel } from 'mui-tel-input';
import { DELIVERIES } from '@/constants/options';

export function downloadCsv<K>(items: K[], tableKeys: TableKey<K>[], filename = 'data') {
    const blob = new Blob(
        ['\ufeff' + convertToCSV<K>(items, tableKeys.filter(key => key.type === 'text'))],
        { type: 'text/csv;charset=utf-8;' }
    );
    const link = document.createElement('a');

    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', filename + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function convertToCSV<K>(data: K[], tableKeys: TableKey<K>[], delimiter = ',') {
    return `${tableKeys.map(key => key.title).join(delimiter)}\r\n${data.map(item => tableKeys
        .map(key => `"${key.renderValue(item) || ''}"`)
        .join(delimiter)).join('\r\n')}`;
}

const TOKEN_STORAGE = 'user_token';
const REFRESH_TOKEN_STORAGE = 'user_refresh_token';

export function saveTokenToLocalStorage(token: string, refreshToken: string) {
    saveToLocalStorage(TOKEN_STORAGE, token);
    saveToLocalStorage(REFRESH_TOKEN_STORAGE, refreshToken);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem(TOKEN_STORAGE);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE);
}

export function getAccessToken(): string {
    return getFromLocalStorage(TOKEN_STORAGE);
}

export function getRefreshToken(): string {
    return getFromLocalStorage(REFRESH_TOKEN_STORAGE);
}

export function saveToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, encrypt(value));
}

export function getFromLocalStorage(key: string) {
    const value = localStorage.getItem(key);

    return value ? decrypt(value) : null;
}

function encrypt(val: string): string {
    if (val === null || val === '') {
        return null;
    }
    return btoa(val);
}

function decrypt(val: string): string {
    if (val === null || val === '') {
        return null;
    }
    return atob(val);
}

export function isAdmin(user?: UserEntity): boolean {
    return user?.role === ROLES.admin;
}

export function renderPrice(price: number, discount = 0, displayCurrency = true): string {
    let res = (price * (100 - discount) / 100).toFixed(2);

    if (res.split('.').length === 1) {
        res = `${res}.00`;
    }
    while (res.split('.')[1].length !== 2) {
        res = `${res}0`;
    }

    return displayCurrency ? `${res} грн` : res;
}

export function renderOrderNumber(orderNumber: number): string {
    let res = `${orderNumber}`;

    while (res.length < 5) {
        res = `0${res}`;
    }

    return res;
}

export function parseImageFromLink(imageLink: string) {
    if (imageLink) {
        // link example: https://drive.google.com/file/d/EXAMPLE_ID/view?usp=drive_link
        try {
            return imageLink.split('https://drive.google.com/file/d/')[1].split('/')[0];
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

export function passwordValidation(form, value, controlName: string, confirmValue?, confirmControlName?: string) {
    if (form.formState.touchedFields[controlName] || form.formState.touchedFields[confirmControlName]) {
        if (value && !passwordValidatorExp.test(value)) {
            form.setError(controlName, { message: 'Мін 8 симовлів: A-Z, a-z, 0-9' });
        } else if (!value && form.formState.touchedFields[controlName]) {
            form.setError(controlName, { message: 'Пароль обов\'язковий' });
        } else if (confirmValue && confirmControlName) {
            if (!confirmValue && form.formState.touchedFields[confirmControlName]) {
                form.setError(confirmControlName, { message: 'Пароль обов\'язковий' });
            } else if (value !== confirmValue && form.formState.touchedFields[confirmControlName] && form.formState.touchedFields[controlName]) {
                form.setError(controlName, { message: 'Паролі повинні співпадати' });
                form.setError(confirmControlName, { message: 'Паролі повинні співпадати' });
            } else {
                form.clearErrors(controlName);
                form.clearErrors(confirmControlName);
            }
        } else {
            form.clearErrors(controlName);
        }
    }
}

export function emailValidation(form, value, controlName: string) {
    if (form.formState.touchedFields[controlName]) {
        if (!value) {
            form.setError(controlName, { message: 'Ел. адреса обов\'язкова' });
        } else if (!emailValidatorExp.test(value)) {
            form.setError(controlName, { message: 'Ел. адреса невірна' });
        } else {
            form.clearErrors(controlName);
        }
    } else {
        form.clearErrors(controlName);
    }
}

export function validateNumberControl(form, value, controlName: string, min: number, max?: number, required = true, isInteger = false) {
    if ((value === null || value === undefined || value === '') && form.formState.touchedFields[controlName]) {
        if (required) {
            form.setError(controlName, { message: 'Обов\'язкове поле' });
        } else {
            form.clearErrors(controlName);
        }
    } else if (value !== null && value !== undefined && value !== '') {
        if (value < min || (max !== undefined && value > max)) {
            form.setError(controlName, { message: `Від ${min}${max ? ` до ${max}` : ''}` });
        } else if (isInteger && Math.round(value) !== value) {
            form.setError(controlName, { message: 'Повинне бути ціле число' });
        } else {
            form.clearErrors(controlName);
        }
    } else {
        form.clearErrors(controlName);
    }
}

export function getParamsQueryString(params: any): string {
    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key].length === 0) {
            delete params[key];
        }
    });

    if (!!Object.keys(params).length) {
        return new URLSearchParams(params).toString();
    } else {
        return '';
    }
}

export function validatePhoneNumber(form, value: string, required = false) {
    if (!value && required) {
        form.setError('phoneNumber', { message: 'Поле обов\'язкове!' });
    } else if (!value) {
        form.clearErrors('phoneNumber');
    } else if (!matchIsValidTel(value)) {
        form.setError('phoneNumber', { message: 'Номер телефону невірний!' });
    } else {
        form.clearErrors('phoneNumber');
    }
    form.setValue('phoneNumber', value);
}

export function isNovaPostSelected(deliveryId: string) {
    return deliveryId === DELIVERIES.NOVA_POSHTA;
}

export function isUkrPoshtaSelected(deliveryId: string) {
    return deliveryId === DELIVERIES.UKRPOSHTA;
}

export function isSelfPickup(deliveryId: string) {
    return deliveryId === DELIVERIES.SELF_PICKUP;
}

export function getLinkForTracking(deliveryId: string, trackingNumber: string) {
    if (isNovaPostSelected(deliveryId)) {
        navigator.clipboard.writeText(trackingNumber);
        return `https://tracking.novaposhta.ua/#/uk`;
    } else if (isUkrPoshtaSelected(deliveryId)) {
        return `https://track.ukrposhta.ua/tracking_UA.html?barcode=${trackingNumber}`;
    }
}

export function onCopyOrderClick(items: OrderBookEntity[], finalFullSum: number, finalSumWithDiscounts: number) {
    let value = items
        .map(({ book, count, price }, i) =>
            `${!book.bookSeries.default ?
                `${!i || book.bookSeries.id !== items[i - 1].book.bookSeries.id ? `${book.bookSeries.name} (${book.bookSeries.publishingHouse.name})\n\t` : '\t'}` : ''
            }${book.name} (${count} шт по ${renderPrice(price)})`)
        .join('\n');

    value = `${value}\n\nСума замовлення: ${renderPrice(finalFullSum)}`;
    if (finalSumWithDiscounts) {
        value = `${value}\nЗнижка: ${renderPrice(finalFullSum - finalSumWithDiscounts)}`;
        value = `${value}\nКінцева сума замовлення зі знижкою: ${renderPrice(finalSumWithDiscounts)}`;
    }
    navigator.clipboard.writeText(value);
}

export function trimValues<T>(obj: T): T {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
        }
    });

    return obj;
}

export function removePunctuation(value: string): string {
    return value?.replace(/[.,\/#!?$%^&*;:{}=\-_`'"~()]/g, '');
}

export function dateDiffInDays(a: Date, b: Date): number {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
}
