const gray = 'rgb(244, 244, 244)';
export const warnColor = '#d00';
export const primaryColor = '#448AFF';
export const primaryLightColor = 'rgba(68, 138, 255, 0.2)';
export const redLightColor = 'rgba(171, 51, 44, 0.2)';
export const greenLightColor = 'rgba(0, 128, 0)';
export const borderRadius = '4px';
export const titleFontSize = '20px';
export const hintFontSize = '14px';
export const boxPadding = `5px 10px`;

const discountBox = {
    backgroundColor: warnColor,
    color: 'white',
    textAlign: 'center',
    padding: boxPadding,
    borderRadius: `0 0 ${borderRadius} 0`
};

export const styleVariables = {
    fixedDiscountBox: (theSecondMark = false) => ({
        position: 'absolute',
        top: theSecondMark ? '35px' : 0,
        left: 0,
        ...discountBox
    }),
    fixedInStockBox: (inStock = true) => ({
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: inStock ? greenLightColor : warnColor,
        borderRadius: `0 0 ${borderRadius} 0`,
        color: 'white',
        padding: boxPadding,
        display: 'flex',
        alignItems: 'center'
    }),
    orderNumberStyles: (theme) => ({
        color: theme.palette.primary.main,
        fontWeight: 'bold'
    }),
    discountBoxStyles: discountBox,
    titleFontSize: {
        fontSize: titleFontSize
    },
    deleteIconBtn: { cursor: 'pointer', color: warnColor },
    bigTitleFontSize: (theme) => ({
        fontSize: '28px',
        [theme.breakpoints.down('md')]: {
            fontSize: '20px'
        }
    }),
    hintFontSize: {
        fontSize: hintFontSize
    },
    boxShadow: 24,
    warnColor,
    gray,
    flexEnd: { display: 'flex', justifyContent: 'end' },
    alignItemsCenter: { alignItems: 'center' },
    mobileBigFontSize: {
        fontSize: '16px'
    },
    borderBottom: {
        borderBottom: `1px solid ${primaryLightColor}`
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
        zIndex: 3,
        width: '100%'
    },
    border: { border: '1px solid' },
    overflowHidden: { overflow: 'hidden' },
    flexNoWrap: {
        display: 'flex',
        flexWrap: 'nowrap'
    },
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        justifyContent: 'center',
        backgroundColor: primaryLightColor,
        borderRadius,
        flexWrap: 'wrap',
        fontSize: titleFontSize,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        p: 1,
        gap: 2
    }
};

export const customFieldClearBtnStyles = {
    position: 'absolute',
    top: 0,
    right: '4px',
    cursor: 'pointer',
    ...styleVariables.hintFontSize,
    textDecoration: 'underline',
    color: 'rgba(0, 0, 0, 0.6)'
};
export const fullHeight = { height: '100svh' };
export const pageStyles = { overflowY: 'auto', height: 'calc(100svh - 64px)' };

export const priceStyles = (theme) => ({
    color: theme.palette.primary.main,
    fontSize: styleVariables.bigTitleFontSize(theme),
    borderRadius,
    padding: boxPadding,
    border: `1px solid ${primaryLightColor}`
});