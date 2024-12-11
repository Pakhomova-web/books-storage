import { TableKey } from '@/components/table/table-key';
import { OrderBookEntity, UserEntity } from '@/lib/data/types';
import { ROLES } from '@/constants/roles';
import { emailValidatorExp, passwordValidatorExp } from '@/constants/validators-exp';

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

export function passwordValidation(form, control, controlName: string, confirmControl?, confirmControlName?: string) {
    if (form.formState.touchedFields[controlName] || form.formState.touchedFields[confirmControlName]) {
        if (control && !passwordValidatorExp.test(control)) {
            form.setError(controlName, { message: 'Мін 8 симовлів: A-Z, a-z, 0-9' });
        } else if (!control && form.formState.touchedFields[controlName]) {
            form.setError(controlName, { message: 'Пароль обов\'язковий' });
        } else if (confirmControl && confirmControlName) {
            if (!confirmControl && form.formState.touchedFields[confirmControlName]) {
                form.setError(confirmControlName, { message: 'Пароль обов\'язковий' });
            } else if (control !== confirmControl && form.formState.touchedFields[confirmControlName] && form.formState.touchedFields[controlName]) {
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

export function emailValidation(form, control, controlName: string) {
    if (form.formState.touchedFields[controlName]) {
        if (!control) {
            form.setError(controlName, { message: 'Ел. адреса обов\'язкова' });
        } else if (!emailValidatorExp.test(control)) {
            form.setError(controlName, { message: 'Ел. адреса невірна' });
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

export function isNovaPostSelected(deliveryId: string) {
    return deliveryId === '66d5c90e3415a4551a000600';
}

export function isUkrPoshtaSelected(deliveryId: string) {
    return deliveryId === '66d5c9173415a4551a000606';
}

export function isSelfPickup(deliveryId: string) {
    return deliveryId === '67406cec5f3c198cb08c3ffb';
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
