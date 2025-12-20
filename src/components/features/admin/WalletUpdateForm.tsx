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
      coinsChange: 0,
      gemsChange: 0,
      reason: "",
    },
  })

  const onSubmit = async (data: WalletUpdateFormInput & { userId: string }) => {
    await onUpdate({
      userId: data.userId,
      coinsChange: data.coinsChange,
      gemsChange: data.gemsChange,
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Coins Change
              </label>
              <Input
                {...register("coinsChange", { valueAsNumber: true })}
                type="number"
                placeholder="0"
              />
              {errors.coinsChange && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.coinsChange.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Gems Change
              </label>
              <Input
                {...register("gemsChange", { valueAsNumber: true })}
                type="number"
                placeholder="0"
              />
              {errors.gemsChange && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.gemsChange.message}
                </p>
              )}
            </div>
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
