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
import {
    getFailed,
    getStep1Status,
    getStep2Status,
    getStep3Status,
    getStep4Status,
    getStep5Status,
    getSucceeded
} from "@/app/requests/status";

const steps = [
    'Análise do Ensino',
    'Análise do Coordenador',
    'Análise do Professor',
    'Homologação do Coordenador',
    'Homologação do Ensino',
];

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
    const getLabel = (index) => stepsStatus[index] ? stepsStatus[index].status_display : steps[index];

    return (
        <Box sx={{width: '100%', p: 4}}>
            <Stepper alternativeLabel connector={<CustomConnector/>}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={() => getStepIcon(index, stepsStatus[index]?.status_display)}>
                            {getLabel(index)}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
