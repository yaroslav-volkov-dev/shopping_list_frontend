import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js'
import { Label } from '@/components/ui/label.js'
import { Input } from '@/components/ui/input.js'
import { Button } from '@/components/ui/button.js'
import { DialogClose } from '@radix-ui/react-dialog'
import { CreateSupplierDto } from '@/models/supplier.model.ts'
import { useState } from 'react'
import { useAddSupplierMutation } from '@/api/queries'

export const AddSupplierDialog = () => {
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset } = useForm<CreateSupplierDto>()

  const { mutate, isPending } = useAddSupplierMutation({
    onSuccess: () => {
      setOpen(false)
      reset()
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add supplier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
            <DialogDescription>
              Add new supplier to the database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                placeholder="Name"
                {...register('name', { required: true })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                placeholder="Phone number"
                {...register('phoneNumber')}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" isLoading={isPending}>
              Save
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
