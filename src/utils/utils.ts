import { TableKey } from '@/components/table/table-key';

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
