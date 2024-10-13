"use client";
import { styled } from "styled-components";
import { Button as Btn } from "@/components/Button/button";
import { default as Loading } from "@/components/Loading/loading";
import { default as Stepper }  from "@/components/Stepper/stepper";
import Filter from "@/components/FilterField/filterField";

const ComponentsContainer = styled.div`
    display: flex;
    gap: 50px;
    padding: 25px;
    width: 100%;
    min-height: 100vh;
    flex-wrap: wrap;
`;

const UtilsComponents = () => {
    return (
        <>
            <ComponentsContainer>
                <Btn type={"cancel"}>Botão Exemplo</Btn>
                <Btn>Botão Exemplo</Btn>
                <Loading />
                <Stepper />
                <Filter />
            </ComponentsContainer>
        </>
    )
}

export default UtilsComponents;