import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
    'Solicitação Criada',
    'Em análise do Ensino',
    'Em análise do Coordenador',
    'Em análise do Professor',
    'Deferido',
    'Concluído',
];

export default function HorizontalLinearAlternativeLabelStepper({currentStep}) {
    const activeStep = steps.indexOf(currentStep);
    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
