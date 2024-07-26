import { styleVariables } from '@/constants/styles-variables';

export const authStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '400px',
        maxWidth: '95vw',
        padding: styleVariables.doublePadding,
        margin: `${styleVariables.margin} auto`,
        borderRadius: styleVariables.borderRadius,
        border: `1px solid ${styleVariables.gray}`
    },
    boxStyles: {
        ...styleVariables.textCenter,
        marginBottom: styleVariables.margin
    },
    title: {
        ...styleVariables.textCenter,
        marginBottom: styleVariables.margin,
        fontSize: styleVariables.titleFontSize,
        fontWeight: 'bold',
    },
    buttonMargin: {
        margin: `${styleVariables.margin} 0`
    }
};
