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
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Test Accounts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testAccounts.map((account) => (
          <div key={account.type}>
            <h3 className={`text-xl font-semibold mb-2 ${account.colorClass}`}>
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
