interface TransactionHistoryProps {
    transactions: any[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
    if (transactions.length === 0) {
        return <p>No transactions yet.</p>;
    }

    return (
        <div>
            <h2>Transaction History</h2>
            {transactions.map((tx, i) => (
                <div key={i}>
                    <p>{tx.action}</p>
                    <a 
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {tx.hash.slice(0, 10)}...
                    </a>
                    <span> — {tx.time} — </span>
                    <span>{tx.status}</span>
                </div>
            ))}
        </div>
    );
};

export default TransactionHistory;