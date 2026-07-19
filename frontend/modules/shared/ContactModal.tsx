'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@/src/components/ui/modal'
import { FormTextInput } from '@/src/components/form/form-text-input'
import FormTextarea from '@/src/components/form/form-textarea'
import { Form } from '@/src/components/form/form'
import { Button } from '@/src/components/ui/button'
import { useCreateContact } from '@/src/hooks/contact.hook'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod";

export type ContactForm = {
 name: string
 email: string
 subject: string
 message: string
}



interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const contactShema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})



const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const methods = useForm<ContactForm>({
    resolver:zodResolver(contactShema),

    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const { handleSubmit, reset, control } = methods

  const {mutateAsync: createContact,isPending: isCreatingContact} = useCreateContact()


  const onSubmit = async (data: ContactForm) => {
    await createContact(data,{
      onSuccess: () => {
    reset()
    onClose()
      }
    })
   

  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact us" size="md">
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormTextInput control={control} name="name" placeholder="Full Name" />

          <FormTextInput control={control} name="email" placeholder="Email" type="email" />

          <FormTextInput control={control} name="subject" placeholder="Subject" />

          <FormTextarea control={control} name="message" placeholder="Message" />

          <div className='flex justify-end items-center gap-2'>
            <Button onClick={onClose} variant={'outline'} className='border'>Cancel</Button>
            <Button type="submit" disabled={isCreatingContact}>
              {isCreatingContact ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  )
}

export default ContactModal
