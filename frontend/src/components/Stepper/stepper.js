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

let step1;
let step2;
let step3;
let step4;
let step5;

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

const CustomStepIcon = ({index}) => {
    switch (index) {
        case 0:
            if (step1) {
                if (getSucceeded().includes(step1.status_display)) {
                    return <CheckCircleIcon sx={{color: 'green', fontSize: '1.5rem'}}/>;
                } else if (getFailed().includes(step1.status_display)) {
                    return <CancelIcon sx={{color: 'red', fontSize: '1.5rem'}}/>;
                } else {
                    return <AccessTimeIcon sx={{color: 'orange', fontSize: '1.5rem'}}/>;
                }
            } else {
                return <CircleIcon color="disabled" sx={{fontSize: '1.5rem'}}/>;
            }
        case 1:
            if (step2) {
                if (getSucceeded().includes(step2.status_display)) {
                    return <CheckCircleIcon sx={{color: 'green', fontSize: '1.5rem'}}/>;
                } else if (getFailed().includes(step2.status_display)) {
                    return <CancelIcon sx={{color: 'red', fontSize: '1.5rem'}}/>;
                } else {
                    return <AccessTimeIcon sx={{color: 'orange', fontSize: '1.5rem'}}/>;
                }
            } else {
                return <CircleIcon color="disabled" sx={{fontSize: '1.5rem'}}/>;
            }
        case 2:
            if (step3) {
                if (getSucceeded().includes(step3.status_display)) {
                    return <CheckCircleIcon sx={{color: 'green', fontSize: '1.5rem'}}/>;
                } else if (getFailed().includes(step3.status_display)) {
                    return <CancelIcon sx={{color: 'red', fontSize: '1.5rem'}}/>;
                } else {
                    return <AccessTimeIcon sx={{color: 'orange', fontSize: '1.5rem'}}/>;
                }
            } else {
                return <CircleIcon color="disabled" sx={{fontSize: '1.5rem'}}/>;
            }
        case 3:
            if (step4) {
                if (getSucceeded().includes(step4.status_display)) {
                    return <CheckCircleIcon sx={{color: 'green', fontSize: '1.5rem'}}/>;
                } else if (getFailed().includes(step4.status_display)) {
                    return <CancelIcon sx={{color: 'red', fontSize: '1.5rem'}}/>;
                } else {
                    return <AccessTimeIcon sx={{color: 'orange', fontSize: '1.5rem'}}/>;
                }
            } else {
                return <CircleIcon color="disabled" sx={{fontSize: '1.5rem'}}/>;
            }
        case 4:
            if (step5) {
                if (getSucceeded().includes(step5.status_display)) {
                    return <CheckCircleIcon sx={{color: 'green', fontSize: '1.5rem'}}/>;
                } else if (getFailed().includes(step5.status_display)) {
                    return <CancelIcon sx={{color: 'red', fontSize: '1.5rem'}}/>;
                } else {
                    return <AccessTimeIcon sx={{color: 'orange', fontSize: '1.5rem'}}/>;
                }
            } else {
                return <CircleIcon color="disabled" sx={{fontSize: '1.5rem'}}/>;
            }
    }
};

const getLabel = (index) => {
    switch (index) {
        case 0:
            return step1 ? step1.status_display : steps[0]
        case 1:
            return step2 ? step2.status_display : steps[1]
        case 2:
            return step3 ? step3.status_display : steps[2]
        case 3:
            return step4 ? step4.status_display : steps[3]
        case 4:
            return step5 ? step5.status_display : steps[4]
    }
}

export default function HorizontalLinearAlternativeLabelStepper(stepArray) {
    step1 = Object.values(stepArray)[0].reverse().find(value => getStep1Status().includes(value.status_display));
    step2 = Object.values(stepArray)[0].reverse().find(value => getStep2Status().includes(value.status_display));
    step3 = Object.values(stepArray)[0].reverse().find(value => getStep3Status().includes(value.status_display));
    step4 = Object.values(stepArray)[0].reverse().find(value => getStep4Status().includes(value.status_display));
    step5 = Object.values(stepArray)[0].reverse().find(value => getStep5Status().includes(value.status_display));

    return (
        <Box sx={{width: '100%', p: 4}}>
            <Stepper
                // activeStep={activeStep}
                alternativeLabel
                connector={<CustomConnector/>}
            >
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconComponent={() => (
                                <CustomStepIcon
                                    index={index}
                                />
                            )}
                        >
                            {getLabel(index)}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
