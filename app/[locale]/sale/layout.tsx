import MainLayout from '@/components/layouts/MainLayout';

export default function SaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout userRole="sale">{children}</MainLayout>;
}
