import { useState } from "react";

interface ElectionAdminPanelProps {
    createElection: (title: string, duration: number) => void;
    addCandidate: (electionId: number, name: string, position: string, walletAddress: string) => void;
    elections: any[];
    isLoading: boolean;
}

const ElectionAdminPanel = ({ createElection, addCandidate, elections, isLoading }: ElectionAdminPanelProps) => {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(86400);
    const [selectedElectionId, setSelectedElectionId] = useState(0);
    const [candidateName, setCandidateName] = useState("");
    const [position, setPosition] = useState("");
    const [walletAddress, setWalletAddress] = useState("");

    const handleCreateElection = () => {
        if (!title) {
            alert("Please enter an election title");
            return;
        }
        createElection(title, duration);
        setTitle("");
    };

    const handleAddCandidate = () => {
        if (!candidateName || !position || !walletAddress) {
            alert("Please fill in all candidate fields");
            return;
        }
        addCandidate(selectedElectionId, candidateName, position, walletAddress);
        setCandidateName("");
        setPosition("");
        setWalletAddress("");
    };

    return (
        <div>
            <h2>Create Election</h2>
            <input placeholder="Election title" value={title} onChange={e => setTitle(e.target.value)} />
            <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                <option value={3600}>1 hour</option>
                <option value={86400}>24 hours</option>
                <option value={604800}>7 days</option>
            </select>
            <button onClick={handleCreateElection} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Election"}
            </button>

            <h2>Add Candidate</h2>
            <select value={selectedElectionId} onChange={e => setSelectedElectionId(Number(e.target.value))}>
                {elections.map((election, i) => (
                    <option key={i} value={i}>{election.title}</option>
                ))}
            </select>
            <input placeholder="Candidate name" value={candidateName} onChange={e => setCandidateName(e.target.value)} />
            <input placeholder="Position (e.g. President)" value={position} onChange={e => setPosition(e.target.value)} />
            <input placeholder="Candidate wallet address" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} />
            <button onClick={handleAddCandidate} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Candidate"}
            </button>
        </div>
    );
};

export default ElectionAdminPanel;