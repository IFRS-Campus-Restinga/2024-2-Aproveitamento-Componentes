"use client";
import ifLogoFooter from "@/assets/Logo-Ifrs-Preto-Horizontal.png";
import { styled } from "styled-components";

const FooterIf = styled.footer`
    display: flex;
    padding: 25px;
    background-color:  #CFCDCD;
    width: 100%;
    height: 82px;
    justify-content: center;
    align-items: center;
    justify-content: space-between;

    img {
        height: 100px;
    }
`;

const InfoIf = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: medium;

    .name {
        font-weight: 900;
        font-size: 24px;
    }
`;


export const Footer = () => {
    return (
        <>
            <FooterIf>
                <img src={ifLogoFooter} alt="ifLogo"></img>
                <InfoIf>
                    <span className="name">Instituto Federal do Rio Grande do Sul, Campus Restinga</span>
                    <span>Rua Alberto Hoffmann, 285 - Restinga, Porto Alegre / RS</span>
                    <span>CEP: 91791-508 - Fone: (51) 3247-8400</span>
                </InfoIf>
                <div></div>
            </FooterIf>
        </>
    )
}