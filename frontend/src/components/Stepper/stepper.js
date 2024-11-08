import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CircleIcon from '@mui/icons-material/Circle';

const steps = [
    'Solicitação Criada',
    'Em análise do Ensino',
    'Em análise do Coordenador',
    'Em análise do Professor',
    'Deferido',
    'Concluído',
];

const CustomConnector = styled(StepConnector)(({ theme }) => ({
    '& .MuiStepConnector-line': {
        borderColor: theme.palette.success.main,
    },
}));

const CustomStepIcon = ({ index, activeStep }) => {
    if (index <= activeStep) {
        return <CheckCircleIcon sx={{ color: 'green', fontSize: '1.5rem' }} />;
    } else if (index === activeStep + 1) {
        return <AccessTimeIcon sx={{ color: 'orange', fontSize: '1.5rem' }} />;
    } else {
        return <CircleIcon color="disabled" sx={{ fontSize: '1.5rem' }} />;
    }
};

export default function HorizontalLinearAlternativeLabelStepper({ currentStep }) {
    const activeStep = steps.indexOf(currentStep);

    return (
        <Box sx={{ width: '100%', p: 4 }}>
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<CustomConnector />}
            >
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconComponent={() => (
                                <CustomStepIcon
                                    index={index}
                                    activeStep={activeStep}
                                />
                            )}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
