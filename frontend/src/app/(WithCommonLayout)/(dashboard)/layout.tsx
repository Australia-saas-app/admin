import DashboardLayout from '@/src/modules/dashboard/shared/components/DashboardLayout';
import { ReactNode } from 'react'

const layout = ({ children }: {
    children: ReactNode;

}) => {
    return (
        <DashboardLayout>{children}</DashboardLayout>
    )
}


export default layout