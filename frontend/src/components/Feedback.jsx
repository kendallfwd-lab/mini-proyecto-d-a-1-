export function Feedback({ error, success }) { return <>{error && <div className="feedback error">{error}</div>}{success && <div className="feedback success">{success}</div>}</>; }
