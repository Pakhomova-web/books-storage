const hintFontSize = '14px';
const rowMargin = '5px';
const gray = 'rgba(224, 224, 224, 1)';

export const styleVariables = {
    titleFontSize: {
        fontSize: '20px'
    },
    hintFontSize: {
        fontSize: hintFontSize
    },
    boxShadow: 24,
    borderRadius: '4px',
    margin: '10px',
    rowMargin,
    padding: '10px',
    doubleMargin: '20px',
    doublePadding: '20px',
    warnColor: '#AB332C',
    redLightColor: 'rgba(171, 51, 44, 0.2)',
    greenLightColor: 'rgba(0, 128, 0, 0.2)',
    primaryColor: 'rgba(68, 138, 255, 0.2)',
    gray,
    flexEnd: { display: 'flex', justifyContent: 'end' },
    alignItemsCenter: { alignItems: 'center' },
    mobileSmallFontSize: {
        fontSize: hintFontSize
    },
    mobileBigFontSize: {
        fontSize: '16px'
    },
    mobileRow: {
        paddingBottom: rowMargin,
        marginBottom: rowMargin,
        borderBottom: `1px solid ${gray}`
    },
    boldFont: {
        fontWeight: 'bold'
    },
    textCenter: { textAlign: 'center' },
    cursorPointer: { cursor: 'pointer' },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        py: 2,
        background: 'white',
        zIndex: 2,
        width: '100%'
    },
    border: { border: '1px solid' },
    overflowHidden: { overflow: 'hidden' },
    flexNoWrap: {
        display: 'flex',
        flexWrap: 'nowrap'
    },
    positionRelative: {
        position: 'relative'
    },
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between'
    }
};


export const positionRelative = { position: 'relative' };
export const fullHeight = { height: '100svh' };
export const pageStyles = { overflowY: 'auto', height: 'calc(100svh - 64px)' };

export const titleStyles = {
    ...styleVariables.titleFontSize,
    fontWeight: 'bold',
    marginBottom: styleVariables.doubleMargin
};

export const drawerWidth = 240;
