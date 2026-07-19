
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ContactForm } from "@/src/modules/shared/ContactModal"
import { createContact } from "../server/contact"


export const useCreateContact = () => {
    return useMutation<any, Error, ContactForm>({
        mutationKey: ['CREATE_CONTACT'],
        mutationFn: async (contactForm) => await createContact(contactForm),
        onSuccess: () => {
            toast.success("Contact form submitted successfully")
        },
        onError: (error: Error) => {
            toast.error(error?.message)
        },
    })
}