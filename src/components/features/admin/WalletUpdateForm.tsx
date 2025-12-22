import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui"
import {
  walletUpdateFormSchema,
  type WalletUpdateFormInput,
} from "@/lib/db/schema/validations"

interface WalletUpdateFormProps {
  onUpdate: (data: {
    userId: string
    amountChange: number
    reason: string
  }) => Promise<void>
  isPending: boolean
}

export function WalletUpdateForm({
  onUpdate,
  isPending,
}: WalletUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WalletUpdateFormInput & { userId: string }>({
    resolver: zodResolver(
      walletUpdateFormSchema.extend({
        userId: walletUpdateFormSchema.shape.reason,
      }),
    ),
    defaultValues: {
      userId: "",
      amountChange: 0,
      reason: "",
    },
  })

  const onSubmit = async (data: WalletUpdateFormInput & { userId: string }) => {
    await onUpdate({
      userId: data.userId,
      amountChange: data.amountChange,
      reason: data.reason,
    })

    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update User Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">User ID</label>
            <Input
              {...register("userId")}
              type="text"
              placeholder="Enter user ID"
            />
            {errors.userId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.userId.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount Change (USD)
            </label>
            <Input
              {...register("amountChange", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
            {errors.amountChange && (
              <p className="mt-1 text-xs text-red-500">
                {errors.amountChange.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Reason</label>
            <Input
              {...register("reason")}
              type="text"
              placeholder="Enter reason for adjustment"
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-red-500">
                {errors.reason.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Wallet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
