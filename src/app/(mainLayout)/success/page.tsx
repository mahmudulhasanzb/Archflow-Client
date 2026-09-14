import { redirect } from 'next/navigation';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (session_id) {
    return redirect(`/payment-success?session_id=${session_id}`);
  }
  return redirect('/');
}
