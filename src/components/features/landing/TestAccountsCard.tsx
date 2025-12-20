const testAccounts = [
  {
    type: "Admin Account",
    email: "admin@cardgacha.com",
    password: "admin123",
    colorClass: "text-blue-400",
  },
  {
    type: "User Account",
    email: "user@cardgacha.com",
    password: "user123",
    colorClass: "text-green-400",
  },
]

export function TestAccountsCard() {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
      <h2 className="mb-4 text-3xl font-bold">Test Accounts</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {testAccounts.map((account) => (
          <div key={account.type}>
            <h3 className={`mb-2 text-xl font-semibold ${account.colorClass}`}>
              {account.type}
            </h3>
            <p className="text-gray-300">Email: {account.email}</p>
            <p className="text-gray-300">Password: {account.password}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
