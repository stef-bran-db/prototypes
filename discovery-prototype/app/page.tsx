export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: "100%",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#161616",
            marginBottom: 8,
          }}
        >
          Databricks Prototype
        </h1>
        <p style={{ fontSize: 14, color: "#6F6F6F" }}>
          Start building your prototype in app/ using Dubois components.
        </p>
      </div>
    </div>
  );
}
