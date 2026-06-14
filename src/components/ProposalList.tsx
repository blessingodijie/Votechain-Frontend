import { useState, useEffect } from "react";

interface ProposalListProps {
    proposals: any[];
    walletAddress: string;
    vote: (proposalId: number, optionIndex: number) => void;
    endProposal: (proposalId: number) => void;
    isAdmin: boolean;
    isLoading: boolean;
}

const CountdownTimer = ({ endTime }: { endTime: number }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const tick = () => {
            const remaining = Number(endTime) * 1000 - Date.now();
            if (remaining <= 0) { setTimeLeft("Voting closed"); return; }
            const h = Math.floor(remaining / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${h}h ${m}m ${s}s remaining`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return <span className="timer">⏱ {timeLeft}</span>;

};

const ProposalList = ({ proposals, walletAddress, vote, endProposal, isAdmin, isLoading }: ProposalListProps) => {
    const [selectedOptions, setSelectedOptions] = useState<{[key: number]: number}>({});

    const totalVotes = (proposal: any) =>
        proposal.voteCounts.reduce((a: bigint, b: bigint) => a + b, 0n);

    const getWinner = (proposal: any) => {
        const max = proposal.voteCounts.reduce((a: bigint, b: bigint) => a > b ? a : b, 0n);
        const idx = proposal.voteCounts.findIndex((v: bigint) => v === max);
        return { option: proposal.options[idx], votes: max, idx };
    };

    if (proposals.length === 0) {
        return <p>No proposals yet.</p>;
    }

    return (
        <div>
            <h2>Proposals</h2>
            {proposals.map((proposal, i) => {
                const isEnded = !proposal.isActive || Number(proposal.endTime) * 1000 < Date.now();
                const total = totalVotes(proposal);
                const winner = isEnded ? getWinner(proposal) : null;

                return (
                    <div key={i} className="proposal-card">

                        <h3>{proposal.name}</h3>
                        <p>{proposal.description}</p>
                        <CountdownTimer endTime={Number(proposal.endTime)} />

                        {isEnded && winner && (
                            <p className="winner">🏆 Winner: {winner.option}</p>
                        )}

                        {proposal.options.map((opt: string, j: number) => {
                            const pct = total > 0n
                                ? Number((BigInt(proposal.voteCounts[j]) * 100n) / total)
                                : 0;
                            return (
                                <div key={j}>
                                    <button
                                        onClick={() => setSelectedOptions({...selectedOptions, [i]: j})}
                                        disabled={isEnded}
                                       className={`btn-option ${selectedOptions[i] === j ? "selected" : ""}`}
                                    >
                                        {opt} — {pct}% ({proposal.voteCounts[j].toString()} votes)
                                    </button>
                                </div>
                            );
                        })}

                        {!isEnded && (
                           <button
                             className="btn-primary"
                             onClick={() => vote(i, selectedOptions[i] ?? 0)}
                                disabled={isLoading || selectedOptions[i] === undefined}
                            >
                                Cast Vote
                            </button>
                        )}

                        {isAdmin && !isEnded && (
                            <button className="btn-danger" onClick={() => endProposal(i)}>

                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProposalList;