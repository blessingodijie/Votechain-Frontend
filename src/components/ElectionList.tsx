import { useState, useEffect } from "react";
interface ElectionListProps {
    elections: any[];
    candidatesByElection: {[key: number]: any[]};
    fetchCandidates: (electionId: number) => void;
    vote: (candidateId: number) => void;
    endElection: (electionId: number) => void;
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

    return <span>⏱ {timeLeft}</span>;
};

    const getWinnersByPosition = (candidates: any[]) => {
    const positions = [...new Set(candidates.map(c => c.position))];
    const winners: {[key: string]: any} = {};

    positions.forEach(pos => {
        const candidatesForThisPosition = candidates.filter(c => c.position === pos);
        const winner = candidatesForThisPosition.reduce((a, b) =>
            a.voteCount > b.voteCount ? a : b
        );
        winners[pos] = winner;
    });

    return winners;
};    

        const ElectionList = ({ elections, candidatesByElection, fetchCandidates, vote, endElection, isAdmin, isLoading }: ElectionListProps) => {
    const [expandedElectionId, setExpandedElectionId] = useState<number | null>(null);

    if (elections.length === 0) {
        return <p>No elections yet.</p>;
    }

    return (
        <div>
            <h2>Elections</h2>
            {elections.map((election, i) => {
                const isEnded = !election.isActive || Number(election.endTime) * 1000 < Date.now();
                const candidates = candidatesByElection[i] || [];

                return (
                    <div key={i} className="election-card">
                        <h3>{election.title}</h3>
                        <CountdownTimer endTime={Number(election.endTime)} />
                        
                        <button onClick={() => {
                            setExpandedElectionId(expandedElectionId === i ? null : i);
                            fetchCandidates(i);
                        }}>
                            {expandedElectionId === i ? "Hide Candidates" : "View Candidates"}
                        </button>

                        {expandedElectionId === i && (
                            <div>
                                {(() => {
                                    const positions = [...new Set(candidates.map(c => c.position))];
                                    const winners = isEnded ? getWinnersByPosition(candidates) : null;

                                    return positions.map(pos => (
                                        <div key={pos} className="position-group">
                                            <h4>{pos}</h4>
                                            {winners && winners[pos] && (
                                                <p>🏆 Winner: {winners[pos].name}</p>
                                            )}
                                            {candidates
                                                .filter(c => c.position === pos)
                                                .map((candidate, idx) => (
                                                    <div key={idx} className="candidate-row">
                                                        <span>{candidate.name} — {candidate.voteCount.toString()} votes</span>
                                                        {!isEnded && (
                                                            <button onClick={() => vote(candidate.id)} disabled={isLoading}>
                                                                Vote
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}

                        {isAdmin && !isEnded && (
                            <button onClick={() => endElection(i)}>End Election Early</button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ElectionList;