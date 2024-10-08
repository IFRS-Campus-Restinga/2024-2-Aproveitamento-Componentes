import ifLogo from "/src/assets/Logo-Ifrs-Horizontal.png";
import { styled } from "styled-components";

const HeaderIf = styled.header`
    display: flex;
    padding: 25px;
    background-color:  #00510f;
    width: 100%;
    height: 82px;
    align-items: center;

    img {
        height: 100px;
    }
`;

export const Header = () => {
    return (
        <>
            <HeaderIf>
                <img src={ifLogo} alt="ifLogo"></img>
            </HeaderIf>
        </>
    )
}