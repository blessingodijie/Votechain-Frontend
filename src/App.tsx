import { useState } from "react";
import { useVoting } from "./hooks/useVoting";
import { useElection } from "./hooks/useElection";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import ProposalList from "./components/ProposalList";
import TransactionHistory from "./components/TransactionHistory";
import ElectionList from "./components/ElectionList";
import ElectionAdminPanel from "./components/ElectionAdminPanel";

function App() {
    const [activeTab, setActiveTab] = useState("proposal");

    const {
        walletAddress,
        isAdmin,
        proposals,
        isLoading,
        transactions,
        connectWallet,
        vote,
        createProposal,
        endProposal,
    } = useVoting();

    const {
        walletAddress: electionWalletAddress,
        isAdmin: isElectionAdmin,
        isLoading: isElectionLoading,
        elections,
        candidatesByElection,
        connectWallet: connectElectionWallet,
        vote: voteForCandidate,
        createElection,
        addCandidate,
        endElection,
        fetchCandidates,
    } = useElection();

    return (
        <div>
            <div className="tab-switcher">
            <button 
            className={`tab-btn ${activeTab === "proposal" ? "active" : ""}`}
            onClick={() => setActiveTab("proposal")}
            >
            Proposal Voting
            </button>
            <button 
            className={`tab-btn ${activeTab === "election" ? "active" : ""}`}
            onClick={() => setActiveTab("election")}
            >
            Student Election
            </button>
            </div>

            {activeTab === "proposal" && (
                <div>
                    <Header walletAddress={walletAddress} connectWallet={connectWallet} />
                    <main>
                        {isLoading && <p>Loading...</p>}
                        {isAdmin && <p>👑 You are the admin</p>}
                        {isAdmin && (
                            <AdminPanel
                                createProposal={createProposal}
                                isLoading={isLoading}
                            />
                        )}
                        <ProposalList
                            proposals={proposals}
                            vote={vote}
                            endProposal={endProposal}
                            isAdmin={isAdmin}
                            isLoading={isLoading}
                        />
                        <TransactionHistory transactions={transactions} />
                    </main>
                </div>
            )}

            {activeTab === "election" && (
                <div>
                    <Header walletAddress={electionWalletAddress} connectWallet={connectElectionWallet} />
                    <main>
                        {isElectionLoading && <p>Loading...</p>}
                        {isElectionAdmin && <p>👑 You are the admin</p>}
                        {isElectionAdmin && (
                            <ElectionAdminPanel
                                createElection={createElection}
                                addCandidate={addCandidate}
                                elections={elections}
                                isLoading={isElectionLoading}
                            />
                        )}
                        <ElectionList
                            elections={elections}
                            candidatesByElection={candidatesByElection}
                            fetchCandidates={fetchCandidates}
                            vote={voteForCandidate}
                            endElection={endElection}
                            isAdmin={isElectionAdmin}
                            isLoading={isElectionLoading}
                        />
                    </main>
                </div>
            )}
        </div>
    );
}

export default App;