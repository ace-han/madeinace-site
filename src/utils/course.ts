import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Course } from '@/types';
import { APP_BLOG_CONFIG } from '@/utils/config';
import { cleanSlug, BLOG_BASE, CATEGORY_BASE, TAG_BASE } from './permalinks';
import type { PaginateFunction } from 'astro';

const getNormalizedCourse = async (post: CollectionEntry<'course'>): Promise<Course> => {
  const { id, slug: rawSlug = '', data } = post;
  const { Content, remarkPluginFrontmatter } = await post.render();

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawEditedAt,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    metadata = {},
  } = data;

  const slug = cleanSlug(rawSlug); // cleanSlug(rawSlug.split('/').pop());
  const publishDate = new Date(rawPublishDate);
  const editedAt = rawEditedAt ? new Date(rawEditedAt) : undefined;
  const category = rawCategory ? cleanSlug(rawCategory) : undefined;
  const tags = rawTags.map((tag: string) => cleanSlug(tag));

  return {
    id: id,
    slug: slug,
    permalink: `/courses/${slug}`,

    publishDate: publishDate,
    editedAt: editedAt,

    title: title,
    excerpt: excerpt,
    image: image,

    category: category,
    tags: tags,
    author: author,

    draft: draft,

    metadata,

    Content: Content,
    // or 'content' in case you consume from API

    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

const load = async function (): Promise<Array<Course>> {
  const posts = await getCollection('course');
  const normalizedCourses = posts.map(async (post) => await getNormalizedCourse(post));

  const results = (await Promise.all(normalizedCourses))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _posts: Array<Course>;

/** */
export const isBlogEnabled = APP_BLOG_CONFIG.isEnabled;
export const isBlogListRouteEnabled = APP_BLOG_CONFIG.list.isEnabled;
export const isBlogCourseRouteEnabled = APP_BLOG_CONFIG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG_CONFIG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG_CONFIG.tag.isEnabled;

export const blogListRobots = APP_BLOG_CONFIG.list.robots;
export const blogCourseRobots = APP_BLOG_CONFIG.post.robots;
export const blogCategoryRobots = APP_BLOG_CONFIG.category.robots;
export const blogTagRobots = APP_BLOG_CONFIG.tag.robots;

export const blogCoursesPerPage = APP_BLOG_CONFIG?.postsPerPage;
// export const blogCoursesPerPage = 1;

/** */
export const fetchCourses = async (): Promise<Array<Course>> => {
  if (!_posts) {
    _posts = await load();
  }

  return _posts;
};

/** */
export const findCoursesBySlugs = async (slugs: Array<string>): Promise<Array<Course>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchCourses();

  return slugs.reduce(function (r: Array<Course>, slug: string) {
    posts.some(function (post: Course) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findCoursesByIds = async (ids: Array<string>): Promise<Array<Course>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchCourses();

  return ids.reduce(function (r: Array<Course>, id: string) {
    posts.some(function (post: Course) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findLatestCourses = async ({ count }: { count?: number }): Promise<Array<Course>> => {
  const _count = count || 4;
  const posts = await fetchCourses();

  return posts ? posts.slice(0, _count) : [];
};

/** */
export const getStaticPathsCourseList = async (paginate: PaginateFunction) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  const result = paginate(await fetchCourses(), {
    params: { blog: BLOG_BASE || undefined },
    pageSize: blogCoursesPerPage,
  });
  return result;
};

/** */
export const getStaticPathsCoursePosts = async () => {
  const result = (await fetchCourses()).map((post) => ({
    params: {
      slug: post.slug,
    },
    props: { post },
  }));
  return result;
};

/** */
export const getStaticPathsCourseSeries = async (paginate: PaginateFunction) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchCourses();
  const series = new Set<string>();
  posts.forEach((post) => {
    const [folderName] = post.slug.split('/');
    series.add(folderName);
  });

  return Array.from(series).flatMap((seriesName: string) => {
    const seriesPosts = posts.filter((post) => {
      const [folderName] = post.slug.split('/');
      return seriesName === folderName;
    });
    const seriesInfo = paginate(seriesPosts, {
      params: { series: seriesName },
      pageSize: blogCoursesPerPage,
      props: { series: seriesName },
    });
    return seriesInfo;
  });
};
