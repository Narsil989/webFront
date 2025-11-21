import { Container } from '@/components/layout/Container';
import { getItems, getActuals } from '@/lib/db';
import RankGrid from '@/components/features/RankGrid';

interface Item {
  id: string;
  yourName: string;
  davidDateOfBirth: string;
  davidWeight: string;
  davidLength: string;
  hasUnibrow: boolean;
  createdAt: string;
}

export const dynamic = 'force-dynamic';

export default async function RankPage() {
  const items = await getItems<Item>();
  const actuals = await getActuals();

  return (
    <Container>
      <RankGrid items={items} actuals={actuals} />
    </Container>
  );
}
