export default function ErrorMessage({ error, success }) {
  return (
    <>
      {error && <div className="feedback error" role="alert">{error}</div>}
      {success && <div className="feedback success" role="status">{success}</div>}
    </>
  );
}
