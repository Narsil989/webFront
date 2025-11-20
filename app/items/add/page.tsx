import { Container } from '@/components/layout/Container';
import { ItemForm } from '@/components/features/ItemForm';
import { t } from '@/lib/i18n';

export default function AddItemPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {t('add.title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {t('add.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 sm:p-8">
          <ItemForm />
        </div>
      </div>
    </Container>
  );
}
