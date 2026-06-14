import { useVoting } from "./hooks/useVoting";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import ProposalList from "./components/ProposalList";
import TransactionHistory from "./components/TransactionHistory";

function App() {
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

    return (
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
                    walletAddress={walletAddress}
                    vote={vote}
                    endProposal={endProposal}
                    isAdmin={isAdmin}
                    isLoading={isLoading}
                />
                <TransactionHistory transactions={transactions} />
            </main>
        </div>
    );
}

export default App;