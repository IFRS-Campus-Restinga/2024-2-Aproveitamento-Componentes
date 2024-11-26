import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector from '@mui/material/StepConnector';
import {styled} from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CircleIcon from '@mui/icons-material/Circle';
import CancelIcon from '@mui/icons-material/Cancel';
import {getFailed, getSucceeded} from "@/app/requests/status";
import {steps} from "@/app/requests/status"

const CustomConnector = styled(StepConnector)(({theme}) => ({
    '& .MuiStepConnector-line': {
        borderColor: theme.palette.success.main,
    },
}));

// Função que retorna o ícone baseado no status de cada passo
const getStepIcon = (step, status) => {
    if (status) {
        console.log(status);
        if (getSucceeded().includes(status)) return <CheckCircleIcon sx={{color: 'green', fontSize: '1.5rem'}}/>;
        if (getFailed().includes(status)) return <CancelIcon sx={{color: 'red', fontSize: '1.5rem'}}/>;
        return <AccessTimeIcon sx={{color: 'orange', fontSize: '1.5rem'}}/>;
    }
    return <CircleIcon color="disabled" sx={{fontSize: '1.5rem'}}/>;
};

const getStepStatus = (stepArray, stepStatusFunc) => {
    return Object.values(stepArray)[0]
        .reverse()
        .find(value => stepStatusFunc().includes(value.status_display));
};

export default function HorizontalLinearAlternativeLabelStepper({stepsStatus}) {
    console.log(stepsStatus);
    // Função para pegar o label
    const getLabel = (index) => stepsStatus[index] ? stepsStatus[index].status_display : steps[index].label;

    return (
        <Box sx={{width: '100%', p: 4}}>
            <Stepper alternativeLabel connector={<CustomConnector/>}>
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel StepIconComponent={() => getStepIcon(step.index, stepsStatus[step.index]?.status_display)}>
                            {getLabel(step.index)}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
