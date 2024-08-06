import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Toolbar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styleVariables } from '@/constants/styles-variables';
import { useState } from 'react';

const filtersPanelContainer = {
    marginBottom: styleVariables.margin,
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 3
};

export function FiltersPanel({ onApply, onClear, children }) {
    const [expanded, setExpanded] = useState<boolean>(false);

    function onClearClick() {
        setExpanded(false);
        onClear();
    }

    function onApplyClick() {
        setExpanded(false);
        onApply();
    }

    return (
        <Accordion sx={filtersPanelContainer} expanded={expanded}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                              onClick={() => setExpanded(!expanded)}>Filters</AccordionSummary>

            <AccordionDetails sx={{ py: 0 }}>{children}</AccordionDetails>

            <AccordionActions>
                <Button onClick={() => setExpanded(false)}>Close</Button>
                <Button variant="outlined" onClick={() => onClearClick()}>Clear</Button>
                <Button variant="contained" onClick={() => onApplyClick()}>Apply</Button>
            </AccordionActions>
        </Accordion>
    );
}