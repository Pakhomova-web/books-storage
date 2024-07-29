const hintFontSize = '14px';
const rowMargin = '5px';
const gray = 'rgba(224, 224, 224, 1)';

export const styleVariables = {
    titleFontSize: '20px',
    hintFontSize,
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
    filtersPanelHeight: 48,
    toolbarHeight: 64,
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
        'z-index': 2
    },
    overflowHidden: { overflow: 'hidden' },
    flexNoWrap: {
        display: 'flex',
        flexWrap: 'nowrap'
    },
    positionRelative: {
        position: 'relative'
    }
};


export const positionRelative = { position: 'relative' };
export const pageStyles = { overflowY: 'auto', height: 'calc(100vh - 64px)' };

export const titleStyles = {
    fontSize: styleVariables.titleFontSize,
    fontWeight: 'bold',
    marginBottom: styleVariables.doubleMargin
};

export const drawerWidth = 240;
