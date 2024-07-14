import { styleVariables } from '@/constants/styles-variables';

export function tableContainerStyles(withFilters = false) {
    return {
        paddingTop: `${withFilters ? styleVariables.filtersPanelHeight : 0}px`,
        maxHeight: `calc(100vh - ${69 + (withFilters ? styleVariables.filtersPanelHeight : 0) + styleVariables.toolbarHeight}px)`,
        overflowY: 'auto',
        overflowX: 'initial'
    };
}
