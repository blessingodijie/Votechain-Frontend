import { truncateAddress } from "../utils/helpers";

interface HeaderProps {
    walletAddress: string;
    connectWallet: () => void;
}

const Header = ({ walletAddress, connectWallet }: HeaderProps) => {
    return (
        <header>
            <h1>🗳 VoteChain</h1>
            <button onClick={connectWallet}>
                {walletAddress ? truncateAddress(walletAddress) : "Connect Wallet"}
            </button>
        </header>
    );
};

export default Header;