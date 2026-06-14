import { useState } from "react";

interface AdminPanelProps {
    createProposal: (name: string, description: string, options: string[], duration: number) => void;
    isLoading: boolean;
}

const AdminPanel = ({ createProposal, isLoading }: AdminPanelProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [duration, setDuration] = useState(86400);

    const handleSubmit = () => {
        const validOptions = options.filter(o => o.trim() !== "");
        if (!name || validOptions.length < 2) {
            alert("Please fill in name and at least 2 options");
            return;
        }
        createProposal(name, description, validOptions, duration);
    };

    return (
        <div>
            <h2>Create Proposal</h2>
            <input placeholder="Proposal name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            {options.map((opt, i) => (
                <input key={i} placeholder={`Option ${i + 1}`} value={opt}
                    onChange={e => { const o = [...options]; o[i] = e.target.value; setOptions(o); }} />
            ))}
            <button onClick={() => setOptions([...options, ""])}>+ Add Option</button>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                <option value={3600}>1 hour</option>
                <option value={86400}>24 hours</option>
                <option value={604800}>7 days</option>
            </select>
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Deploying..." : "Deploy Proposal"}
            </button>
        </div>
    );
};

export default AdminPanel;