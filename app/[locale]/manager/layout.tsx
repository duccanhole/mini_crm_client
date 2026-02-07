import MainLayout from '@/components/layouts/MainLayout';

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout userRole="manager">{children}</MainLayout>;
}
