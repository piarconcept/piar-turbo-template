import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { LegalTemplateMessages } from '@piar/messages';
import { Button, Container, Text } from '@piar/ui-components';

function renderSections(sections: LegalTemplateMessages['sections']) {
  return sections.map((section, index) => (
    <div key={`${section.title}-${index}`} className="space-y-3">
      <Text as="h2" variant="h4" className="text-[var(--color-secondary)]">
        {section.title}
      </Text>
      {section.body.map((paragraph, paragraphIndex) => (
        <Text
          key={`${section.title}-p-${paragraphIndex}`}
          as="p"
          variant="body"
          className="text-gray-600"
        >
          {paragraph}
        </Text>
      ))}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-2 text-gray-600">
          {section.bullets.map((bullet, bulletIndex) => (
            <li key={`${section.title}-b-${bulletIndex}`} className="flex items-start gap-2">
              <Text as="span" variant="bodySmall" className="mt-1 text-[var(--color-primary)]">
                •
              </Text>
              <Text as="span" variant="bodySmall" className="text-gray-600">
                {bullet}
              </Text>
            </li>
          ))}
        </ul>
      )}
      {section.note && (
        <Text as="p" variant="bodySmall" className="rounded-md bg-gray-50 px-3 py-2 text-gray-600">
          {section.note}
        </Text>
      )}
      {section.subsections && section.subsections.length > 0 && (
        <div className="space-y-4 pl-4">{renderSections(section.subsections)}</div>
      )}
    </div>
  ));
}

export default async function TermsPage() {
  const t = await getTranslations('legal');
  const content = t.raw('terms') as LegalTemplateMessages;
  return (
    <Container className="py-12" width="7xl" padding="md">
      <Text as="h1" variant="h2" className="text-[var(--color-secondary)]">
        {content.title}
      </Text>
      {content.updatedAt && (
        <Text as="p" variant="caption" className="mt-2 text-gray-500">
          {content.updatedAt}
        </Text>
      )}
      {content.intro && (
        <Text as="p" variant="body" className="mt-4 text-gray-600">
          {content.intro}
        </Text>
      )}

      <div className="mt-6 space-y-6">{renderSections(content.sections)}</div>

      {content.footerNote && (
        <Text as="p" variant="bodySmall" className="mt-6 text-gray-500">
          {content.footerNote}
        </Text>
      )}

      <div className="mt-8">
        <Button asChild variant="ghost" size="inline" className="text-[var(--color-primary)]">
          <Link href="/legal">{content.backToLegalLabel ?? t('index.title')}</Link>
        </Button>
      </div>
    </Container>
  );
}
