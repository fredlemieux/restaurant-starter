import type { StructureBuilder } from 'sanity/structure';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Restaurant')
        .child(S.document().schemaType('restaurant').documentId('restaurant')),
      S.divider(),
      S.documentTypeListItem('menu').title('Menus'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('press').title('Press'),
      S.documentTypeListItem('page').title('Pages'),
    ]);
