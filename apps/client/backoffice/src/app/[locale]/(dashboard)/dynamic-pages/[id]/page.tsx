import { DynamicPageEditView } from './view';

export default async function DynamicPageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DynamicPageEditView id={id} />;
}
