import { defineType, defineField } from 'sanity';

export const socialLinks = defineType({
  name: 'socialLinks',
  title: 'Social links',
  type: 'object',
  fields: [
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'facebook', type: 'url' }),
    defineField({ name: 'tiktok', type: 'url' }),
    defineField({ name: 'x', title: 'X (Twitter)', type: 'url' }),
    defineField({ name: 'youtube', type: 'url' }),
  ],
});
