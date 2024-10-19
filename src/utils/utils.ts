import { TableKey } from '@/components/table/table-key';
import { UserEntity } from '@/lib/data/types';
import { ROLES } from '@/constants/roles';

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

export function renderPrice(price: number): string {
    let res = `${price}`;

    if (res.split('.').length === 1) {
        res = `${res}.00`;
    }
    while (res.split('.')[1].length !== 2) {
        res = `${res}0`;
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
