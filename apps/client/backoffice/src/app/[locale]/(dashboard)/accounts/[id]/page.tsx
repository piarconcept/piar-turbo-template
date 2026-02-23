import { AccountEditView } from './view';

export default async function AccountEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AccountEditView id={id} />;
}
