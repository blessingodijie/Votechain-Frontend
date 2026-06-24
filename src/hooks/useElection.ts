import { useState } from "react";
import { ethers } from "ethers";
import { ELECTION_CONTRACT_ADDRESS, ELECTION_CONTRACT_ABI } from "../constants/election";

export const useElection = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [contract, setContract] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [elections, setElections] = useState<any[]>([]);
    const [candidatesByElection, setCandidatesByElection] = useState<{[key: number]: any[]}>({});

    const fetchElections = async (contractInstance: any) => {
        try {
            setIsLoading(true);
            const loaded: any[] = [];
            let i = 0;
            while (true) {
                try {
                    const election = await contractInstance.getElection(i);
                    loaded.push(election);
                    i++;
                } catch {
                    break;
                }
            }
            setElections(loaded);
        } catch (error) {
            console.error("Error fetching elections:", error);
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
            const network = await provider.getNetwork();
                if (network.chainId !== 11155111n) {
                    alert("Please switch your wallet to the Sepolia network!");
                    return;
                }
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const contractInstance = new ethers.Contract(
                ELECTION_CONTRACT_ADDRESS,
                ELECTION_CONTRACT_ABI,
                signer
            );
            setWalletAddress(address);
            setContract(contractInstance);

            const adminAddress = await contractInstance.admin();
            setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase());

            await fetchElections(contractInstance);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const fetchCandidates = async (electionId: number) => {
        try {
            if (!contract) return;
            const candidateList = await contract.getCandidates(electionId);
            setCandidatesByElection(prev => ({ ...prev, [electionId]: candidateList }));
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    const vote = async (candidateId: number) => {
        try {
            if (!contract) {
                alert("Please connect your wallet first!");
                return;
            }
            setIsLoading(true);
            const tx = await contract.vote(candidateId);
            await tx.wait();
        } catch (error: any) {
            alert(error.reason || "Transaction failed");
        } finally {
            setIsLoading(false);
        }
    };

    const createElection = async (title: string, duration: number) => {
        try {
            if (!contract) return;
            setIsLoading(true);
            const tx = await contract.createElection(title, duration);
            await tx.wait();
            await fetchElections(contract);
        } catch (error: any) {
            alert(error.reason || "Failed to create election");
        } finally {
            setIsLoading(false);
        }
    };

    const addCandidate = async (
        electionId: number,
        name: string,
        position: string,
        walletAddress: string
    ) => {
        try {
            if (!contract) return;
            setIsLoading(true);
            const tx = await contract.addCandidate(electionId, name, position, walletAddress);
            await tx.wait();
            await fetchCandidates(electionId);
        } catch (error: any) {
            alert(error.reason || "Failed to add candidate");
        } finally {
            setIsLoading(false);
        }
    };

    const endElection = async (electionId: number) => {
        try {
            if (!contract) return;
            setIsLoading(true);
            const tx = await contract.endElection(electionId);
            await tx.wait();
            await fetchElections(contract);
        } catch (error: any) {
            alert(error.reason || "Failed to end election");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        walletAddress,
        isAdmin,
        isLoading,
        elections,
        candidatesByElection,
        connectWallet,
        vote,
        createElection,
        addCandidate,
        endElection,
        fetchCandidates,
    };
};