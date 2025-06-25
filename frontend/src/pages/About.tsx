export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">About the project</h1>
      <p className="mb-4">
        <strong>PassSafe</strong> is a privacy-first password manager that
        stores and encrypts all your data locally. Your vault is never uploaded
        to the cloud, and your master password is never shared.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">🔐 Key Features</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Client-side AES-256 encryption using your master password</li>
        <li>Zero-knowledge architecture — no data leaves your device</li>
        <li>Strong password generator</li>
        <li>Site-based search and retrieval</li>
        <li>Vault locking for added protection</li>
      </ul>
      <p className="mt-6">
        Whether you’re a privacy enthusiast or just want a simple password
        manager that stays on your device,
        <strong> PassSafe</strong> has you covered.
      </p>
    </div>
  );
}
