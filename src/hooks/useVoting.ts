import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

export const useVoting = () => {
    const [provider, setProvider] = useState<any>(null);
    const [walletAddress, setWalletAddress] = useState("");
    const [contract, setContract] = useState<any>(null);
    const [proposals, setProposals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchProposals = async (contractInstance: any) => {
        try {
            setIsLoading(true);
            const loaded: any[] = [];
            let i = 0;
            while (true) {
                try {
                    const proposal = await contractInstance.getProposal(i);
                    loaded.push(proposal);
                    i++;
                } catch {
                    break;
                }
            }
            setProposals(loaded);
        } catch (error) {
            console.error("Error fetching proposals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask!");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );
            setProvider(provider);
            setWalletAddress(address);
            setContract(contract);
            const adminAddress = await contract.admin();
            setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase());
            await fetchProposals(contract);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const vote = async (proposalId: number, optionIndex: number) => {
        try {
            if (!contract) {
                alert("Please connect your wallet first!");
                return;
            }
            setIsLoading(true);
            const tx = await contract.vote(proposalId, optionIndex);
            await tx.wait();
            setTransactions(prev => [...prev, {
                hash: tx.hash,
                action: `Voted on proposal ${proposalId}`,
                time: new Date().toLocaleTimeString(),
                status: "confirmed"
            }]);
            await fetchProposals(contract);
        } catch (error: any) {
            alert(error.reason || "Transaction failed");
        } finally {
            setIsLoading(false);
        }
    };

    const createProposal = async (
        name: string,
        description: string,
        options: string[],
        duration: number
    ) => {
        try {
            if (!contract) return;
            setIsLoading(true);
            const tx = await contract.createProposal(name, description, options, duration);
            await tx.wait();
            await fetchProposals(contract);
        } catch (error: any) {
            alert(error.reason || "Failed to create proposal");
        } finally {
            setIsLoading(false);
        }
    };

    const endProposal = async (proposalId: number) => {
        try {
            if (!contract) return;
            setIsLoading(true);
            const tx = await contract.endProposal(proposalId);
            await tx.wait();
            await fetchProposals(contract);
        } catch (error: any) {
            alert(error.reason || "Failed to end proposal");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        walletAddress,
        isAdmin,
        proposals,
        isLoading,
        transactions,
        contract,
        connectWallet,
        vote,
        createProposal,
        endProposal,
    };
};