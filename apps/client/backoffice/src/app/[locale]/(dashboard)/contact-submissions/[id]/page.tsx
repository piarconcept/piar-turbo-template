import { ContactSubmissionDetailView } from './view';

export default async function ContactSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContactSubmissionDetailView id={id} />;
}
