"use client";
import Image from "next/image";
import { styled } from "styled-components";

const FooterIf = styled.footer`
     display: flex;
    padding: 0.75rem;
    background-color: #CFCDCD;
    width: 100%;
    height: 120px;
    justify-content: center;
`;

const InfoIf = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: medium;
    text-align: center;
    margin-right: 200px;
    .name {
        font-weight: 900;
        font-size: 24px;
    }
`;

export const Footer = () => {
    return (
        <>
            <footer>
                <FooterIf>
                    <Image
                        src="/Logo-Ifrs-Preto-Horizontal.png"
                        alt="IFRS Logo"
                        className="dark:invert mr-20"
                        height={90}
                        width={200}
                    />
                    <InfoIf>
                        <span className="name">Instituto Federal do Rio Grande do Sul, Campus Restinga</span>
                        <span>Rua Alberto Hoffmann, 285 - Restinga, Porto Alegre / RS</span>
                        <span>CEP: 91791-508 - Fone: (51) 3247-8400</span>
                    </InfoIf>
                </FooterIf>
            </footer>
        </>
    )
}