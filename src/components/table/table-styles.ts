import { styleVariables } from '@/constants/styles-variables';

export function tableContainerStyles(withFilters = false, withChildren = false) {
    const additionalElementsHeight = (withChildren ? 69 : 0);

    return {
        // paddingTop: `${withFilters ? styleVariables.filtersPanelHeight : 0}px`,
        // maxHeight: `calc(100vh - ${additionalElementsHeight}px)`,
        // overflowY: 'auto',
        // overflowX: 'initial'
    };
}
