import { useState } from "react"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui"

interface WalletUpdateFormProps {
  onUpdate: (data: {
    userId: string
    coinsChange: number
    gemsChange: number
    reason: string
  }) => Promise<void>
  isPending: boolean
}

export function WalletUpdateForm({
  onUpdate,
  isPending,
}: WalletUpdateFormProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [coinsChange, setCoinsChange] = useState<string>("0")
  const [gemsChange, setGemsChange] = useState<string>("0")
  const [reason, setReason] = useState<string>("")

  const handleSubmit = async () => {
    if (!selectedUserId) {
      alert("Please select a user")
      return
    }

    await onUpdate({
      userId: selectedUserId,
      coinsChange: parseInt(coinsChange),
      gemsChange: parseInt(gemsChange),
      reason,
    })

    setCoinsChange("0")
    setGemsChange("0")
    setReason("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update User Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">User ID</label>
            <Input
              type="text"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Coins Change
              </label>
              <Input
                type="number"
                value={coinsChange}
                onChange={(e) => setCoinsChange(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Gems Change
              </label>
              <Input
                type="number"
                value={gemsChange}
                onChange={(e) => setGemsChange(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Reason</label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for adjustment"
            />
          </div>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update Wallet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
